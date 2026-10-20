(function attachPriceStages(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.VenditPriceStages = api;
}(globalThis, function createPriceStages() {
  const MIN_LIMIT = -100;
  const MAX_LIMIT = 300;
  const MIN_STEPS = 0;
  const PRICE_UNIT = 1000;
  const PRICE_DENOMINATOR = 100 * PRICE_UNIT;

  function floorDiv(numerator, denominator) {
    let quotient = numerator / denominator;
    const remainder = numerator % denominator;
    if (remainder !== 0n && numerator < 0n) quotient -= 1n;
    return quotient;
  }

  function ceilDiv(numerator, denominator) {
    return -floorDiv(-numerator, denominator);
  }

  function percentFromPrice(base, price) {
    const numerator = BigInt(price - base) * 100n;
    const denominator = BigInt(base);
    return Number(floorDiv(2n * numerator + denominator, 2n * denominator));
  }

  function chartPercentFromPrice(base, price) {
    return (price - base) * 100 / base;
  }

  function priceFromPercentLimit(base, percent, direction) {
    const numerator = BigInt(base) * BigInt(100 + percent);
    const denominator = BigInt(PRICE_DENOMINATOR);
    const units = direction === 'max'
      ? floorDiv(numerator, denominator)
      : ceilDiv(numerator, denominator);
    return Number(units * BigInt(PRICE_UNIT));
  }

  function percentRatio(value) {
    const text = String(value).trim();
    const match = text.match(/^([+-]?)(\d+)(?:\.(\d+))?$/);
    if (!match) return null;
    const decimals = match[3] || '';
    const scale = 10 ** decimals.length;
    const whole = Number(match[2]);
    const fraction = decimals ? Number(decimals) : 0;
    const unsigned = whole * scale + fraction;
    if (!Number.isSafeInteger(unsigned) || !Number.isSafeInteger(scale)) return null;
    return { numerator: (match[1] === '-' ? -1 : 1) * unsigned, scale };
  }

  function calculateManualStagePrice(basePrice, percent, direction, minPrice, maxPrice) {
    const base = Math.round(Number(basePrice));
    const inputPercent = percentRatio(percent);
    const min = Math.round(Number(minPrice));
    const max = Math.round(Number(maxPrice));
    if (!Number.isSafeInteger(base) || base <= 0 || !inputPercent
      || !Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max
      || !['up', 'down'].includes(direction)) return null;

    const factorNumerator = 100 * inputPercent.scale + inputPercent.numerator;
    if (!Number.isSafeInteger(factorNumerator)) return null;
    const numerator = BigInt(base) * BigInt(factorNumerator);
    const denominator = BigInt(PRICE_DENOMINATOR) * BigInt(inputPercent.scale);
    const safeNumerator = numerator < 0n ? 0n : numerator;
    const units = direction === 'up'
      ? floorDiv(safeNumerator, denominator)
      : ceilDiv(safeNumerator, denominator);
    const roundedPrice = Number(units * BigInt(PRICE_UNIT));
    const firstUpPrice = Number((floorDiv(BigInt(base), BigInt(PRICE_UNIT)) + 1n) * BigInt(PRICE_UNIT));
    const lastDownPrice = Number((ceilDiv(BigInt(base), BigInt(PRICE_UNIT)) - 1n) * BigInt(PRICE_UNIT));
    const amount = direction === 'up'
      ? Math.min(max, Math.max(firstUpPrice, roundedPrice))
      : Math.max(min, Math.min(lastDownPrice, roundedPrice));
    return Math.min(max, Math.max(min, amount));
  }

  function stageOverrides(prices, base, minPrice, maxPrice, direction, count) {
    if (!Array.isArray(prices)) return null;
    return Array.from({ length: count }, (_, index) => {
      if (prices[index] == null) return null;
      const value = Number(prices[index]);
      if (!Number.isSafeInteger(value) || value % PRICE_UNIT !== 0) return null;
      const rounded = value;
      const lower = direction === 'up'
        ? Number((floorDiv(BigInt(base), BigInt(PRICE_UNIT)) + 1n) * BigInt(PRICE_UNIT))
        : minPrice;
      const upper = direction === 'up'
        ? maxPrice
        : Number((ceilDiv(BigInt(base), BigInt(PRICE_UNIT)) - 1n) * BigInt(PRICE_UNIT));
      if (lower > upper) return null;
      return Math.min(upper, Math.max(lower, rounded));
    });
  }

  function calculatePriceStageModel(basePrice, minLimit, maxLimit, upCount, downCount, overrides = {}) {
    const base = Number(basePrice);
    const min = Number(minLimit);
    const max = Number(maxLimit);
    const upSteps = Number(upCount);
    const downSteps = Number(downCount);
    const inputsValid = Number.isSafeInteger(base) && base > 0
      && Number.isInteger(min) && min >= MIN_LIMIT && min < 0
      && Number.isInteger(max) && max > 0 && max <= MAX_LIMIT && min < max;
    if (!inputsValid) {
      return {
        valid: false, base, min, max, minPrice: 0, maxPrice: 0,
        upMaxCount: 0, downMaxCount: 0, upCount: upSteps, downCount: downSteps,
        up: [], down: [], upPrices: [], downPrices: [], upChartPercents: [], downChartPercents: [],
      };
    }

    const maxPrice = priceFromPercentLimit(base, max, 'max');
    const minPrice = priceFromPercentLimit(base, min, 'min');
    if (!Number.isSafeInteger(maxPrice) || !Number.isSafeInteger(minPrice)) {
      return {
        valid: false, base, min, max, minPrice, maxPrice,
        upMaxCount: 0, downMaxCount: 0, upCount: upSteps, downCount: downSteps,
        up: [], down: [], upPrices: [], downPrices: [], upChartPercents: [], downChartPercents: [],
      };
    }
    const upMaxCount = Math.max(0, Math.floor((maxPrice - base) / PRICE_UNIT));
    const downMaxCount = Math.max(0, Math.floor((base - minPrice) / PRICE_UNIT));
    const countsValid = Number.isInteger(upSteps) && upSteps >= MIN_STEPS && upSteps <= upMaxCount
      && Number.isInteger(downSteps) && downSteps >= MIN_STEPS && downSteps <= downMaxCount;
    if (!countsValid) {
      return {
        valid: false, base, min, max, minPrice, maxPrice, upMaxCount, downMaxCount,
        upCount: upSteps, downCount: downSteps,
        up: [], down: [], upPrices: [], downPrices: [], upChartPercents: [], downChartPercents: [],
      };
    }

    const generatedUp = Array.from({ length: upSteps }, (_, index) => {
      const step = index + 1;
      if (step === upSteps) return maxPrice;
      const numerator = BigInt(base) * BigInt(upSteps) + BigInt(maxPrice - base) * BigInt(step);
      const denominator = BigInt(upSteps) * BigInt(PRICE_UNIT);
      return Number(floorDiv(numerator, denominator) * BigInt(PRICE_UNIT));
    }).reverse();
    const generatedDown = Array.from({ length: downSteps }, (_, index) => {
      const step = index + 1;
      if (step === downSteps) return minPrice;
      const numerator = BigInt(base) * BigInt(downSteps) - BigInt(base - minPrice) * BigInt(step);
      const denominator = BigInt(downSteps) * BigInt(PRICE_UNIT);
      return Number(ceilDiv(numerator, denominator) * BigInt(PRICE_UNIT));
    });

    const upOverrides = stageOverrides(overrides.upPrices, base, minPrice, maxPrice, 'up', upSteps);
    const downOverrides = stageOverrides(overrides.downPrices, base, minPrice, maxPrice, 'down', downSteps);
    const upPrices = generatedUp.map((price, index) => upOverrides?.[index] ?? price);
    const downPrices = generatedDown.map((price, index) => downOverrides?.[index] ?? price);
    const amountsValid = upPrices.every((price) => Number.isSafeInteger(price) && price % PRICE_UNIT === 0
      && price >= base && price <= maxPrice)
      && downPrices.every((price) => Number.isSafeInteger(price) && price % PRICE_UNIT === 0
        && price >= minPrice && price <= base);

    return {
      valid: amountsValid,
      base, min, max, minPrice, maxPrice, upMaxCount, downMaxCount,
      upCount: upSteps, downCount: downSteps,
      upStepSize: upSteps ? (maxPrice - base) / upSteps : 0,
      downStepSize: downSteps ? (base - minPrice) / downSteps : 0,
      upPrices: amountsValid ? upPrices : [],
      downPrices: amountsValid ? downPrices : [],
      up: amountsValid ? upPrices.map((price) => percentFromPrice(base, price)) : [],
      down: amountsValid ? downPrices.map((price) => percentFromPrice(base, price)) : [],
      upChartPercents: amountsValid ? upPrices.map((price) => chartPercentFromPrice(base, price)) : [],
      downChartPercents: amountsValid ? downPrices.map((price) => chartPercentFromPrice(base, price)) : [],
    };
  }

  function calculateStagePrice(basePrice, percent) {
    return Math.round(Number(basePrice) * (1 + Number(percent) / 100));
  }

  return Object.freeze({
    MIN_LIMIT,
    MAX_LIMIT,
    MIN_STEPS,
    PRICE_UNIT,
    calculatePriceStageModel,
    calculateManualStagePrice,
    calculateStagePrice,
  });
}));
