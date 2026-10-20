const STORAGE_KEY = 'vendit-rms-prototype-v1';
const MIN_BASE_PRICE = 100;
const {
  MIN_LIMIT: MIN_PRICE_LIMIT,
  MAX_LIMIT: MAX_PRICE_LIMIT,
  MIN_STEPS: MIN_PRICE_STEPS,
} = window.VenditPriceStages;
const PROPERTIES = [
  { id: 'stay-gangnam', name: '스테이 한강 강남점', type: 'hotel' },
  { id: 'stay-hongdae', name: '스테이 한강 홍대점', type: 'demo' },
  { id: 'stay-haeundae', name: '스테이 부산 해운대점', type: 'demo' },
];
const COMPETITOR_ROOMS = [
  { id: 'single', name: '스탠다드 싱글', guests: 1, count: 4, basePrice: 79000 },
  { id: 'double', name: '스탠다드 더블', guests: 2, count: 12, basePrice: 89000 },
  { id: 'twin', name: '스탠다드 트윈', guests: 2, count: 6, basePrice: 99000 },
  { id: 'deluxe-double', name: '디럭스 더블', guests: 2, count: 5, basePrice: 129000 },
  { id: 'deluxe-twin', name: '디럭스 트윈', guests: 2, count: 8, basePrice: 119000 },
  { id: 'family', name: '패밀리 트리플', guests: 3, count: 3, basePrice: 159000 },
  { id: 'suite', name: '스위트', guests: 4, count: 3, basePrice: 189000 },
  { id: 'penthouse', name: '펜트하우스', guests: 6, count: 1, basePrice: 390000 },
];
const COMPETITORS = [
  { id: 'comp-1', name: '리버뷰 모텔 강남', type: 'motel', room: '스탠다드 더블', guests: 2, distance: .4, avg30: 112000, today: 118000, roomCount: 8, mapAngle: 135 },
  { id: 'comp-2', name: '선릉 스테이 모텔', type: 'motel', room: '디럭스 더블', guests: 2, distance: .9, avg30: 98000, today: 104000, roomCount: 5, mapAngle: 235 },
  { id: 'comp-3', name: '역삼 시티 모텔', type: 'motel', room: '스탠다드 더블', guests: 2, distance: 1.1, avg30: 86000, today: 89000, roomCount: 6, mapAngle: 90 },
  { id: 'comp-4', name: '강남 게스트하우스', type: 'guesthouse', room: '2인실', guests: 2, distance: 1.2, avg30: 54000, today: 52000, roomCount: 2, mapAngle: 250 },
  { id: 'comp-5', name: '삼성로 모텔', type: 'motel', room: '스탠다드 트윈', guests: 2, distance: 1.3, avg30: 92000, today: 104000, roomCount: 4, mapAngle: 155 },
  { id: 'comp-6', name: '호텔 루안', type: 'hotel', room: '디럭스 더블', guests: 2, distance: 1.7, avg30: 101000, today: 107000, roomCount: 14, mapAngle: 325 },
  { id: 'comp-7', name: '테헤란 모텔', type: 'motel', room: '슈페리어 더블', guests: 2, distance: 1.8, avg30: 125000, today: 132000, roomCount: 9, mapAngle: 220 },
  { id: 'comp-8', name: '선릉 비즈니스 호텔', type: 'hotel', room: '객실 정보 없음', guests: 2, distance: 1.9, avg30: null, today: null, roomCount: 0, mapAngle: 185 },
  { id: 'comp-9', name: '코엑스 호텔', type: 'hotel', room: '스탠다드 더블', guests: 2, distance: 1.95, avg30: 139000, today: 145000, roomCount: 21, mapAngle: 345 },
  { id: 'comp-10', name: '강남 시티 모텔', type: 'motel', room: '스탠다드 더블', guests: 2, distance: 1.98, avg30: 74000, today: 74000, roomCount: 7, mapAngle: 40 },
  { id: 'comp-11', name: '역삼 프리미어 호텔', type: 'hotel', room: '디럭스 트윈', guests: 2, distance: 2, avg30: 168000, today: 175000, roomCount: 26, mapAngle: 280 },
  { id: 'comp-12', name: '강남 센트럴 모텔', type: 'motel', room: '스탠다드 더블', guests: 2, distance: 2, avg30: 103000, today: 107000, roomCount: 19, mapAngle: 180 },
];
const MARKET_RECOMMENDATION_LIMIT = 5;
if (new URLSearchParams(location.search).has('reset')) {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* local storage may be unavailable */ }
  try { history.replaceState(null, '', location.pathname); } catch { /* history may be restricted in embedded previews */ }
}
const DEFAULT_STATE = {
  view: 'pricing',
  calendarMode: 'month',
  calendarDate: '2026-10-13',
  calendarRoomId: 'standard',
  calendarAppliedPrices: {},
  calendarManualPrices: {},
  step: 1,
  step2Unlocked: false,
  step3Unlocked: false,
  step4Unlocked: false,
  step5Unlocked: false,
  mappingCompleted: false,
  selectedMappingRoomId: 'standard',
  mappingByRoom: {},
  mappingSeasonSelection: {},
  propertyId: 'stay-gangnam',
  occupancyEnds: [30, 50, 70, 85, 100],
  removedRoomIds: [],
  rooms: [
    { id: 'standard', name: '스탠다드 더블', count: 12, basePrice: 89000 },
    { id: 'deluxe', name: '디럭스 트윈', count: 8, basePrice: 119000 },
    { id: 'suite', name: '스위트', count: 3, basePrice: 189000 },
  ],
  minLimit: -20,
  maxLimit: 40,
  up: [40, 20],
  down: [-10, -20],
  stagePriceOverrides: { upPrices: [], downPrices: [] },
  previewRoomId: 'standard',
  seasons: [
    { id: 'summer-peak', name: '여름 성수기', type: 'peak', active: true, periods: [{ startMonth: 7, startDay: 20, endMonth: 8, endDay: 20 }] },
    { id: 'summer-shoulder', name: '여름 준성수기', type: 'shoulder', active: true, periods: [{ startMonth: 7, startDay: 1, endMonth: 7, endDay: 19 }, { startMonth: 8, startDay: 21, endMonth: 8, endDay: 31 }] },
    { id: 'year-end', name: '연말연시', type: 'peak', active: true, periods: [{ startMonth: 12, startDay: 24, endMonth: 1, endDay: 1 }] },
    { id: 'holidays', name: '설 · 추석 연휴', type: 'holiday', active: false, automatic: true, periods: [] },
  ],
  busyWeekdays: [5, 6],
  holidayEveWeekend: true,
  marketRoomId: 'double',
  marketRadiusMeters: 2000,
  marketCategory: 'all',
  marketComparedIds: ['comp-1', 'comp-3', 'comp-7'],
  marketShowUnmatched: false,
  marketShowAll: false,
  marketZoom: 1,
};

const icons = {
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.2"/><path d="m15.4 15.4 4.3 4.3"/></svg>',
  bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>',
  hotel: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2M10 21v-3h4v3"/></svg>',
  doc: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l5 5v13H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h5M8 13h8M8 17h8"/></svg>',
  bed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5v15M3 16h18v4M3 10h18v6M7 10V7h5a3 3 0 0 1 3 3"/></svg>',
  chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 17 6-6 4 3 8-9"/><path d="M15 5h6v6"/></svg>',
  card: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>',
  sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5M4.5 10a7.5 7.5 0 0 1 13-3L20 12M4 17v-5h5m10.5 2a7.5 7.5 0 0 1-13 3L4 12"/></svg>',
  grip: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="5" cy="4" r="1.2"/><circle cx="11" cy="4" r="1.2"/><circle cx="5" cy="8" r="1.2"/><circle cx="11" cy="8" r="1.2"/><circle cx="5" cy="12" r="1.2"/><circle cx="11" cy="12" r="1.2"/></svg>',
};

function cloneDefaults() { return structuredClone(DEFAULT_STATE); }
let roomCatalogMigrationNeeded = false;
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !Array.isArray(saved.rooms) || !Array.isArray(saved.up) || !Array.isArray(saved.down)) return cloneDefaults();
    const removedRoomIds = Array.isArray(saved.removedRoomIds)
      ? [...new Set(saved.removedRoomIds.map(String))]
      : [];
    const savedRooms = (saved.rooms.length ? saved.rooms : cloneDefaults().rooms).map((room, index) => ({
      id: String(room.id || `room-${index}`),
      name: String(room.name || `객실 ${index + 1}`),
      count: Math.max(0, Math.round(Number(room.count) || 0)),
      basePrice: Math.max(0, Math.round(Number(room.basePrice) || 0)),
    }));
    const savedRoomsById = new Map(savedRooms.map((room) => [room.id, room]));
    const defaultRooms = cloneDefaults().rooms;
    const defaultRoomIds = new Set(defaultRooms.map((room) => room.id));
    const removedRoomIdSet = new Set(removedRoomIds);
    const rooms = [
      ...defaultRooms
        .filter((room) => !removedRoomIdSet.has(room.id))
        .map((room) => {
          const savedRoom = savedRoomsById.get(room.id);
          if (!savedRoom) roomCatalogMigrationNeeded = true;
          return savedRoom || room;
        }),
      ...savedRooms.filter((room) => !defaultRoomIds.has(room.id) && !removedRoomIdSet.has(room.id)),
    ];
    if (!Array.isArray(saved.removedRoomIds)
      || rooms.map((room) => room.id).join('|') !== savedRooms.filter((room) => !removedRoomIdSet.has(room.id)).map((room) => room.id).join('|')) {
      roomCatalogMigrationNeeded = true;
    }
    const storedMin = Number(saved.minLimit);
    const storedMax = Number(saved.maxLimit);
    const storedLimitsValid = Number.isFinite(storedMin) && Number.isFinite(storedMax)
      && storedMin >= MIN_PRICE_LIMIT && storedMin < 0 && storedMax > 0 && storedMax <= MAX_PRICE_LIMIT && storedMin < storedMax;
    const mappingCompleted = Boolean(saved.mappingCompleted);
    return {
      ...cloneDefaults(),
      ...saved,
      removedRoomIds,
      minLimit: storedLimitsValid ? storedMin : DEFAULT_STATE.minLimit,
      maxLimit: storedLimitsValid ? storedMax : DEFAULT_STATE.maxLimit,
      view: ['market', 'calendar'].includes(saved.view) && (saved.view !== 'calendar' || mappingCompleted) ? saved.view : 'pricing',
      calendarMode: saved.calendarMode === 'week' ? 'week' : 'month',
      calendarDate: /^\d{4}-\d{2}-\d{2}$/.test(saved.calendarDate || '') ? saved.calendarDate : DEFAULT_STATE.calendarDate,
      calendarRoomId: typeof saved.calendarRoomId === 'string' ? saved.calendarRoomId : DEFAULT_STATE.calendarRoomId,
      calendarAppliedPrices: saved.calendarAppliedPrices && typeof saved.calendarAppliedPrices === 'object' ? saved.calendarAppliedPrices : {},
      calendarManualPrices: saved.calendarManualPrices && typeof saved.calendarManualPrices === 'object' ? saved.calendarManualPrices : {},
      propertyId: PROPERTIES.some((property) => property.id === saved.propertyId) ? saved.propertyId : DEFAULT_STATE.propertyId,
      step3Unlocked: Boolean(saved.step3Unlocked),
      step4Unlocked: Boolean(saved.step4Unlocked),
      step5Unlocked: Boolean(saved.step5Unlocked),
      mappingCompleted,
      selectedMappingRoomId: typeof saved.selectedMappingRoomId === 'string' ? saved.selectedMappingRoomId : DEFAULT_STATE.selectedMappingRoomId,
      mappingByRoom: saved.mappingByRoom && typeof saved.mappingByRoom === 'object' ? saved.mappingByRoom : {},
      mappingSeasonSelection: saved.mappingSeasonSelection && typeof saved.mappingSeasonSelection === 'object' ? saved.mappingSeasonSelection : {},
      occupancyEnds: (Array.isArray(saved.occupancyEnds) ? saved.occupancyEnds : DEFAULT_STATE.occupancyEnds).map(Number).filter(Number.isFinite),
      step: saved.step === 5 && saved.step5Unlocked && saved.step4Unlocked ? 5 : saved.step === 4 && saved.step4Unlocked ? 4 : saved.step === 3 && saved.step3Unlocked ? 3 : saved.step === 2 && saved.step2Unlocked ? 2 : 1,
      rooms,
      up: saved.up.map(Number).filter(Number.isFinite),
      down: saved.down.map(Number).filter(Number.isFinite),
      stagePriceOverrides: saved.stagePriceOverrides && typeof saved.stagePriceOverrides === 'object'
        ? {
          upPrices: Array.isArray(saved.stagePriceOverrides.upPrices) ? saved.stagePriceOverrides.upPrices.map((value) => value == null ? null : Number(value)) : [],
          downPrices: Array.isArray(saved.stagePriceOverrides.downPrices) ? saved.stagePriceOverrides.downPrices.map((value) => value == null ? null : Number(value)) : [],
        }
        : { upPrices: [], downPrices: [] },
      seasons: Array.isArray(saved.seasons) ? saved.seasons.map((season, index) => ({
        id: String(season.id || `season-${index}`),
        name: String(season.name || `시즌 ${index + 1}`),
        type: ['peak', 'shoulder', 'holiday'].includes(season.type) ? season.type : 'peak',
        active: Boolean(season.active),
        automatic: Boolean(season.automatic),
        periods: Array.isArray(season.periods) ? season.periods.map((period) => ({
          startMonth: Math.max(1, Math.min(12, Math.round(Number(period.startMonth) || 1))),
          startDay: Math.max(1, Math.min(31, Math.round(Number(period.startDay) || 1))),
          endMonth: Math.max(1, Math.min(12, Math.round(Number(period.endMonth) || 1))),
          endDay: Math.max(1, Math.min(31, Math.round(Number(period.endDay) || 1))),
        })) : [],
      })) : cloneDefaults().seasons,
      busyWeekdays: Array.isArray(saved.busyWeekdays) ? saved.busyWeekdays.map(Number).filter((day) => Number.isInteger(day) && day >= 0 && day <= 6) : [5, 6],
      holidayEveWeekend: saved.holidayEveWeekend !== false,
      marketRoomId: COMPETITOR_ROOMS.some((room) => room.id === saved.marketRoomId) ? saved.marketRoomId : DEFAULT_STATE.marketRoomId,
      marketRadiusMeters: Math.max(100, Math.min(5000, Math.round(Number(saved.marketRadiusMeters) || 2000))),
      marketCategory: ['all', 'hotel', 'motel', 'guesthouse'].includes(saved.marketCategory) ? saved.marketCategory : 'all',
      marketComparedIds: Array.isArray(saved.marketComparedIds) ? saved.marketComparedIds.filter((id) => COMPETITORS.some((item) => item.id === id)).slice(0, 5) : [...DEFAULT_STATE.marketComparedIds],
      marketShowUnmatched: Boolean(saved.marketShowUnmatched),
      marketShowAll: Boolean(saved.marketShowAll),
      marketZoom: Math.max(1, Math.min(3, Math.round(Number(saved.marketZoom) || 1))),
    };
  } catch { return cloneDefaults(); }
}

let state = loadState();
delete state.stageCount;
const calculatePriceStageModel = window.VenditPriceStages.calculatePriceStageModel;
const app = document.querySelector('#app');
let toastTimer;
let propertyMenuOpen = false;
let rmsMenuOpen = false;
let seasonPopover = null;
let seasonDrawerOpen = false;
let seasonDraft = null;
let editingSeasonId = null;
let editingPeriodIndex = 0;
let creatingSeason = false;
let calendarOpen = false;
let calendarTarget = 'start';
let calendarPendingStart = null;
let calendarView = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };
let mappingOpenCell = null;
let mappingOpenSeasonCategory = '';
let mappingHelpOpen = false;
let resetConfirmOpen = false;
let seasonPopoverEntering = false;
let seasonDrawerEntering = false;
let seasonCalendarEntering = false;
let lastRenderedStep = state.step;
let lastRenderedView = state.view;
let lastRenderedCompleted = state.mappingCompleted;
let hasRenderedOnce = false;
let marketRoomMenuOpen = false;
let marketRoomSearchQuery = '';
let marketRadiusMenuOpen = false;
let marketSearchQuery = '';
let stageCountHighlight = null;
let stageCountHighlightTimer;
let marketResultsRefreshing = false;
let marketResultsRefreshTimer;
const money = (amount) => `${Math.round(Number(amount) || 0).toLocaleString('ko-KR')}원`;
const integer = (amount) => Math.round(Number(amount) || 0).toLocaleString('ko-KR');
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const roomTotal = () => state.rooms.reduce((sum, room) => sum + room.count, 0);
const selectedProperty = () => PROPERTIES.find((property) => property.id === state.propertyId) || PROPERTIES[0];
const averagePrice = () => {
  const total = roomTotal();
  if (!total) return 0;
  return Math.floor(state.rooms.reduce((sum, room) => sum + room.count * room.basePrice, 0) / total / 1000) * 1000;
};
const stagePrice = window.VenditPriceStages.calculateStagePrice;
const calculateManualStagePrice = window.VenditPriceStages.calculateManualStagePrice;
function highlightChangedPriceStage(type) {
  const count = state[type]?.length || 0;
  stageCountHighlight = count ? { type, index: type === 'up' ? count - 1 : 0 } : null;
  window.clearTimeout(stageCountHighlightTimer);
  stageCountHighlightTimer = window.setTimeout(() => {
    document.querySelectorAll('.count-highlight').forEach((element) => element.classList.remove('count-highlight'));
  }, 720);
}
function animateMarketResults() {
  marketResultsRefreshing = true;
  window.clearTimeout(marketResultsRefreshTimer);
  marketResultsRefreshTimer = window.setTimeout(() => {
    document.querySelectorAll('.market-results-refresh').forEach((element) => element.classList.remove('market-results-refresh'));
  }, 320);
}
function stageBasePrice() {
  return Number(state.rooms.find((room) => room.id === state.previewRoomId)?.basePrice
    ?? state.rooms[0]?.basePrice ?? 0);
}
function priceStageModel(base = stageBasePrice()) {
  return calculatePriceStageModel(base, state.minLimit, state.maxLimit, state.up.length, state.down.length, state.stagePriceOverrides);
}
function syncPriceStageValues() {
  const capacity = calculatePriceStageModel(stageBasePrice(), state.minLimit, state.maxLimit, 0, 0);
  if (!capacity.valid) return false;
  const upCount = Math.min(state.up.length, capacity.upMaxCount);
  const downCount = Math.min(state.down.length, capacity.downMaxCount);
  state.up = Array(upCount).fill(0);
  state.down = Array(downCount).fill(0);
  state.stagePriceOverrides = { upPrices: [], downPrices: [] };
  const model = calculatePriceStageModel(stageBasePrice(), state.minLimit, state.maxLimit, upCount, downCount);
  if (!model.valid) return false;
  state.up = model.up;
  state.down = model.down;
  return true;
}
function normalizeLoadedPriceStages() {
  const capacity = calculatePriceStageModel(stageBasePrice(), state.minLimit, state.maxLimit, 0, 0);
  if (!capacity.valid) return syncPriceStageValues();
  const upCount = Math.min(state.up.length, capacity.upMaxCount);
  const downCount = Math.min(state.down.length, capacity.downMaxCount);
  const countsChanged = upCount !== state.up.length || downCount !== state.down.length;
  state.up = Array(upCount).fill(0);
  state.down = Array(downCount).fill(0);
  if (countsChanged) state.stagePriceOverrides = { upPrices: [], downPrices: [] };
  const model = priceStageModel();
  if (!model.valid) return syncPriceStageValues();
  state.up = model.up;
  state.down = model.down;
}
normalizeLoadedPriceStages();
const selectedRoom = () => state.rooms.find((room) => room.id === state.previewRoomId) || state.rooms[0] || null;
function roomFieldErrors(room) {
  return {
    count: !Number.isInteger(Number(room.count)) || Number(room.count) < 1
      ? '객실 수는 1실 이상 입력해 주세요.' : '',
    basePrice: !Number.isFinite(Number(room.basePrice)) || Number(room.basePrice) < MIN_BASE_PRICE
      ? `기준가는 ${integer(MIN_BASE_PRICE)}원 이상 입력해 주세요.` : '',
  };
}
function roomValidationErrors() {
  if (!state.rooms.length) return ['객실 정보를 하나 이상 입력해 주세요.'];
  return state.rooms.flatMap((room) => {
    const errors = roomFieldErrors(room);
    return [errors.count && `${room.name}: ${errors.count}`, errors.basePrice && `${room.name}: ${errors.basePrice}`].filter(Boolean);
  });
}
function step2ValidationErrors() {
  const errors = [];
  const roomErrors = roomValidationErrors();
  if (roomErrors.length) errors.push('객실 수와 기준가를 STEP 1에서 확인해 주세요.');

  const min = Number(state.minLimit);
  const max = Number(state.maxLimit);
  const limitsValid = Number.isFinite(min) && Number.isFinite(max) && min >= MIN_PRICE_LIMIT && max <= MAX_PRICE_LIMIT && min < 0 && max > 0 && min < max;
  if (!limitsValid) errors.push(`최저 한도는 ${MIN_PRICE_LIMIT}% 이상 0% 미만, 최고 한도는 0% 초과 ${MAX_PRICE_LIMIT}% 이하로 설정해 주세요.`);
  const model = priceStageModel();
  const upStages = model.valid ? model.up : [];
  const downStages = model.valid ? model.down : [];
  const countsValid = Number.isInteger(state.up.length) && state.up.length >= MIN_PRICE_STEPS && state.up.length <= model.upMaxCount
    && Number.isInteger(state.down.length) && state.down.length >= MIN_PRICE_STEPS && state.down.length <= model.downMaxCount;
  if (!countsValid) errors.push('가격 단계 수를 현재 한도 범위에 맞춰 주세요.');
  if (!model.valid || model.min !== min || model.max !== max
    || model.up.length !== state.up.length || model.down.length !== state.down.length) {
    errors.push('가격 단계가 최저·최고 한도 안에 있는지 확인해 주세요.');
  }

  const stages = [
    ...upStages.map((pct, index) => ({ type: 'up', pct: Number(pct), price: model.upPrices[index], name: `올리는 ${upStages.length - index}단계` })),
    ...downStages.map((pct, index) => ({ type: 'down', pct: Number(pct), price: model.downPrices[index], name: `내리는 ${index + 1}단계` })),
  ];
  const validStages = stages.every(({ type, pct }) => Number.isFinite(pct)
    && Number.isInteger(pct)
    && (type === 'up' ? pct > 0 : pct < 0)
    && limitsValid && pct >= min && pct <= max);
  if (!validStages) errors.push('가격 단계가 최저·최고 한도 안에 있는지 확인해 주세요.');

  for (const room of state.rooms) {
    const base = Number(room.basePrice);
    if (!Number.isFinite(base) || base < MIN_BASE_PRICE) continue;
    if (limitsValid && stagePrice(base, min) <= 0) {
      errors.push(`${room.name}의 최저 한도 금액이 0원 이하예요. 기준가를 올리거나 최저 한도를 조정해 주세요.`);
    }
    for (const stage of stages) {
      const stageAmount = room.id === state.previewRoomId ? stage.price : stagePrice(base, stage.pct);
      if (Number.isFinite(stageAmount) && stageAmount <= 0) {
        errors.push(`${room.name}의 ${stage.name} 금액이 0원 이하예요. 기준가나 단계 값을 조정해 주세요.`);
      }
    }
  }
  return [...new Set(errors)];
}
const step1IsValid = () => roomValidationErrors().length === 0;
function occupancyRanges() {
  const total = roomTotal();
  let lowerPercent = 0;
  return state.occupancyEnds.map((rawEnd, index) => {
    const upperPercent = Number(rawEnd);
    const startRooms = lowerPercent === 0 ? 0 : Math.ceil(lowerPercent * total / 100);
    const endRooms = upperPercent === 100 ? total : Math.ceil(upperPercent * total / 100) - 1;
    const soldStart = lowerPercent === 0 ? 1 : startRooms;
    const tileCount = Math.max(0, endRooms - soldStart + 1);
    const range = {
      index,
      letter: String.fromCharCode(65 + index),
      lowerPercent,
      upperPercent,
      startRooms,
      endRooms,
      soldStart,
      tileCount,
    };
    lowerPercent = upperPercent;
    return range;
  });
}
function occupancyValidationErrors() {
  const errors = [];
  const ends = state.occupancyEnds;
  const total = roomTotal();
  if (total < 1) errors.push('숙소 전체 객실 수를 먼저 확인해 주세요.');
  if (ends.length < 2) errors.push('점유율 구간은 두 개 이상 필요해요.');
  if (ends.length > 8) errors.push('점유율 구간은 최대 8개까지 설정할 수 있어요.');
  if (ends.at(-1) !== 100) errors.push('마지막 구간은 100%까지 이어져야 해요.');
  if (ends.some((end, index) => !Number.isInteger(end) || end <= (index ? ends[index - 1] : 0) || end > 100)) {
    errors.push('점유율 경계는 0%보다 크고, 앞 구간보다 높아야 해요.');
  }
  const emptyRange = occupancyRanges().some((range) => range.index > 0 && range.endRooms < range.startRooms);
  if (emptyRange) errors.push('전체 객실 수에 비해 구간이 너무 촘촘해요. 경계값을 조정해 주세요.');
  return [...new Set(errors)];
}
const occupancyIsValid = () => occupancyValidationErrors().length === 0;
function setupCompletionError() {
  return roomValidationErrors()[0]
    || step2ValidationErrors()[0]
    || occupancyValidationErrors()[0]
    || '';
}
function addOccupancyRange() {
  if (state.occupancyEnds.length >= 8) return;
  let lower = 0;
  let splitIndex = -1;
  let widest = 1;
  state.occupancyEnds.forEach((end, index) => {
    const width = end - lower;
    if (width > widest) { widest = width; splitIndex = index; }
    lower = end;
  });
  if (splitIndex < 0) return;
  const previous = splitIndex === 0 ? 0 : state.occupancyEnds[splitIndex - 1];
  const next = state.occupancyEnds[splitIndex];
  state.occupancyEnds.splice(splitIndex, 0, Math.floor((previous + next) / 2));
}
const priceStageName = (type, index) => {
  const model = priceStageModel();
  const stages = type === 'up' ? model.up : model.down;
  return type === 'up' ? `+${stages.length - index}단계` : `-${index + 1}단계`;
};
const priceStageColor = (pct) => pct > 0 ? 'up' : pct < 0 ? 'down' : 'base';
const percentText = (value) => {
  const numeric = Number(value);
  const rounded = Math.sign(numeric) * Math.round((Math.abs(numeric) + Number.EPSILON) * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
};
const fmtPct = (value) => `${Number(value) > 0 ? '+' : ''}${percentText(value)}%`;
const MAPPING_CATEGORIES = ['weekday', 'weekend', 'shoulder', 'peak'];
const MAPPING_RECOMMENDATIONS = {
  weekday: ['down-1', 'down-0', 'base', 'base', 'up-1'],
  weekend: ['down-0', 'base', 'base', 'up-1', 'up-0'],
  shoulder: ['down-0', 'base', 'up-1', 'up-1', 'up-0'],
  peak: ['base', 'up-1', 'up-0', 'up-0', 'up-0'],
};
function mappingStageOptions() {
  const model = priceStageModel();
  const up = model.valid ? model.up : [];
  const down = model.valid ? model.down : [];
  return [
    ...up.map((pct, index) => ({ key: `up-${index}`, name: priceStageName('up', index), percent: Number(pct) })),
    { key: 'base', name: '기준가', percent: 0 },
    ...down.map((pct, index) => ({ key: `down-${index}`, name: priceStageName('down', index), percent: Number(pct) })),
  ];
}
function recommendedMappingKey(category, index) {
  const model = priceStageModel();
  const upCount = model.valid ? model.up.length : 0;
  const downCount = model.valid ? model.down.length : 0;
  const pattern = MAPPING_RECOMMENDATIONS[category] || [];
  let key = pattern[Math.min(index, pattern.length - 1)] || 'base';
  if (key.startsWith('up-') && Number(key.slice(3)) >= upCount) key = upCount ? `up-${upCount - 1}` : 'base';
  if (key.startsWith('down-') && Number(key.slice(5)) >= downCount) key = downCount ? `down-${downCount - 1}` : 'base';
  return key;
}
function ensureMappingRoom(roomId) {
  if (!state.mappingByRoom || typeof state.mappingByRoom !== 'object') state.mappingByRoom = {};
  const current = state.mappingByRoom[roomId] && typeof state.mappingByRoom[roomId] === 'object' ? state.mappingByRoom[roomId] : {};
  const available = new Set(mappingStageOptions().map((option) => option.key));
  const rows = occupancyRanges();
  const next = {};
  for (const category of MAPPING_CATEGORIES) {
    const saved = Array.isArray(current[category]) ? current[category] : [];
    next[category] = rows.map((_, index) => available.has(saved[index]) ? saved[index] : recommendedMappingKey(category, index));
  }
  state.mappingByRoom[roomId] = next;
  return next;
}
function resetMappingRoomToRecommendations(roomId) {
  const mapping = ensureMappingRoom(roomId);
  const rows = occupancyRanges();
  for (const category of MAPPING_CATEGORIES) {
    mapping[category] = rows.map((_, index) => recommendedMappingKey(category, index));
  }
  return mapping;
}
function mappingOption(key) {
  return mappingStageOptions().find((option) => option.key === key) || { key: 'base', name: '기준가', percent: 0 };
}
function mappingLevel(key) {
  if (key === 'base') return '';
  const [type, rawIndex] = key.split('-');
  const index = Number(rawIndex) || 0;
  const model = priceStageModel();
  const strength = type === 'up' ? model.up.length - index : index + 1;
  return `level-${Math.min(Math.max(strength, 1), 2)}`;
}
function activeMappingSeasons(category) {
  return state.seasons.filter((season) => season.active && !season.automatic && season.type === category);
}
function selectedMappingSeasons(category) {
  const active = activeMappingSeasons(category);
  const selectedIds = state.mappingSeasonSelection?.[category];
  return Array.isArray(selectedIds) ? active.filter((season) => selectedIds.includes(season.id)) : active;
}
function mappingCellMarkup(category, range, room, mapping) {
  const key = mapping[category][range.index];
  const option = mappingOption(key);
  const color = priceStageColor(option.percent);
  const level = mappingLevel(key);
  const active = mappingOpenCell?.category === category && mappingOpenCell?.index === range.index;
  const activeRow = mappingOpenCell?.index === range.index;
  const activeColumn = mappingOpenCell?.category === category;
  const categoryLabel = { weekday: '평일', weekend: '주말', shoulder: '준성수기', peak: '성수기' }[category] || category;
  const choices = mappingStageOptions().map((choice) => {
    const choiceColor = priceStageColor(choice.percent);
    const recommended = recommendedMappingKey(category, range.index) === choice.key;
    const selected = choice.key === key;
    const choiceLevel = mappingLevel(choice.key);
    return `<button class="mapping-option ${choiceColor} ${choiceLevel} ${selected ? 'selected' : ''}" role="option" aria-selected="${selected}" data-map-choice="${category}|${range.index}|${choice.key}"><span class="mapping-option-swatch ${choiceColor} ${choiceLevel}"></span><strong>${choice.name}</strong><small>${fmtPct(choice.percent)}</small>${recommended ? '<em>추천</em>' : ''}<b>${money(stagePrice(room?.basePrice || 0, choice.percent))}</b>${selected ? '<span class="mapping-option-check">✓</span>' : ''}</button>`;
  }).join('');
  const context = `<div class="mapping-option-context"><div class="mapping-option-context-title"><span class="mapping-range-letter tone-${range.index % 5}">${range.letter}</span><strong>${range.startRooms}~${range.endRooms}실 판매</strong><b>+</b><strong>${categoryLabel}</strong></div><small>${esc(room?.name || '객실')}</small></div>`;
  return `<div class="mapping-cell-wrap ${activeRow ? 'active-row' : ''} ${activeColumn ? 'active-column' : ''} ${active ? 'menu-open' : ''}"><button class="mapping-cell ${color} ${level}" aria-haspopup="listbox" aria-expanded="${active}" data-map-cell="${category}|${range.index}"><strong>${option.name}</strong><span>${money(stagePrice(room?.basePrice || 0, option.percent))}</span><i>⌄</i></button>${active ? `<div class="mapping-option-menu" role="listbox" aria-label="${range.letter} 구간 ${categoryLabel} 가격 단계">${context}${choices}</div>` : ''}</div>`;
}
function mappingSeasonPicker(category, label) {
  const seasons = activeMappingSeasons(category);
  const selected = selectedMappingSeasons(category);
  const open = mappingOpenSeasonCategory === category;
  const items = seasons.length
    ? seasons.map((season) => `<label class="mapping-season-option"><input type="checkbox" data-mapping-season-toggle="${category}|${esc(season.id)}" ${selected.some((item) => item.id === season.id) ? 'checked' : ''}><span>${esc(season.name)}</span></label>`).join('')
    : '<p class="mapping-season-empty">사용 중인 시즌이 없어요.</p>';
  return `<div class="mapping-season-picker"><button class="mapping-season-count" data-mapping-season-picker="${category}" aria-expanded="${open}">시즌 ${selected.length}개 <span>⌄</span></button>${open ? `<div class="mapping-season-menu"><strong>${label} 적용 시즌</strong>${items}</div>` : ''}</div>`;
}
function mappingHelp() {
  return `<section class="mapping-help ${mappingHelpOpen ? 'open' : ''}"><button class="mapping-help-toggle" data-mapping-help-toggle aria-expanded="${mappingHelpOpen}"><span class="mapping-info-icon">ⓘ</span><strong>주말과 시즌이 겹치면 어떤 가격이 적용될까요?</strong><span class="mapping-help-chevron">${mappingHelpOpen ? '⌃' : '⌄'}</span></button>${mappingHelpOpen ? `<div class="mapping-help-body"><p>겹치는 날에는 <strong>더 높은 가격 단계 하나만</strong> 적용돼요.</p><div class="mapping-help-example"><small><b>예시</b> 주말은 -1단계, 성수기는 +1단계일 때</small><div class="mapping-help-flow"><div><small>주말 <em>더 낮음</em></small><strong>-1단계 <span>-10%</span></strong></div><b class="mapping-vs">vs</b><div class="higher"><small>성수기 <em>더 높음</em></small><strong>+1단계 <span>+20%</span></strong></div><span class="mapping-help-arrow">→</span><div class="final"><small>최종 적용</small><strong>+1단계 <span>+20%</span></strong></div></div></div></div>` : ''}</section>`;
}
function mappingContent() {
  const rooms = state.rooms;
  const priceStages = priceStageModel();
  const downStages = priceStages.valid ? priceStages.down : [];
  const upStages = priceStages.valid ? priceStages.up : [];
  if (!rooms.some((room) => room.id === state.selectedMappingRoomId)) state.selectedMappingRoomId = rooms[0]?.id || '';
  const room = rooms.find((item) => item.id === state.selectedMappingRoomId) || null;
  const mapping = room ? ensureMappingRoom(room.id) : Object.fromEntries(MAPPING_CATEGORIES.map((category) => [category, []]));
  const ranges = occupancyRanges();
  const weekdayLabels = state.busyWeekdays.length
    ? `${state.busyWeekdays.map((day) => WEEKDAYS[day]).join(' · ')}${state.holidayEveWeekend ? ' · 공휴일 전날' : ''}`
    : (state.holidayEveWeekend ? '공휴일 전날' : '없음');
  const columns = [
    { id: 'weekday', title: '평일', subtitle: '나머지 모든 날' },
    { id: 'weekend', title: '주말', subtitle: weekdayLabels },
    { id: 'shoulder', title: '준성수기', picker: mappingSeasonPicker('shoulder', '준성수기') },
    { id: 'peak', title: '성수기', picker: mappingSeasonPicker('peak', '성수기') },
  ];
  return `<section class="question-card mapping-card">
    <div class="mapping-toolbar"><label class="mapping-room-select"><span>객실 종류</span><select data-mapping-room>${rooms.map((item) => `<option value="${esc(item.id)}" ${item.id === state.selectedMappingRoomId ? 'selected' : ''}>${esc(item.name)}　추천값</option>`).join('')}</select><i>⌄</i></label><button class="secondary-button mapping-reset-button" data-mapping-reset>${icons.refresh}<span>추천값으로 되돌리기</span></button></div>
    <div class="mapping-grid-wrap"><div class="mapping-grid">
      <div class="mapping-column-heading mapping-occupancy-heading"><strong>판매 상황</strong><span>전체 ${roomTotal()}실 기준 <button data-mapping-edit-ranges>구간 수정</button></span></div>
      ${columns.map((column) => `<div class="mapping-column-heading ${mappingOpenCell?.category === column.id ? 'active-column' : ''}"><strong>${column.title}</strong>${column.subtitle ? `<span class="mapping-column-chip">${esc(column.subtitle)}</span>` : column.picker}</div>`).join('')}
      ${ranges.map((range) => `<div class="mapping-row-label ${mappingOpenCell?.index === range.index ? 'selected-row' : ''}"><span class="mapping-range-letter tone-${range.index % 5}">${range.letter}</span><span><strong>${range.startRooms}~${range.endRooms}실 판매</strong><small>${range.lowerPercent}~${range.upperPercent}%</small></span></div>${columns.map((column) => mappingCellMarkup(column.id, range, room, mapping)).join('')}`).join('')}
    </div></div>
    <div class="mapping-legend">${downStages.map((_, index) => `<span><i class="down level-${Math.min(downStages.length - index, 2)}"></i>-${index + 1}단계</span>`).join('')}<span><i class="base"></i>기준가</span>${upStages.slice().reverse().map((_, index) => `<span><i class="up level-${Math.min(index + 1, 2)}"></i>+${index + 1}단계</span>`).join('')}</div>
    ${mappingHelp()}
  </section>`;
}

function marketRoom() {
  return COMPETITOR_ROOMS.find((room) => room.id === state.marketRoomId) || COMPETITOR_ROOMS[1];
}
function marketOwnPrice(room = marketRoom()) {
  const linkedRoom = room.id === 'double' ? state.rooms.find((item) => item.id === 'standard')
    : room.id === 'deluxe-twin' ? state.rooms.find((item) => item.id === 'deluxe')
      : room.id === 'suite' ? state.rooms.find((item) => item.id === 'suite') : null;
  return linkedRoom?.basePrice || room.basePrice;
}
function marketRadiusKm() { return Number(state.marketRadiusMeters) / 1000; }
function marketRadiusLabel(meters = state.marketRadiusMeters) {
  const value = Number(meters);
  return value < 1000 ? `${value}m` : `${(value / 1000).toFixed(value % 1000 ? 1 : 0)}km`;
}
function marketMapZoom() {
  return Number(Math.pow(1.25, Math.max(0, Math.min(2, Number(state.marketZoom) - 1))).toFixed(2));
}
function marketMapImageZoom() {
  // Keep the map art at least as large as its viewport so a wider search
  // radius never exposes the flat canvas behind it.
  return Number(Math.max(1, Math.min(1.55, 2 / Math.max(.1, marketRadiusKm()))).toFixed(2));
}
function marketRadiusScale() {
  return Number(Math.max(.05, Math.min(2.5, marketRadiusKm() / 2)).toFixed(2));
}
function marketMapPinPosition(item) {
  const angle = (item.mapAngle ?? Math.atan2(item.y - 57, item.x - 55) * 180 / Math.PI) * Math.PI / 180;
  const distanceRatio = item.distance / Math.max(.1, marketRadiusKm());
  // Keep markers at their geographic scale as the search circle grows.
  const radiusUnits = Math.min(distanceRatio * (33 * marketRadiusScale()), 43);
  return {
    x: Number((55 + Math.cos(angle) * radiusUnits).toFixed(2)),
    y: Number((57 + Math.sin(angle) * radiusUnits).toFixed(2)),
  };
}
function marketMapBlockArt() {
  let seed = 193;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const blocks = [];
  for (let row = -1; row < 12; row += 1) {
    for (let col = -1; col < 12; col += 1) {
      const x = col * 49 + 8 + random() * 8;
      const y = row * 48 + 7 + random() * 7;
      const width = 32 + random() * 12;
      const height = 30 + random() * 12;
      const cutA = 3 + random() * 7;
      const cutB = 3 + random() * 6;
      const buildingCount = 2 + Math.floor(random() * 3);
      blocks.push(`<path d="M${x.toFixed(1)} ${y.toFixed(1)}l${cutA.toFixed(1)} -2 ${width.toFixed(1)} 1 2 ${cutB.toFixed(1)} -2 ${height.toFixed(1)} -${cutB.toFixed(1)} 2 -${width.toFixed(1)} -1 -${cutA.toFixed(1)}z"/>`);
      for (let building = 0; building < buildingCount; building += 1) {
        const bx = x + 4 + random() * (width * .62);
        const by = y + 4 + random() * (height * .62);
        const bw = 6 + random() * 8;
        const bh = 6 + random() * 9;
        blocks.push(`<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="1.4"/>`);
      }
    }
  }
  return blocks.join('');
}
function syncMarketRadiusPreview() {
  const mapLayer = document.querySelector('.market-map-layer');
  const mapArt = document.querySelector('.market-map-art');
  const mapRadius = document.querySelector('.market-map-radius');
  const label = marketRadiusLabel();
  if (mapLayer) mapLayer.style.setProperty('--market-zoom', marketMapZoom());
  if (mapArt) mapArt.style.setProperty('--market-image-zoom', marketMapImageZoom());
  if (mapRadius) mapRadius.style.setProperty('--radius-scale', marketRadiusScale());
  const mapScale = document.querySelector('.market-map-scale');
  if (mapScale) mapScale.textContent = label;
  const triggerLabel = document.querySelector('[data-market-radius-trigger-label]');
  if (triggerLabel) triggerLabel.textContent = `거리 · ${label} 안`;
  const valueLabel = document.querySelector('[data-market-radius-value]');
  if (valueLabel) valueLabel.textContent = label;
  const presets = [500, 1000, 2000, 3000];
  document.querySelectorAll('[data-market-radius]').forEach((button) => {
    button.classList.toggle('selected', Number(button.dataset.marketRadius) === Number(state.marketRadiusMeters));
  });
  document.querySelector('.market-custom-radius .radius-radio')?.classList.toggle('selected', !presets.includes(Number(state.marketRadiusMeters)));
  document.querySelectorAll('[data-market-map-pin]').forEach((pin) => {
    const competitor = COMPETITORS.find((item) => item.id === pin.dataset.marketMapPin);
    const outside = !competitor || competitor.distance > marketRadiusKm();
    const selected = state.marketComparedIds.includes(pin.dataset.marketMapPin);
    if (competitor) {
      const position = marketMapPinPosition(competitor);
      pin.style.left = `${position.x}%`;
      pin.style.top = `${position.y}%`;
    }
    pin.classList.remove('outside-radius');
    pin.hidden = outside;
  });
}
function marketRoomCompareCount(room) {
  return ({ single: 4, double: 5, twin: 5, 'deluxe-double': 5, 'deluxe-twin': 5, family: 2, suite: 3, penthouse: 0 })[room.id] ?? 0;
}
function marketCompetitorRoom(item) {
  const room = marketRoom();
  if (item.roomCount <= 0 || item.today == null || marketRoomCompareCount(room) === 0) return null;
  if (room.guests === 2) return item;
  const factor = ({ 1: .82, 3: 1.32, 4: 1.62, 6: 2.2 })[room.guests] || 1;
  const price = (value) => Math.round(value * factor / 1000) * 1000;
  return { ...item, room: room.name, guests: room.guests, avg30: price(item.avg30), today: price(item.today) };
}
function marketVisibleList() {
  return COMPETITORS.filter((item) => {
    if (state.marketCategory !== 'all' && item.type !== state.marketCategory) return false;
    return item.distance <= marketRadiusKm() || state.marketComparedIds.includes(item.id);
  });
}
function marketCategoryList() {
  return COMPETITORS.filter((item) => state.marketCategory === 'all' || item.type === state.marketCategory);
}
function marketRateDifference(item) {
  const comparisonRoom = marketCompetitorRoom(item);
  if (!comparisonRoom) return { text: '—', className: 'muted' };
  const own = marketOwnPrice();
  if (!own) return { text: '—', className: 'muted' };
  const difference = Math.round((comparisonRoom.today / own - 1) * 100);
  if (!difference) return { text: '같음', className: 'same' };
  return { text: `${difference > 0 ? '+' : ''}${difference}%`, className: difference > 0 ? 'higher' : 'lower' };
}
function marketRoomOptions() {
  const query = marketRoomSearchQuery.trim().toLocaleLowerCase('ko-KR');
  const groups = [
    { label: '1~2인', rooms: COMPETITOR_ROOMS.filter((room) => room.guests <= 2) },
    { label: '3~4인', rooms: COMPETITOR_ROOMS.filter((room) => room.guests >= 3 && room.guests <= 4) },
    { label: '5인 이상', rooms: COMPETITOR_ROOMS.filter((room) => room.guests >= 5) },
  ];
  const matchingRooms = groups.map((group) => {
    const rooms = group.rooms.filter((room) => {
      const matchesQuery = !query || `${room.name} ${room.guests}인 ${room.count}실`.toLocaleLowerCase('ko-KR').includes(query);
      return matchesQuery && (!state.marketShowUnmatched || marketRoomCompareCount(room) < 4);
    });
    return rooms.length ? `<div class="market-room-group"><small>${group.label}</small>${rooms.map((room) => {
      const count = marketRoomCompareCount(room);
      const selected = room.id === state.marketRoomId;
      return `<button class="market-room-option ${selected ? 'selected' : ''} ${count === 0 ? 'unavailable' : ''}" role="option" aria-selected="${selected}" data-market-room="${room.id}"><span><strong>${esc(room.name)}</strong><small>${room.guests}인 · ${room.count}실</small></span><b class="${count < 5 ? 'partial' : ''}">${count ? `${count}/5곳 비교` : '비교할 곳 없음'}</b>${selected ? '<i>✓</i>' : ''}</button>`;
    }).join('')}</div>` : '';
  }).join('');
  return matchingRooms || '<p class="market-room-empty">일치하는 객실이 없어요.</p>';
}
function marketRoomMenu() {
  if (!marketRoomMenuOpen) return '';
  return `<div class="market-room-menu" role="listbox" aria-label="비교할 내 객실"><label class="market-room-search"><span>⌕</span><input data-market-room-search value="${esc(marketRoomSearchQuery)}" placeholder="객실 이름으로 찾기" aria-label="객실 이름으로 찾기"></label><div class="market-room-options" data-market-room-options>${marketRoomOptions()}</div><label class="market-unmatched-toggle"><input type="checkbox" data-market-show-unmatched ${state.marketShowUnmatched ? 'checked' : ''}><span>비교가 부족한 객실만 보기 <b>3종</b></span></label></div>`;
}
function marketRadiusMenu() {
  if (!marketRadiusMenuOpen) return '';
  const presets = [500, 1000, 2000, 3000];
  const rangeLabel = marketRadiusLabel();
  return `<div class="market-radius-menu"><strong>내 숙소에서 거리</strong><div class="market-radius-presets">${presets.map((meters) => {
    const count = COMPETITORS.filter((item) => item.distance <= meters / 1000).length;
    const label = meters < 1000 ? `${meters}m 안` : `${meters / 1000}km 안`;
    return `<button class="${Number(state.marketRadiusMeters) === meters ? 'selected' : ''}" data-market-radius="${meters}"><span class="radius-radio"></span>${label}<small>숙소 ${count}곳</small></button>`;
  }).join('')}</div><div class="market-custom-radius"><label><span class="radius-radio ${presets.includes(Number(state.marketRadiusMeters)) ? '' : 'selected'}"></span><strong>직접 설정</strong></label><span class="market-radius-value" data-market-radius-value>${rangeLabel}</span><input type="range" min="100" max="5000" step="100" value="${state.marketRadiusMeters}" data-market-radius-slider aria-label="검색 거리 직접 설정"><div><small>100m</small><small>5km</small></div></div><p>범위를 줄여도 이미 고른 숙소는 그대로 남아요.</p></div>`;
}
function marketSearchResults() {
  const query = marketSearchQuery.trim().toLocaleLowerCase('ko-KR');
  if (!query) return '';
  const matches = COMPETITORS.filter((item) => item.name.toLocaleLowerCase('ko-KR').includes(query)).slice(0, 5);
  if (!matches.length) return `<div class="market-search-results"><strong>검색 결과 0곳</strong><div class="market-search-empty"><b>‘${esc(marketSearchQuery)}’와 일치하는 숙소가 없어요</b><span>띄어쓰기나 다른 이름으로 다시 찾아보세요.<br>거리 범위와 상관없이 5km 안 숙소에서 찾아요.</span></div></div>`;
  return `<div class="market-search-results"><strong>검색 결과 ${matches.length}곳</strong>${matches.map((item) => {
    const selected = state.marketComparedIds.includes(item.id);
    const outOfRange = item.distance > marketRadiusKm();
    const comparisonRoom = marketCompetitorRoom(item);
    return `<button class="market-search-result ${selected ? 'selected' : ''} ${comparisonRoom ? '' : 'unavailable'}" data-market-search-result="${item.id}" ${comparisonRoom ? '' : 'disabled'}><span class="fake-checkbox ${selected ? 'checked' : ''}">${selected ? '✓' : ''}</span><span><b>${esc(item.name)}</b><small>${marketTypeLabel(item.type)} · ${item.distance.toFixed(1)}km · 오늘 ${comparisonRoom ? money(comparisonRoom.today) : '비교 객실 없음'}</small></span>${outOfRange ? '<em>범위 밖</em>' : selected ? '<i>선택됨</i>' : ''}</button>`;
  }).join('')}<p>설정한 거리 범위 밖의 숙소도 5km 안이라면 검색해 고를 수 있어요.</p></div>`;
}
function marketTypeLabel(type) { return ({ hotel: '호텔', motel: '모텔', guesthouse: '게스트하우스' })[type] || '숙소'; }
function marketSummary() {
  const selected = COMPETITORS.filter((item) => state.marketComparedIds.includes(item.id)).map(marketCompetitorRoom).filter(Boolean);
  const average = selected.length ? Math.round(selected.reduce((sum, item) => sum + item.today, 0) / selected.length / 1000) * 1000 : 0;
  const own = marketOwnPrice();
  const gap = average ? Math.round(Math.abs(average - own) / average * 100) : 0;
  const comparison = average === 0 ? '선택한 숙소의 가격 정보를 모으면 비교해요.'
    : average === own ? '선택 숙소 평균과 같아요.'
      : `평균보다 ${gap}% ${own < average ? '낮아요' : '높아요'}`;
  const comparisonClass = average === 0 ? '' : own <= average ? 'lower' : 'higher';
  return `<div class="market-summary"><div><small>선택</small><strong><b>${state.marketComparedIds.length}곳</b> · 최대 5곳</strong></div><div><small>선택한 숙소 오늘 평균</small><strong>${average ? money(average) : '—'}</strong></div><div><small>내 오늘 가격 · ${esc(marketRoom().name)}</small><strong>${money(own)} <em class="${comparisonClass}">${comparison}</em></strong></div></div>`;
}
function marketMap() {
  const markers = COMPETITORS.map((item) => ({ item, comparisonRoom: marketCompetitorRoom(item) })).filter(({ comparisonRoom, item }) => comparisonRoom && item.distance <= 5).map(({ item, comparisonRoom }) => {
    const selected = state.marketComparedIds.includes(item.id);
    const visible = item.distance <= marketRadiusKm();
    const position = marketMapPinPosition(item);
    return `<button class="market-map-price ${selected ? 'selected' : ''}" style="left:${position.x}%;top:${position.y}%" data-market-map-pin="${item.id}" ${visible ? '' : 'hidden'} aria-label="${esc(item.name)} ${money(comparisonRoom.today)} ${selected ? '선택됨' : ''}">${money(comparisonRoom.today).replace('원', '')}${selected ? '<i>✓</i>' : ''}</button>`;
  }).join('');
  const room = marketRoom();
  const own = marketOwnPrice();
  return `<div class="market-map-canvas${marketResultsRefreshing ? ' market-results-refresh' : ''}" aria-label="주변 경쟁 숙소 지도">
    <div class="market-map-layer" style="--market-zoom:${marketMapZoom()}">
      <svg class="market-map-art" style="--market-image-zoom:${marketMapImageZoom()}" viewBox="0 0 520 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="520" height="520" fill="#e8edef"/>
        <g fill="#fbfbf8" stroke="#d7dfe1" stroke-width="1.1" transform="rotate(-8 260 260)">${marketMapBlockArt()}</g>
        <path d="M-18 28C80 64 153 106 244 135S426 192 548 254M-28 206C80 229 160 260 250 294S430 355 550 386M-20 445C95 412 166 375 260 341S422 292 548 242" fill="none" stroke="#cbd6d9" stroke-width="15"/>
        <path d="M-18 28C80 64 153 106 244 135S426 192 548 254M-28 206C80 229 160 260 250 294S430 355 550 386M-20 445C95 412 166 375 260 341S422 292 548 242" fill="none" stroke="#fbfcfa" stroke-width="10"/>
        <path d="M-35 104C96 143 183 184 274 211S438 264 562 314M-39 298C83 263 175 231 278 203S444 148 563 112M-26 458C103 416 198 372 288 338S455 279 552 243" fill="none" stroke="#cbd6d9" stroke-width="13"/>
        <path d="M-35 104C96 143 183 184 274 211S438 264 562 314M-39 298C83 263 175 231 278 203S444 148 563 112M-26 458C103 416 198 372 288 338S455 279 552 243" fill="none" stroke="#fafbf9" stroke-width="9"/>
        <path d="M45 -25C104 100 130 222 166 550M226 -26C246 92 261 226 287 548M407 -25C373 92 347 230 329 553M548 -22C482 95 448 219 423 553" fill="none" stroke="#cbd6d9" stroke-width="10"/>
        <path d="M45 -25C104 100 130 222 166 550M226 -26C246 92 261 226 287 548M407 -25C373 92 347 230 329 553M548 -22C482 95 448 219 423 553" fill="none" stroke="#fbfcfa" stroke-width="6"/>
        <path d="M-20 35C90 95 169 117 271 148S444 202 550 263M-32 188C77 227 179 264 280 292S441 340 562 399M-27 385C68 343 161 312 267 274S443 229 553 186M132 -20C176 96 193 180 216 268S257 433 275 548M342 -24C323 92 304 188 294 270S278 437 261 548M489 -14C431 86 408 165 382 261S348 434 337 547" fill="none" stroke="#d7e0e2" stroke-width="4"/>
        <path d="M-20 35C90 95 169 117 271 148S444 202 550 263M-32 188C77 227 179 264 280 292S441 340 562 399M-27 385C68 343 161 312 267 274S443 229 553 186M132 -20C176 96 193 180 216 268S257 433 275 548M342 -24C323 92 304 188 294 270S278 437 261 548M489 -14C431 86 408 165 382 261S348 434 337 547" fill="none" stroke="#fff" stroke-width="2"/>
        <path d="M35 343 69 329 88 338 80 365 46 377ZM399 365 430 351 452 360 446 386 411 400ZM129 49 161 41 177 53 170 76 140 82ZM298 430 324 418 346 427 341 450 309 459ZM453 62 483 55 500 68 493 91 462 98ZM189 270 208 260 221 270 215 286 198 291Z" fill="#d8eadb" stroke="#c5dfcd" stroke-width="1.2"/>
        <path d="M22 443h45M435 216h45M205 493h68M34 175h38M358 180h42M466 462h41" fill="none" stroke="#9eddb9" stroke-width="5" stroke-linecap="round"/>
        <g fill="#80909d" font-size="7.5" font-family="sans-serif" font-weight="600">
          <text x="24" y="127" transform="rotate(22 24 127)">테헤란로</text><text x="366" y="256" transform="rotate(-21 366 256)">삼성로</text>
          <text x="206" y="466" transform="rotate(-22 206 466)">도곡로</text><text x="124" y="28" transform="rotate(68 124 28)">역삼로</text>
          <text x="448" y="122" transform="rotate(66 448 122)">강남대로</text><text x="303" y="498" transform="rotate(-22 303 498)">논현로</text>
          <text x="47" y="352">역삼역</text><text x="410" y="91">선릉역</text><text x="204" y="204" transform="rotate(22 204 204)">삼성중앙로</text>
          <text x="69" y="236" transform="rotate(21 69 236)">봉은사로</text><text x="327" y="116" transform="rotate(-17 327 116)">선릉로</text>
          <text x="94" y="412" transform="rotate(-19 94 412)">언주로</text><text x="391" y="434" transform="rotate(-21 391 434)">학동로</text>
        </g>
        <g fill="#fff" stroke="#aebdc4" stroke-width="1.2"><circle cx="65" cy="185" r="3.5"/><circle cx="288" cy="86" r="3.5"/><circle cx="457" cy="205" r="3.5"/><circle cx="103" cy="421" r="3.5"/><circle cx="389" cy="462" r="3.5"/><circle cx="257" cy="191" r="3.5"/><circle cx="322" cy="252" r="3.5"/><circle cx="203" cy="384" r="3.5"/><circle cx="433" cy="291" r="3.5"/><circle cx="130" cy="278" r="3.5"/><circle cx="179" cy="119" r="3.5"/><circle cx="365" cy="331" r="3.5"/></g>
        <g font-family="sans-serif" font-size="7" font-weight="700" text-anchor="middle"><circle cx="250" cy="131" r="7" fill="#fff" stroke="#8fa6b4"/><text x="250" y="134" fill="#607b90">M</text><circle cx="69" cy="352" r="7" fill="#fff" stroke="#8fa6b4"/><text x="69" y="355" fill="#607b90">M</text><circle cx="421" cy="83" r="7" fill="#fff" stroke="#8fa6b4"/><text x="421" y="86" fill="#607b90">M</text></g>
      </svg>
      <div class="market-map-radius" style="--radius-scale:${marketRadiusScale()}"></div>
      ${markers}
      <div class="market-map-own" style="left:55%;top:57%"><span>⌂</span><b>내 숙소 · ${esc(room.name)}<strong>${money(own)}</strong></b></div>
    </div>
    <span class="market-map-scale">${marketRadiusLabel()}</span>
    <div class="market-map-zoom"><button data-market-zoom="1" aria-label="지도 확대">＋</button><button data-market-zoom="-1" aria-label="지도 축소">−</button></div>
  </div>`;
}
function marketContent() {
  const room = marketRoom();
  const available = marketVisibleList();
  const categoryList = marketCategoryList();
  const list = state.marketShowAll ? categoryList : available.slice(0, MARKET_RECOMMENDATION_LIMIT);
  const chips = [
    { id: 'all', label: `전체 ${COMPETITORS.length}` },
    { id: 'hotel', label: `호텔 ${COMPETITORS.filter((item) => item.type === 'hotel').length}` },
    { id: 'motel', label: `모텔 ${COMPETITORS.filter((item) => item.type === 'motel').length}` },
    { id: 'guesthouse', label: `게스트하우스 ${COMPETITORS.filter((item) => item.type === 'guesthouse').length}` },
  ];
  const rows = list.map((item) => {
    const comparisonRoom = marketCompetitorRoom(item);
    const unavailable = !comparisonRoom;
    const selected = state.marketComparedIds.includes(item.id);
    const outsideRadius = item.distance > marketRadiusKm();
    const diff = marketRateDifference(item);
    return `<tr class="${unavailable ? 'unavailable' : ''} ${selected ? 'compared' : ''} ${outsideRadius ? 'outside-radius' : ''}"><td><label class="market-row-check"><input type="checkbox" data-market-compare="${item.id}" ${selected ? 'checked' : ''} ${unavailable ? 'disabled' : ''} aria-label="${esc(item.name)} 비교 선택"><span></span></label></td><td class="market-name-cell"><strong>${esc(item.name)}</strong><small>${marketTypeLabel(item.type)} · ${esc(comparisonRoom?.room || '비교 객실 정보 없음')} · ${marketRoom().guests}인</small></td><td>${item.distance.toFixed(1)}km</td><td>${comparisonRoom ? money(comparisonRoom.avg30) : '—'}</td><td><b>${comparisonRoom ? money(comparisonRoom.today) : '—'}</b></td><td class="market-difference ${diff.className}">${diff.text}</td></tr>`;
  }).join('');
  const roomCompareCount = marketRoomCompareCount(room);
  return `<section class="market-intro"><div><span class="eyebrow">선택 설정 · 경쟁 숙소</span><h1>가격을 비교해 볼 주변 숙소를 골라 주세요.</h1></div><div class="market-intro-copy"><span>고른 주변 숙소의 가격을 내 숙소 가격과 함께 보여드려요.</span><strong>주변 숙소의 가격은 참고용이에요. 내 숙소의 추천가격에는 영향을 주지 않아요.</strong></div><span class="market-required-pill">선택 사항이에요.</span></section>
    <section class="market-card">
      <div class="market-room-step"><div class="market-step-title"><span class="eyebrow">STEP 1 / 2</span><h2>비교할 내 객실</h2></div><div class="market-room-picker"><button class="market-room-trigger" data-market-room-toggle aria-haspopup="listbox" aria-expanded="${marketRoomMenuOpen}"><span class="market-bed-icon">${icons.bed}</span><strong>${esc(room.name)} · ${room.guests}인</strong><small>${roomCompareCount}/5곳 비교</small><span class="market-room-count">객실 8종</span><i>⌄</i></button>${marketRoomMenu()}</div><p>고른 주변 숙소는 모든 객실의 가격 비교에 공통으로 사용돼요.<br>비교할 객실을 바꾸면 인원이 같은 객실을 찾아 비교해요.</p></div>
      <div class="market-divider"></div>
      <div class="market-step2-heading"><span class="eyebrow">STEP 2 / 2</span><h2>참고할 경쟁 숙소</h2></div>
      <div class="market-toolbar"><div class="market-category-tabs" role="tablist" aria-label="숙소 종류 필터">${chips.map((chip) => `<button role="tab" aria-selected="${state.marketCategory === chip.id}" class="${state.marketCategory === chip.id ? 'active' : ''}" data-market-category="${chip.id}">${chip.label}</button>`).join('')}</div><div class="market-controls"><div class="market-radius-picker"><button class="market-radius-trigger" data-market-radius-toggle aria-expanded="${marketRadiusMenuOpen}"><span data-market-radius-trigger-label>거리 · ${marketRadiusLabel()} 안</span><i>⌄</i></button>${marketRadiusMenu()}</div><label class="market-search"><span>⌕</span><input data-market-search value="${esc(marketSearchQuery)}" placeholder="숙소 이름으로 찾기" aria-label="숙소 이름으로 찾기">${marketSearchQuery ? '<button data-market-search-clear aria-label="검색어 지우기">×</button>' : ''}</label><button class="market-refresh" data-market-refresh>${icons.refresh}<span>새로고침</span></button><div class="market-search-host" data-market-search-host>${marketSearchResults()}</div></div></div>
      <div class="market-workspace"><div class="market-list-panel">${marketSummary()}<p class="market-hint"><span>ⓘ</span> 주변 숙소를 ${Math.max(0, 5 - state.marketComparedIds.length)}곳 더 고를 수 있어요. 고른 숙소가 적을수록 한 숙소의 가격 변화가 평균에 더 크게 반영돼요.</p><div class="market-table-scroll ${state.marketShowAll ? 'expanded' : ''}${marketResultsRefreshing ? ' market-results-refresh' : ''}"><table class="market-table"><thead><tr><th><span class="sr-only">선택</span></th><th>숙소</th><th>거리</th><th>30일 평균</th><th>오늘 가격</th><th>내 가격 대비</th></tr></thead><tbody>${rows || '<tr><td colspan="6" class="market-no-results">조건에 맞는 숙소가 없어요.</td></tr>'}</tbody></table></div><button class="market-show-all" data-market-show-all>${state.marketShowAll ? '간략히 보기' : `전체 보기 (${categoryList.length})`} <span>${state.marketShowAll ? '⌃' : '⌄'}</span></button></div><div class="market-map-column">${marketMap()}<div class="market-map-legend"><span><i class="legend-selected"></i>선택한 숙소</span><span><i class="legend-unselected"></i>선택 안 함</span><span><i class="legend-own"></i>내 숙소</span></div><p class="market-footnote">1박 · ${room.guests}인 · 세금 포함 공개가 기준으로 비교해요. 대실과 회원 전용가는 제외해요.<br>가격은 오늘 06:00 업데이트됐어요. 매진이거나 가격을 불러오지 못한 날은 평균에서 제외해요.<br>비교할 객실이 없는 숙소는 고를 수 없어요.</p></div></div>
    </section>`;
}
function marketFooter() {
  return `<footer class="footer-actions market-footer"><span class="save-state">자동 저장됨 · 방금 전</span><button class="primary-button" data-market-save>저장하기</button></footer>`;
}

// Calendar pricing review. This screen uses the room, occupancy, season, and
// mapping choices made in the setup flow above.
const CALENDAR_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const CALENDAR_HOLIDAYS = new Map([
  ['2026-10-03', '공휴일'], ['2026-10-09', '공휴일'], ['2026-12-25', '공휴일'],
  ['2027-01-01', '공휴일'], ['2027-02-06', '공휴일'], ['2027-02-07', '공휴일'], ['2027-02-08', '공휴일'],
]);
let calendarDetailOpen = false;
let calendarMatrixExpanded = false;
let calendarCompetitorsExpanded = false;
let calendarDirectEdit = false;
let calendarPriceDraft = '';
let calendarApplyConfirmOpen = false;
let calendarMappingMenuOpen = false;
let calendarSelectedDate = '';
let calendarPanelToast = '';
let calendarPanelToastTimer;

function calendarISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function calendarSelectionDate() { return calendarSelectedDate || state.calendarDate; }
function calendarDate(value = state.calendarDate) {
  const [year, month, day] = String(value || DEFAULT_STATE.calendarDate).split('-').map(Number);
  return new Date(year || 2026, (month || 10) - 1, day || 1);
}
function calendarMoney(value) { return integer(value); }
function calendarToday() {
  // Keep the sample date aligned with the supplied calendar references.
  return new Date(2026, 9, 13);
}
function calendarOccupancy(date) {
  const total = Math.max(1, roomTotal());
  if (date.getFullYear() === 2026 && date.getMonth() === 9) {
    const october = [0, 16, 20, 21, 14, 10, 11, 12, 19, 21, 21, 15, 9, 12, 11, 12, 17, 18, 10, 7, 9, 12, 11, 20, 21, 9, 6, 8, 9, 12, 17, 19];
    return Math.min(total, october[date.getDate()] || 8);
  }
  const weekend = state.busyWeekdays.includes(date.getDay());
  const pattern = weekend ? [18, 20, 17, 19, 21, 18, 20] : [8, 10, 11, 12, 9, 11, 10];
  const count = pattern[(date.getDate() + date.getMonth()) % pattern.length];
  return Math.max(1, Math.min(total, count));
}
function calendarSoldInRoom(date, room) {
  if (!room || !room.count) return 0;
  return Math.min(room.count, Math.round(calendarOccupancy(date) / Math.max(1, roomTotal()) * room.count));
}
function calendarSeason(date) {
  for (const season of state.seasons.filter((item) => item.active && !item.automatic)) {
    for (const period of season.periods || []) {
      for (const year of [date.getFullYear() - 1, date.getFullYear(), date.getFullYear() + 1]) {
        const start = new Date(year, period.startMonth - 1, period.startDay);
        let endYear = year;
        if (period.endMonth < period.startMonth || (period.endMonth === period.startMonth && period.endDay < period.startDay)) endYear += 1;
        const end = new Date(endYear, period.endMonth - 1, period.endDay, 23, 59, 59, 999);
        if (date >= start && date <= end) return season;
      }
    }
  }
  return null;
}
function calendarHoliday(date) { return CALENDAR_HOLIDAYS.get(calendarISO(date)) || ''; }
function calendarRangeFor(date) {
  const occupancy = Math.round(calendarOccupancy(date) / Math.max(1, roomTotal()) * 100);
  const ranges = occupancyRanges();
  return ranges.find((range) => occupancy <= range.upperPercent) || ranges.at(-1);
}
function calendarPriceInfo(date, room) {
  const mapping = ensureMappingRoom(room.id);
  const range = calendarRangeFor(date);
  const weekend = state.busyWeekdays.includes(date.getDay()) || Boolean(calendarHoliday(date) && date.getDay() !== 0 && state.holidayEveWeekend);
  const candidates = [{ category: weekend ? 'weekend' : 'weekday', label: weekend ? '주말' : '평일' }];
  const season = calendarSeason(date);
  if (season) {
    const category = season.type === 'shoulder' ? 'shoulder' : 'peak';
    const selected = selectedMappingSeasons(category);
    if (selected.some((item) => item.id === season.id)) candidates.push({ category, label: season.name });
  }
  const choices = candidates.map((candidate) => {
    const key = mapping[candidate.category]?.[range.index] || 'base';
    const option = mappingOption(key);
    return { ...candidate, key, option };
  });
  const chosen = choices.reduce((best, option) => option.option.percent > best.option.percent ? option : best, choices[0]);
  const basePrice = Number(room.basePrice) || 0;
  const recommended = stagePrice(basePrice, chosen.option.percent);
  const key = `${calendarISO(date)}|${room.id}`;
  const manualPrice = Number(state.calendarManualPrices?.[key]);
  const appliedPrice = Number(state.calendarAppliedPrices?.[key]);
  const currentPrice = Number.isFinite(manualPrice) && manualPrice > 0 ? manualPrice
    : Number.isFinite(appliedPrice) && appliedPrice > 0 ? appliedPrice : basePrice;
  const applied = Number.isFinite(appliedPrice) && appliedPrice > 0;
  return { date, room, range, occupancy: calendarOccupancy(date), roomSold: calendarSoldInRoom(date, room), season, choices, chosen, basePrice, recommended, currentPrice, applied, manual: Number.isFinite(manualPrice) && manualPrice > 0, key };
}
function calendarPercent(info) {
  if (!info.basePrice) return 0;
  return Math.round((info.recommended / info.basePrice - 1) * 100);
}
function calendarStatusClass(info) {
  if (info.applied) return 'applied';
  const delta = info.recommended - info.basePrice;
  return delta > 0 ? 'up' : delta < 0 ? 'down' : 'same';
}
function calendarStepBadge(info) {
  return info.applied ? '✓ 반영' : calendarStatusClass(info) === 'same' ? '유지' : fmtPct(calendarPercent(info));
}
function calendarMonthLabel(date) { return `${date.getFullYear()}년 ${date.getMonth() + 1}월`; }
function calendarWeekStart(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}
function calendarWeekLabel(date) {
  const start = calendarWeekStart(date);
  const end = new Date(start); end.setDate(end.getDate() + 6);
  const sameMonth = start.getMonth() === end.getMonth();
  return sameMonth
    ? `${start.getMonth() + 1}월 ${start.getDate()}일 – ${end.getDate()}일`
    : `${start.getMonth() + 1}월 ${start.getDate()}일 – ${end.getMonth() + 1}월 ${end.getDate()}일`;
}
function calendarSeasonForCell(date) {
  const season = calendarSeason(date);
  if (!season) return '';
  const previous = new Date(date); previous.setDate(previous.getDate() - 1);
  const startsSegment = !calendarSeason(previous) || calendarSeason(previous)?.id !== season.id || previous.getDay() === 6;
  return `<div class="calendar-season-band ${startsSegment ? 'starts' : ''}" title="${esc(season.name)}">${startsSegment ? esc(season.name) : '&nbsp;'}</div>`;
}
function calendarLegend() {
  return `<div class="calendar-legend"><span><i class="up">+</i>올리기 추천</span><span><i class="down">−</i>내리기 추천</span><span><i class="same">=</i>유지</span><span><i class="applied">✓</i>반영됨</span><em></em><span><i class="season"></i>시즌</span></div>`;
}
function calendarMonthCell(date, inMonth, room, selected, column, row) {
  const placement = `grid-column:${column};grid-row:${row}`;
  const lastColumn = column === 7 ? ' last-column' : '';
  if (!inMonth) return `<div class="calendar-day-cell empty${lastColumn}" style="${placement}" aria-hidden="true"></div>`;
  const info = calendarPriceInfo(date, room);
  const day = date.getDate();
  const today = calendarISO(date) === calendarISO(calendarToday());
  const past = date < calendarToday();
  const holiday = calendarHoliday(date);
  const weekend = state.busyWeekdays.includes(date.getDay());
  const status = calendarStatusClass(info);
  const currentText = past ? '판매 마감' : `현재 ${calendarMoney(info.currentPrice)}`;
  const displayedPrice = info.applied ? info.currentPrice : info.recommended;
  return `<button class="calendar-day-cell${lastColumn} ${selected === calendarISO(date) ? 'selected' : ''} ${today ? 'today' : ''} ${past ? 'past' : ''}" style="${placement}" data-calendar-day="${calendarISO(date)}" data-calendar-room-id="${esc(room.id)}">
    ${calendarSeasonForCell(date)}<span class="calendar-date-row"><b class="calendar-date ${date.getDay() === 0 || holiday ? 'sunday' : date.getDay() === 6 ? 'saturday' : ''} ${today ? 'is-today' : ''}">${day}</b>${weekend && !holiday ? '<small class="calendar-day-tag">주말</small>' : ''}${holiday ? `<small class="calendar-holiday">${holiday}</small>` : ''}</span>
    <span class="calendar-current">${currentText}</span><span class="calendar-price-line ${past ? 'muted' : status}"><strong>${calendarMoney(past ? info.basePrice : displayedPrice)}</strong>${past ? '' : `<i>${calendarStepBadge(info)}</i>`}</span>
    <span class="calendar-metrics"><span>판매 <b>${info.roomSold}/${room.count}</b></span><i></i><span>점유율 <b>${Math.round(info.occupancy / Math.max(1, roomTotal()) * 100)}%</b></span></span>
  </button>`;
}
function calendarMonthGrid() {
  const anchor = calendarDate();
  const year = anchor.getFullYear(); const month = anchor.getMonth();
  const first = new Date(year, month, 1); const dayCount = new Date(year, month + 1, 0).getDate();
  const count = Math.ceil((first.getDay() + dayCount) / 7) * 7;
  const room = state.rooms.find((item) => item.id === state.calendarRoomId) || state.rooms[0];
  if (!room) return '';
  const days = Array.from({ length: count }, (_, index) => {
    const day = index - first.getDay() + 1;
    const date = new Date(year, month, day);
    return calendarMonthCell(date, day > 0 && day <= dayCount, room, calendarSelectionDate(), index % 7 + 1, Math.floor(index / 7) + 2);
  }).join('');
  return `<section class="calendar-board month-board"><header class="calendar-board-heading"><h2>${esc(room.name)}</h2>${calendarLegend()}</header><div class="calendar-month-grid" style="--calendar-rows:${count / 7}"><div class="calendar-weekday-head">${CALENDAR_WEEKDAYS.map((day, index) => `<span class="${index === 0 ? 'sunday' : index === 6 ? 'saturday' : ''}">${day}</span>`).join('')}</div>${days}</div><p class="calendar-footnote">칸을 누르면 해당 객실과 날짜의 자세한 정보를 확인할 수 있어요.</p></section>`;
}
function calendarWeekCell(date, room, info) {
  const selected = calendarSelectionDate() === calendarISO(date) && room.id === state.calendarRoomId;
  const status = calendarStatusClass(info);
  const holiday = calendarHoliday(date);
  const weekend = state.busyWeekdays.includes(date.getDay());
  const displayedPrice = info.applied ? info.currentPrice : info.recommended;
  return `<button class="calendar-week-price ${selected ? 'selected' : ''}" data-calendar-day="${calendarISO(date)}" data-calendar-room-id="${esc(room.id)}"><small>현재 ${calendarMoney(info.currentPrice)}</small><strong class="${status}">${calendarMoney(displayedPrice)} <i>${calendarStepBadge(info)}</i></strong><span>판매 <b>${info.roomSold}/${room.count}</b></span>${holiday ? `<em>${holiday}</em>` : weekend ? '<em>주말</em>' : ''}</button>`;
}
function calendarWeekGrid() {
  const start = calendarWeekStart(calendarDate());
  const dates = Array.from({ length: 7 }, (_, index) => { const d = new Date(start); d.setDate(d.getDate() + index); return d; });
  const totalRow = `<div class="calendar-week-label"><strong>숙소 전체 점유율</strong><small>모든 객실 공통</small></div>${dates.map((date) => `<button class="calendar-week-occupancy ${calendarSelectionDate() === calendarISO(date) ? 'selected' : ''}" data-calendar-day="${calendarISO(date)}" data-calendar-room-id="${esc(state.calendarRoomId)}"><b>${Math.round(calendarOccupancy(date) / Math.max(1, roomTotal()) * 100)}%</b><small>${calendarOccupancy(date)} / ${roomTotal()}실</small></button>`).join('')}`;
  const rows = state.rooms.map((room) => `<div class="calendar-week-label"><strong>${esc(room.name)}</strong><small>${room.count}실 · 기준가 ${calendarMoney(room.basePrice)}</small></div>${dates.map((date) => calendarWeekCell(date, room, calendarPriceInfo(date, room))).join('')}`).join('');
  return `<section class="calendar-board week-board"><header class="calendar-board-heading"><div><h2>모든 객실 · 7일</h2><p>같은 날짜에는 모든 객실이 같은 점유율 구간을 적용해요. 객실별 상황별 가격표에 따라 적용되는 가격 단계가 달라요.</p></div>${calendarLegend()}</header><div class="calendar-week-grid" style="--calendar-room-rows:${Math.max(1, state.rooms.length)}"><div class="calendar-week-head"><strong>객실 / 날짜</strong>${dates.map((date) => {
    const season = calendarSeason(date); const previous = new Date(date); previous.setDate(previous.getDate() - 1);
    const startsSeason = season && (!calendarSeason(previous) || calendarSeason(previous)?.id !== season.id);
    return `<button class="${date.getDay() === 0 || calendarHoliday(date) ? 'sunday' : date.getDay() === 6 ? 'saturday' : ''} ${calendarSelectionDate() === calendarISO(date) ? 'active' : ''} ${season ? 'in-season' : ''}" data-calendar-day="${calendarISO(date)}" data-calendar-room-id="${esc(state.calendarRoomId)}"><b>${date.getDate()}</b><span>${CALENDAR_WEEKDAYS[date.getDay()]}</span>${state.busyWeekdays.includes(date.getDay()) ? '<small>주말</small>' : calendarHoliday(date) ? `<small>${calendarHoliday(date)}</small>` : ''}${season ? `<em class="calendar-week-season">${startsSeason ? `${esc(season.name)} · ${season.type === 'peak' ? '성수기' : '준성수기'}` : '&nbsp;'}</em>` : ''}</button>`;
  }).join('')}</div>${totalRow}${rows}</div><p class="calendar-footnote">칸을 누르면 해당 객실과 날짜의 자세한 정보를 확인할 수 있어요.</p></section>`;
}
function calendarToolbar() {
  const anchor = calendarDate();
  const monthMode = state.calendarMode === 'month';
  return `<div class="calendar-toolbar"><div class="calendar-toolbar-left"><div class="calendar-mode-switch" role="tablist" aria-label="가격 보기 방식"><button role="tab" aria-selected="${!monthMode}" class="${!monthMode ? 'active' : ''}" data-calendar-mode="week">객실별 보기</button><button role="tab" aria-selected="${monthMode}" class="${monthMode ? 'active' : ''}" data-calendar-mode="month">월별 보기</button></div>${monthMode ? `<label class="calendar-room-select"><select data-calendar-room>${state.rooms.map((room) => `<option value="${esc(room.id)}" ${room.id === state.calendarRoomId ? 'selected' : ''}>${esc(room.name)} · ${room.count}실</option>`).join('')}</select><span>⌄</span></label>` : ''}</div><div class="calendar-toolbar-right"><button class="calendar-nav" aria-label="이전 ${monthMode ? '달' : '기간'}" data-calendar-nav="-1">‹</button><strong>${monthMode ? calendarMonthLabel(anchor) : calendarWeekLabel(anchor)}</strong><button class="calendar-nav" aria-label="다음 ${monthMode ? '달' : '기간'}" data-calendar-nav="1">›</button><button class="calendar-today" data-calendar-today>오늘</button></div></div>`;
}
function calendarContent() {
  if (!state.rooms.some((room) => room.id === state.calendarRoomId)) state.calendarRoomId = state.rooms[0]?.id || '';
  return `<div class="calendar-page-heading"><h1>판매 관리</h1><p>날짜별 추천 가격을 확인하고 판매 채널에 바로 반영해 주세요. 날짜를 누르면 추천 이유를 확인할 수 있어요.</p></div>${calendarToolbar()}${state.calendarMode === 'month' ? calendarMonthGrid() : calendarWeekGrid()}${calendarDetailOpen ? calendarDetailDrawer() : ''}${calendarApplyConfirmOpen ? calendarApplyDialog() : ''}`;
}
function calendarReasonCard(number, badge, title, detail, tone = '') {
  return `<div class="calendar-reason"><span class="calendar-reason-number">${number}</span><article><div><b class="calendar-reason-badge ${tone}">${badge}</b><strong>${title}</strong></div><p>${detail}</p></article></div>`;
}
function calendarMatrixMarkup(info) {
  const mapping = ensureMappingRoom(info.room.id);
  const categories = ['weekday', 'weekend', 'shoulder', 'peak'];
  const labels = ['평일', '주말', '준성수기', '성수기'];
  const weekdayOption = mappingOption(mapping.weekday?.[info.range.index] || 'base');
  const stepExplanation = info.chosen.category === 'weekday'
    ? '평일에 설정한 가격 단계를 적용했어요.'
    : info.chosen.option.percent > weekdayOption.percent
      ? `평일에 적용하는 ${weekdayOption.name}보다 높은 단계를 적용했어요.`
      : info.chosen.option.percent < weekdayOption.percent
        ? `평일에 적용하는 ${weekdayOption.name}보다 낮은 단계를 적용했어요.`
        : '평일과 같은 가격 단계를 적용했어요.';
  const rows = occupancyRanges().filter((range) => calendarMatrixExpanded || range.index === info.range.index).map((range) => `<div class="calendar-matrix-row ${range.index === info.range.index ? 'current' : ''}"><b>${range.letter}</b><small>${range.lowerPercent}~${range.upperPercent}%</small>${categories.map((category) => {
    const key = mapping[category]?.[range.index] || 'base'; const option = mappingOption(key); const color = priceStageColor(option.percent);
    const chosen = info.range.index === range.index && info.chosen.category === category;
    const chosenTone = chosen ? info.chosen.option.percent < 0 ? 'chosen-down' : info.chosen.option.percent > 0 ? 'chosen-up' : 'chosen-base' : '';
    return `<span class="${color} ${chosen ? `chosen ${chosenTone}` : ''}">${option.name}</span>`;
  }).join('')}</div>`).join('');
  return `<div class="calendar-matrix"><div class="calendar-matrix-head"><span></span><span></span>${labels.map((label) => `<span>${label}</span>`).join('')}</div>${rows}<div class="calendar-matrix-foot"><span><i class="down"></i>내림</span><span><i></i>기준가</span><span><i class="up"></i>올림</span><b>오늘은 ${info.range.letter} 구간</b></div><p><strong>${info.range.letter} 구간 × ${info.chosen.label} → ${info.chosen.option.name}</strong> · ${stepExplanation}</p><button class="calendar-matrix-expand" data-calendar-matrix>${calendarMatrixExpanded ? '접기 ⌃' : '전체 표 보기 ⌄'}</button></div>`;
}
function calendarCompetitorAverage() {
  const prices = COMPETITORS.filter((item) => state.marketComparedIds.includes(item.id) && item.today).map((item) => item.today);
  return prices.length ? Math.round(prices.reduce((sum, value) => sum + value, 0) / prices.length / 100) * 100 : 0;
}
function calendarCompetitorCard(info) {
  const average = calendarCompetitorAverage();
  const comparisonPrice = info.applied ? info.currentPrice : info.recommended;
  const difference = Math.abs(average - comparisonPrice);
  const comparisons = COMPETITORS.filter((item) => state.marketComparedIds.includes(item.id) && item.today);
  const maxPrice = Math.max(comparisonPrice, ...comparisons.map((item) => item.today), 1);
  return `<section class="calendar-competitor"><button class="calendar-competitor-toggle" data-calendar-competitors><span><strong>경쟁 숙소 가격</strong><i>참고용</i></span><b>${calendarCompetitorsExpanded ? '접기 ⌃' : '펼치기 ⌄'}</b></button><p>고른 ${comparisons.length}곳 오늘 평균 <strong>${calendarMoney(average)}원</strong>${comparisons.length ? ` · 추천가가 ${calendarMoney(difference)}원 ${average > comparisonPrice ? '낮아요' : '높아요'}` : ''}</p>${calendarCompetitorsExpanded ? `<div class="calendar-competitor-bars"><div class="calendar-own-price-line" style="--price-position:${Math.max(4, Math.min(96, comparisonPrice / maxPrice * 100))}%"><span>내 추천가</span></div>${comparisons.map((item) => `<div class="calendar-competitor-bar"><span>${esc(item.name)}</span><i><b style="width:${Math.max(10, item.today / maxPrice * 100)}%"></b></i><strong>${calendarMoney(item.today)}</strong></div>`).join('')}</div>` : ''}</section>`;
}
function calendarDetailDrawer() {
  const date = calendarDate(calendarSelectionDate());
  const room = state.rooms.find((item) => item.id === state.calendarRoomId) || state.rooms[0];
  if (!room) return '';
  const info = calendarPriceInfo(date, room);
  const daysLeft = Math.round((date - calendarToday()) / 86400000);
  const daysLeftLabel = daysLeft < 0 ? '판매 마감' : daysLeft === 0 ? '오늘' : `${daysLeft}일 남음`;
  const percent = Math.round(info.roomSold / Math.max(1, room.count) * 100);
  const periodLabel = info.season?.name || calendarHoliday(date) || (state.busyWeekdays.includes(date.getDay()) ? '주말' : '평일');
  const seasonReason = calendarReasonCard(2, '시즌', esc(periodLabel), `설정한 시즌 · ${periodLabel}에 해당`, 'season');
  const mappingNumber = 3;
  const mappingCard = `<div class="calendar-reason"><span class="calendar-reason-number">${mappingNumber}</span><article class="calendar-mapping-reason"><div class="calendar-mapping-title"><span><b class="calendar-reason-badge blue">상황별 가격</b><strong>${esc(room.name)}</strong><small>상황별 가격 표에서 이 칸을 썼어요.</small></span><button class="calendar-mapping-menu-button" data-calendar-mapping-menu>•••</button>${calendarMappingMenuOpen ? '<button class="calendar-mapping-menu" data-calendar-edit-mapping>상황별 가격 수정</button>' : ''}</div>${calendarMatrixMarkup(info)}</article></div>`;
  const priceForCard = calendarDirectEdit
    ? Number(String(calendarPriceDraft || info.currentPrice).replace(/[^\d]/g, '')) || 0
    : info.applied ? info.currentPrice : info.recommended;
  const roomPriceModel = calculatePriceStageModel(
    info.basePrice,
    state.minLimit,
    state.maxLimit,
    state.up.length,
    state.down.length,
    room.id === state.previewRoomId ? state.stagePriceOverrides : {},
  );
  const maxAllowedPrice = roomPriceModel.valid ? roomPriceModel.maxPrice : stagePrice(info.basePrice, state.maxLimit);
  const deltaPercent = Math.round((priceForCard / Math.max(1, info.basePrice) - 1) * 100);
  const directPriceOptions = mappingStageOptions();
  const directOptionRank = (option) => {
    const match = option.name.match(/^([+-])(\d+)단계$/);
    return match ? (match[1] === '+' ? 1 : -1) * Number(match[2]) : 0;
  };
  const orderedDirectPriceOptions = directPriceOptions.slice().sort((a, b) => directOptionRank(a) - directOptionRank(b));
  const directPanel = calendarDirectEdit ? `<div class="calendar-recommendation-row direct"><span class="calendar-recommendation-mark" aria-hidden="true">=</span><section class="calendar-direct-edit"><header><strong>직접 설정한 가격</strong><span class="calendar-direct-recommendation">추천 가격 ${calendarMoney(info.recommended)}원</span></header><label><input data-direct-price value="${esc(calendarPriceDraft || String(info.currentPrice))}" inputmode="numeric" aria-label="직접 설정할 가격"><span>원</span></label><div class="calendar-price-chips">${orderedDirectPriceOptions.map((option) => `<button data-calendar-price-chip="${stagePrice(info.basePrice, option.percent)}">${option.name} ${calendarMoney(stagePrice(info.basePrice, option.percent))}</button>`).join('')}</div>${priceForCard > maxAllowedPrice ? `<p class="calendar-price-warning">⚠ 설정한 최고 가격 ${calendarMoney(maxAllowedPrice)}원보다 ${calendarMoney(priceForCard - maxAllowedPrice)}원 높아요. 이 가격으로도 반영할 수 있어요.</p>` : ''}</section></div>` : '';
  const recommendationStatus = calendarStatusClass(info);
  const recommendation = calendarDirectEdit ? '' : `<div class="calendar-recommendation-row ${recommendationStatus}"><span class="calendar-recommendation-mark" aria-hidden="true">=</span><section class="calendar-recommendation ${recommendationStatus}"><header><strong>${info.applied ? '반영한 가격' : '추천 가격'}</strong><b>${info.chosen.option.name} · ${fmtPct(info.chosen.option.percent)}</b></header><div><strong>${calendarMoney(priceForCard)}원</strong><span>현재 ${calendarMoney(info.currentPrice)} <b>${priceForCard - info.currentPrice > 0 ? '+' : ''}${calendarMoney(priceForCard - info.currentPrice)}</b></span></div></section></div>`;
  const hasChange = calendarDirectEdit ? priceForCard !== info.currentPrice : info.recommended !== info.currentPrice;
  return `<div class="calendar-drawer-backdrop" data-calendar-drawer-backdrop><aside class="calendar-detail-drawer" role="dialog" aria-modal="true" aria-label="${date.getMonth() + 1}월 ${date.getDate()}일 가격 상세"><header class="calendar-drawer-top"><div><button data-calendar-detail-nav="-1" aria-label="이전 날짜">‹</button><button data-calendar-detail-nav="1" aria-label="다음 날짜">›</button></div><button class="calendar-drawer-close" data-calendar-detail-close aria-label="닫기">×</button></header><div class="calendar-drawer-scroll"><div class="calendar-drawer-title"><h2>${date.getMonth() + 1}월 ${date.getDate()}일 (${CALENDAR_WEEKDAYS[date.getDay()]})</h2><span>${daysLeftLabel}</span></div><label class="calendar-detail-room"><select data-calendar-detail-room>${state.rooms.map((item) => `<option value="${esc(item.id)}" ${item.id === room.id ? 'selected' : ''}>${esc(item.name)}　기준가 ${calendarMoney(item.basePrice)}원</option>`).join('')}</select><i>⌄</i></label><div class="calendar-sales-summary"><div><span>이 객실 판매</span><strong>${info.roomSold}<small> / ${room.count}실</small></strong><i style="--sold:${percent}%"><b>${percent}%</b></i></div><div><span>숙소 전체</span><strong>${info.occupancy}<small> / ${roomTotal()}실</small></strong></div></div><h3 class="calendar-reason-heading">왜 이 가격일까요?</h3><div class="calendar-reasons">${calendarReasonCard(1, '점유율', `${info.range.letter} 구간 · 숙소 전체 ${info.occupancy}/${roomTotal()}실 (${Math.round(info.occupancy / Math.max(1, roomTotal()) * 100)}%)`, `설정한 구간 · ${info.range.letter} = ${info.range.lowerPercent}~${info.range.upperPercent}%`, 'occupancy')}${seasonReason}${mappingCard}</div>${recommendation}${directPanel}${calendarCompetitorCard(info)}</div>${calendarPanelToast ? `<div class="calendar-panel-toast" role="status" aria-live="polite"><span>✓</span>${esc(calendarPanelToast)}</div>` : ''}<footer class="calendar-drawer-footer"><div class="${calendarDirectEdit ? 'direct-editing' : ''}">${calendarDirectEdit ? '<button class="secondary-button" data-calendar-use-recommendation>직접 설정 취소</button>' : '<button class="secondary-button" data-calendar-direct>직접 설정</button>'}<button class="primary-button ${calendarDirectEdit ? 'custom' : ''}" data-calendar-apply ${!hasChange ? 'disabled' : ''}>${calendarDirectEdit ? `${calendarMoney(priceForCard)}원 반영하기` : '추천 가격 반영하기'}</button></div><p>${hasChange ? '누르면 판매 채널 10곳에 가격이 바로 반영돼요.' : calendarDirectEdit ? '입력한 가격이 현재 판매 가격과 같아요.' : '지금 가격이 추천 가격과 같아요.'}</p></footer></aside></div>`;
}
function calendarApplyDialog() {
  const date = calendarDate(calendarSelectionDate());
  const room = state.rooms.find((item) => item.id === state.calendarRoomId) || state.rooms[0];
  const info = calendarPriceInfo(date, room);
  const price = calendarDirectEdit ? Math.max(0, Math.round(Number(String(calendarPriceDraft).replace(/[^\d]/g, '')) || 0)) : info.recommended;
  return `<div class="calendar-confirm-backdrop" data-calendar-confirm-backdrop><section class="calendar-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="calendar-confirm-title"><h2 id="calendar-confirm-title">이 가격으로 반영할까요?</h2><p>반영하면 아래 판매 채널의 가격이 바로 바뀌어요.<br>반영한 뒤에는 되돌릴 수 없어요. 가격을 바꾸려면 다시 설정해 주세요.</p><div class="calendar-confirm-price"><small>${date.getMonth() + 1}월 ${date.getDate()}일 (${CALENDAR_WEEKDAYS[date.getDay()]}) · ${esc(room.name)}</small><strong><s>${calendarMoney(info.basePrice)}원</s><b>→</b><em>${calendarMoney(price)}원</em><i>${calendarDirectEdit ? '직접 설정' : info.chosen.option.name}</i></strong></div><strong class="calendar-channel-label">반영할 판매 채널</strong><div class="calendar-channel-box"><div class="calendar-channel-avatars" aria-label="연결된 판매 채널 10곳"><span class="calendar-channel-avatar" aria-label="야놀자">야</span><span class="calendar-channel-avatar" aria-label="여기어때">여</span><span class="calendar-channel-avatar" aria-label="에어비앤비">에</span><span class="calendar-channel-avatar" aria-label="자체 판매">자</span><span class="calendar-channel-more">+6</span></div><strong>10곳 <small>/ 연결된 10곳</small></strong><button type="button">채널 바꾸기</button></div><footer><button class="secondary-button" data-calendar-apply-cancel>취소</button><button class="primary-button" data-calendar-apply-confirm>반영하기</button></footer></section></div>`;
}
function showCalendarPanelToast(message) {
  calendarPanelToast = message;
  clearTimeout(calendarPanelToastTimer);
  render();
  calendarPanelToastTimer = setTimeout(() => {
    calendarPanelToast = '';
    if (calendarDetailOpen && state.view === 'calendar') render();
  }, 2600);
}
function openCalendar(dateValue, roomId) {
  if (dateValue) {
    calendarSelectedDate = dateValue;
    // In room-by-room view, keep the clicked date at the left edge of the 7-day grid.
    if (state.calendarMode === 'week') state.calendarDate = dateValue;
  }
  calendarPanelToast = '';
  clearTimeout(calendarPanelToastTimer);
  if (roomId && state.rooms.some((room) => room.id === roomId)) state.calendarRoomId = roomId;
  calendarDetailOpen = true;
  calendarDirectEdit = false;
  calendarMatrixExpanded = false;
  calendarCompetitorsExpanded = false;
  calendarMappingMenuOpen = false;
  calendarApplyConfirmOpen = false;
  calendarPriceDraft = '';
  render();
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* local storage may be disabled */ }
  const stamp = document.querySelector('[data-save-state]');
  if (stamp) stamp.textContent = '자동 저장됨 · 방금 전';
}

function resetConfirmDialog() {
  if (!resetConfirmOpen) return '';
  return `<div class="reset-confirm-backdrop" data-reset-backdrop><section class="reset-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="reset-confirm-title" aria-describedby="reset-confirm-description">
    <span class="reset-confirm-icon">↺</span><h2 id="reset-confirm-title">데모를 초기화할까요?</h2><p id="reset-confirm-description">이 브라우저에 저장된 설정을 샘플 값으로 되돌립니다.</p>
    <footer><button class="secondary-button" data-reset-cancel>취소</button><button class="primary-button reset-confirm-action" data-reset-confirm>초기화</button></footer>
  </section></div>`;
}

function showToast(message) {
  const node = document.querySelector('#toast');
  node.textContent = message;
  node.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('show'), 2600);
}

function sidebar(animateStep = false, animateCompletion = false) {
  const current = state.view === 'pricing' ? state.step : 0;
  const completedSteps = state.mappingCompleted ? 5 : Math.min(4, Math.max(0, current - 1));
  const marketActive = state.view === 'market';
  const calendarActive = state.view === 'calendar';
  const pricingActive = state.view === 'pricing';
  const setupStepsVisible = pricingActive && (state.mappingCompleted || (state.step >= 1 && state.step <= 5));
  const rmsNavActive = marketActive || pricingActive;
  const property = selectedProperty();
  const propertyMeta = property.type === 'demo' ? '데모 숙소 · 객실 샘플' : `호텔 · ${roomTotal()}실`;
  const menuItems = [[icons.doc, '판매 관리'], [icons.bed, '객실 관리']];
  const menuTailItems = [[icons.card, '정산'], [icons.sun, '설정']];
  const stepLabels = ['기본 정보', '가격 단계', '점유율 구간', '시즌', '상황별 가격'];
  const steps = stepLabels.map((label, index) => {
    const number = index + 1;
    const done = state.mappingCompleted ? number !== current : number < current;
    const active = number === current;
    const navigable = state.mappingCompleted || number <= current;
    return `<button type="button" class="side-step ${active ? 'active' : ''} ${done ? 'completed' : ''} ${navigable ? 'clickable' : 'locked'}" data-pricing-step="${number}" ${active ? 'aria-current="step"' : ''} ${navigable ? '' : 'disabled aria-disabled="true"'}><span class="side-number">${done ? '✓' : number}</span><span>${label}</span></button>`;
  }).join('');
  return `<aside class="sidebar ${animateStep ? 'step-enter' : ''}">
    <div class="brand"><span class="brand-mark">V</span><span class="brand-word">VENDIT</span><span class="brand-rms">RMS</span></div>
    <div class="property"><span class="property-icon">${icons.hotel}</span><span><strong>${esc(property.name)}</strong><small>${propertyMeta}</small></span></div>
    ${setupStepsVisible ? `<div class="sidebar-progress"><strong>시작하기 · 필수</strong><span>${completedSteps}/5 완료</span><div class="progress-track"><i style="width:${completedSteps * 20}%"></i></div></div>
    <nav class="side-steps" aria-label="가격 설정 단계">${steps}</nav>
    ${state.mappingCompleted ? `<div class="sidebar-complete-banner ${animateCompletion ? 'complete-enter' : ''}"><span>✓</span><strong>시작하기를 모두 마쳤어요</strong></div>` : '<div class="side-nav-label">설정을 마치면 열려요<br><span>메뉴</span></div>'}` : '<div class="side-nav-label menu-only">메뉴</div>'}
    <nav class="main-nav" aria-label="주 메뉴">
      ${menuItems.map(([icon, label]) => label === '판매 관리'
        ? `<button class="nav-item ${calendarActive ? 'active' : ''}" data-open-calendar ${state.mappingCompleted ? '' : 'disabled aria-disabled="true" title="가격 설정을 완료하면 판매 관리가 열려요."'}>${icon}<span>${label}</span></button>`
        : `<div class="nav-item">${icon}<span>${label}</span></div>`).join('')}
      <button class="nav-item rms-nav-item ${rmsNavActive ? 'active' : ''}" data-rms-menu-toggle aria-expanded="${rmsMenuOpen || rmsNavActive}">${icons.chart}<span>요금 관리 (RMS)</span><i class="nav-chevron">${rmsMenuOpen || rmsNavActive ? '⌃' : '⌄'}</i></button>
      ${rmsMenuOpen || rmsNavActive ? `<div class="rms-submenu" aria-label="요금 관리 (RMS) 메뉴"><button class="rms-submenu-item ${pricingActive ? 'selected' : ''}" data-rms-page="pricing"><i></i><span>가격 설정</span></button><button class="rms-submenu-item ${marketActive ? 'selected' : ''}" data-rms-page="market"><i></i><span>주변 시세</span></button></div>` : ''}
      ${menuTailItems.map(([icon, label]) => `<div class="nav-item">${icon}<span>${label}</span></div>`).join('')}
    </nav>
    <div class="help-card"><strong>RMS가 처음이신가요?</strong><a href="#guide" data-guide>3분 사용 가이드 보기 <span>→</span></a></div>
  </aside>`;
}

function topbar() {
  const property = selectedProperty();
  const options = PROPERTIES.map((item) => `<button class="property-option ${item.id === property.id ? 'selected' : ''}" role="option" aria-selected="${item.id === property.id}" data-property-option="${esc(item.id)}"><span class="property-option-icon">${icons.hotel}</span><span class="property-option-copy"><strong>${esc(item.name)}</strong><small>${item.type === 'demo' ? '데모 숙소 · 객실 샘플' : `호텔 · ${roomTotal()}실`}</small></span>${item.id === property.id ? '<span class="property-option-check">✓</span>' : ''}</button>`).join('');
  const breadcrumbs = state.view === 'calendar'
    ? '<span>요금 관리 (RMS)</span><b>›</b><strong>가격 관리</strong>'
    : state.view === 'market'
    ? '<span>가격 관리</span><b>›</b><span>설정</span><b>›</b><strong>경쟁 숙소</strong>'
    : '<span>요금 관리 (RMS)</span><b>›</b><strong>가격 설정</strong>';
  return `<header class="topbar"><div class="breadcrumbs">${breadcrumbs}</div><div class="top-actions"><button class="icon-button" aria-label="검색">${icons.search}</button><button class="icon-button notification" aria-label="알림">${icons.bell}<i></i></button><div class="property-switcher"><button class="property-switch" data-property-toggle aria-haspopup="listbox" aria-expanded="${propertyMenuOpen}" aria-controls="property-menu">${esc(property.name)} <span>${propertyMenuOpen ? '⌃' : '⌄'}</span></button>${propertyMenuOpen ? `<div class="property-menu" id="property-menu" role="listbox" aria-label="숙소 선택"><div class="property-menu-heading"><strong>숙소 선택</strong><span>${PROPERTIES.length}곳</span></div>${options}<div class="property-menu-note">데모 숙소는 현재 객실 샘플 데이터를 사용해요.</div></div>` : ''}</div><span class="avatar">김</span><div class="user-name"><strong>김사장님</strong><small>대표</small></div></div></header>`;
}

function stepper() {
  const active = state.step;
  const labels = ['기본 정보', '가격 단계', '점유율 구간', '시즌', '상황별 가격'];
  return `<div class="stepper" role="group" aria-label="가격 설정 진행 단계">${labels.map((label, i) => {
    const n = i + 1;
    const complete = (n < active && n <= 4) || (n === 5 && state.mappingCompleted);
    const current = n === active;
    return `<div class="stepper-item ${current ? 'current' : ''} ${complete ? 'complete' : ''}" ${current ? 'aria-current="step"' : ''}><span class="stepper-circle" aria-hidden="true">${complete ? '✓' : n}</span><strong>${label}</strong></div>${n < 5 ? '<span class="stepper-line" aria-hidden="true"></span>' : ''}`;
  }).join('')}</div>`;
}

function introCard() {
  if (state.step === 1) return `<section class="intro-card"><div class="eyebrow">STEP 1 / 5 · 기본 정보</div><h1>객실별 기준가를 확인해 주세요</h1><p>기준가는 <strong>비수기 평일</strong>에 평소 받는 1박 가격이에요.</p></section>`;
  if (state.step === 3) return `<section class="intro-card occupancy-intro"><span class="occupancy-room-pill">기준: 숙소 전체 ${roomTotal()}실</span><div class="eyebrow">STEP 3 / 5 · 점유율 구간</div><h1>객실이 찬 정도를 몇 구간으로 나눌까요?</h1><p>점유율은 숙소 전체 객실 중 팔린 객실의 비율이에요. 객실 종류와 상관없이 하나로 계산해요.<br>지금은 점유율 구간만 나누고, 각 구간에 적용할 가격은 5단계 매핑에서 정해요.</p></section>`;
  if (state.step === 4) return `<section class="intro-card season-intro"><div class="eyebrow">STEP 4 / 5 · 시즌</div><h1>해마다 붐비는 때를 알려 주세요</h1><p>매년·매주 반복되는 기간을 정하면 다음 해에도 자동으로 적용돼요. 나눈 시즌은 매핑 표의 열이 돼요.</p></section>`;
  if (state.step === 5) return `<section class="intro-card mapping-intro"><div class="eyebrow">STEP 5 / 5 · 상황별 가격</div><h1>상황마다 어떤 가격을 쓸까요?</h1><p>전체 <strong>판매 객실 수</strong>와 <strong>평일·주말·시즌</strong>에 맞춰 가격 단계를 선택해요.<br><strong>객실 종류별</strong>로 다르게 설정할 수 있어요.</p></section>`;
  return `<section class="intro-card step2-intro"><div class="eyebrow">STEP 2 / 5 · 가격 단계</div><h1>기준가에서 얼마나 올리고 내릴까요?</h1><p>평소 가격(기준가)을 가운데 두고, 손님이 몰릴 때 올릴 가격과 적을 때 내릴 가격을 단계로 만들어요.<br>기준가보다 한 칸 위는 <strong>+1단계</strong>, 한 칸 아래는 <strong>-1단계</strong>예요. 이렇게 만든 단계를 마지막 매핑에서 칸마다 골라 써요.</p></section>`;
}

function step1Content() {
  const count = roomTotal();
  const rows = state.rooms.map((room, index) => {
    const errors = roomFieldErrors(room);
    return `<tr data-room-row="${esc(room.id)}">
      <td class="room-name">${esc(room.name)}</td>
      <td><label class="field-unit count-field ${errors.count ? 'invalid' : ''}"><input aria-label="${esc(room.name)} 객실 수" type="number" min="1" step="1" value="${room.count}" data-room-count="${esc(room.id)}" aria-invalid="${Boolean(errors.count)}" ${errors.count ? `aria-describedby="room-count-error-${index}"` : ''}><span>실</span></label>${errors.count ? `<small class="field-error" id="room-count-error-${index}" role="alert">${errors.count}</small>` : ''}</td>
      <td><label class="field-unit price-field ${errors.basePrice ? 'invalid' : ''}"><input aria-label="${esc(room.name)} 기준가" type="text" inputmode="numeric" pattern="[0-9,]*" value="${integer(room.basePrice)}" data-base-price="${esc(room.id)}" aria-invalid="${Boolean(errors.basePrice)}" ${errors.basePrice ? `aria-describedby="room-price-error-${index}"` : ''}><span>원</span></label>${errors.basePrice ? `<small class="field-error" id="room-price-error-${index}" role="alert">${errors.basePrice}</small>` : ''}</td>
      <td class="delete-cell"><button class="delete-button" data-delete-room="${esc(room.id)}" ${state.rooms.length <= 1 ? 'disabled title="객실은 하나 이상 필요해요"' : ''}>삭제</button></td>
    </tr>`;
  }).join('');
  return `<section class="content-card room-card">
    <div class="room-card-top"><span>V-CMS에서 객실 정보와 기준가를 불러왔어요.</span><button class="secondary-button reload-button" data-reload>${icons.refresh}<span>V-CMS 다시 불러오기</span></button></div>
    <div class="stats-grid">
      <div class="stat-card"><span>객실 종류</span><strong>${state.rooms.length}개</strong></div>
      <div class="stat-card"><span>전체 객실</span><strong>${count}실</strong></div>
      <div class="stat-card"><span>평균 기준가</span><strong>${money(averagePrice())}<small>객실 수 기준</small></strong></div>
    </div>
    <h2 class="table-prompt">객실 수와 기준가를 확인하고, 실제 정보와 다르면 수정해 주세요.</h2>
    <div class="table-wrap"><table class="room-table"><thead><tr><th>객실 종류</th><th>객실 수</th><th>기준가 <span>(비수기 평일 1박)</span></th><th><span class="sr-only">행동</span></th></tr></thead><tbody>${rows}</tbody></table></div>
    ${state.rooms.length ? '' : '<p class="room-validation-summary" role="alert">객실 정보가 없어요. V-CMS에서 다시 불러와 주세요.</p>'}
  </section>`;
}

function stageRows(type) {
  const model = priceStageModel();
  const values = type === 'up' ? model.up : model.down;
  const prices = type === 'up' ? model.upPrices : model.downPrices;
  return values.map((pct, index) => {
    const name = priceStageName(type, index);
    const price = prices[index] || 0;
    const swatchColor = stageSwatchColor(type, index, values.length);
    const isCountHighlight = stageCountHighlight?.type === type && stageCountHighlight.index === index;
    const isLimitStage = type === 'up' ? index === 0 : index === values.length - 1;
    const extremeLabel = type === 'up' ? (index === 0 ? '<span class="extreme-badge">최고가</span>' : '<span class="extreme-spacer"></span>') : (index === values.length - 1 ? '<span class="extreme-badge">최저가</span>' : '<span class="extreme-spacer"></span>');
    return `<div class="stage-row ${type}${isCountHighlight ? ' count-highlight' : ''}" draggable="${!isLimitStage}" data-stage-row="${type}" data-stage-index="${index}">
      <span class="drag-grip" aria-label="단계 순서 바꾸기">${icons.grip}</span><span class="stage-swatch" style="--stage-swatch-color:${swatchColor}"></span><strong>${name}</strong>${extremeLabel}<span class="stage-price">${money(price)}</span>
      <label class="percent-input"><input type="number" step="0.1" value="${pct}" aria-label="${name} 변동률" data-stage-pct="${type}" data-index="${index}" ${isLimitStage ? 'readonly' : ''}><span>%</span></label>
      <button class="remove-stage" aria-label="${name} 삭제" data-remove-stage="${type}" data-index="${index}">×</button>
    </div>`;
  }).join('');
}

function stageSwatchColor(type, index, count) {
  const pale = type === 'up' ? [255, 224, 224] : [228, 236, 255];
  const vivid = type === 'up' ? [249, 185, 185] : [191, 209, 255];
  const intensity = count <= 1 ? 1 : type === 'up'
    ? (count - 1 - index) / (count - 1)
    : index / (count - 1);
  return `#${pale.map((channel, i) => Math.round(channel + (vivid[i] - channel) * intensity).toString(16).padStart(2, '0')).join('')}`;
}

function rangeNotice() {
  const room = selectedRoom();
  if (!room) return '객실을 선택하거나 기본 정보를 입력해 주세요.';
  const model = priceStageModel();
  if (!model.valid) return '최저·최고 한도를 확인해 주세요.';
  const low = model.minPrice;
  const high = model.maxPrice;
  if (low <= 0) return '최저 한도 금액이 0원 이하예요. 최저 한도를 조정해 주세요.';
  return `${esc(room.name)}은 <strong>${money(low)} ~ ${money(high)}</strong> 사이에서만 움직여요`;
}

function stageValidity() {
  return step2ValidationErrors().length === 0;
}

function statusBanner() {
  const model = priceStageModel();
  if (stageValidity()) return `<div class="valid-banner"><span>✓</span> 모든 단계가 한도(${fmtPct(model.min)} ~ ${fmtPct(model.max)}) 안에 있어요</div>`;
  return `<div class="invalid-banner" role="alert"><span>!</span> ${esc(step2ValidationErrors()[0])}</div>`;
}

function chartSvg() {
  const room = selectedRoom();
  if (!room) return '<div class="chart-empty">객실 정보가 없어요.</div>';
  const model = priceStageModel();
  const width = 620, height = Math.max(330, 92 + (model.up.length + model.down.length + 1) * 45 + 44);
  const left = 105, right = 74, inner = width - left - right;
  const min = model.min;
  const max = model.max;
  const domainMin = min - Math.max(5, Math.abs(min) * 0.12);
  const domainMax = max + Math.max(5, Math.abs(max) * 0.12);
  const x = (pct) => left + ((pct - domainMin) / (domainMax - domainMin)) * inner;
  const zeroX = x(0);
  const rowTop = 60, rowGap = 45, barH = 28;
  const rows = [];
  const allRows = [
    ...model.up.map((pct, i) => ({ type: 'up', pct: model.upChartPercents[i], price: model.upPrices[i], index: i })),
    { type: 'base', pct: 0, index: 0 },
    ...model.down.map((pct, i) => ({ type: 'down', pct: model.downChartPercents[i], price: model.downPrices[i], index: i })),
  ];
  allRows.forEach((item, i) => {
    const y = rowTop + i * rowGap;
    if (item.type === 'base') {
      rows.push(`<text x="14" y="${y + 20}" class="svg-label base">기준가</text><rect x="${zeroX - 5}" y="${y + 1}" width="10" height="28" rx="4" fill="#6B7280"/><text x="${zeroX + 15}" y="${y + 20}" class="svg-price base">${integer(room.basePrice)}</text>`);
    } else {
      const endX = x(item.pct), rectX = Math.min(zeroX, endX), barWidth = Math.max(3, Math.abs(endX - zeroX));
      const colorClass = item.type;
      const name = priceStageName(item.type, item.index);
      const valueX = item.type === 'up' ? endX + 7 : endX - 7;
      const anchor = item.type === 'up' ? 'start' : 'end';
      const isCountHighlight = stageCountHighlight?.type === item.type && stageCountHighlight.index === item.index;
      const highlightClass = isCountHighlight ? ' count-highlight' : '';
      rows.push(`<text x="14" y="${y + 20}" class="svg-label ${colorClass}">${name}</text><rect x="${rectX}" y="${y}" width="${barWidth}" height="${barH}" rx="5" class="svg-bar ${colorClass}${highlightClass}"/><text x="${valueX}" y="${y + 20}" text-anchor="${anchor}" class="svg-price ${colorClass}${highlightClass}">${integer(item.price)}</text>`);
    }
  });
  const graphBottom = rowTop + allRows.length * rowGap - 9;
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="기준가에서 가격 단계별 변동 범위">
    <line x1="${x(min)}" y1="46" x2="${x(min)}" y2="${graphBottom}" class="limit-line"/>
    <line x1="${x(max)}" y1="46" x2="${x(max)}" y2="${graphBottom}" class="limit-line"/>
    <line x1="${zeroX}" y1="46" x2="${zeroX}" y2="${graphBottom}" class="zero-line"/>
    ${rows.join('')}
    <text x="${x(min)}" y="${graphBottom + 25}" text-anchor="middle" class="svg-tick">${fmtPct(min)}</text>
    <text x="${zeroX}" y="${graphBottom + 25}" text-anchor="middle" class="svg-tick strong">기준가</text>
    <text x="${x(max)}" y="${graphBottom + 25}" text-anchor="middle" class="svg-tick">${fmtPct(max)}</text>
    <line x1="${left}" y1="${graphBottom + 8}" x2="${width - right}" y2="${graphBottom + 8}" class="axis-line"/>
  </svg>`;
}

function step2Content() {
  const room = selectedRoom();
  const model = priceStageModel();
  const valid = stageValidity();
  const low = room && model.valid ? model.minPrice : 0;
  const high = room && model.valid ? model.maxPrice : 0;
  const upAtLimit = state.up.length >= model.upMaxCount;
  const downAtLimit = state.down.length >= model.downMaxCount;
  const limitGuidance = [
    upAtLimit ? `올리는 단계: 현재 한도 범위에서는 최대 ${model.upMaxCount}단계까지 만들 수 있어요.` : '',
    downAtLimit ? `내리는 단계: 현재 한도 범위에서는 최대 ${model.downMaxCount}단계까지 만들 수 있어요.` : '',
  ].filter(Boolean).join(' ');
  return `<div class="question-card q1-card">
    <div class="question-heading"><span class="q-badge">Q1</span><div><h2>가장 싸게, 가장 비싸게 얼마까지 받을 수 있나요?</h2><p>손해 보지 않는 최저선과 손님이 납득할 최고선이에요. 어떤 단계도 이 범위를 넘을 수 없어요.</p></div></div>
    <div class="limits-row">
      <label class="limit-field"><strong>최저 한도</strong><span class="field-unit"><input type="number" min="${MIN_PRICE_LIMIT}" max="0" step="1" value="${state.minLimit}" data-limit="min"><span>% 기준가 대비</span></span></label>
      <span class="limit-separator">~</span>
      <label class="limit-field"><strong>최고 한도</strong><span class="field-unit"><input type="number" min="0" max="${MAX_PRICE_LIMIT}" step="1" value="${state.maxLimit}" data-limit="max"><span>% 기준가 대비</span></span></label>
      <div class="range-callout ${valid ? '' : 'range-callout-invalid'}">${rangeNotice()}</div>
    </div>
  </div>
  <div class="question-card q2-card">
    <div class="question-heading q2-heading"><span class="q-badge">Q2</span><div><h2>기준가 위·아래로 몇 단계씩 둘까요?</h2><p>각 방향의 단계는 해당 한도까지 같은 간격으로 나눠요. 위·아래 단계 수는 따로 조절할 수 있어요.</p></div></div>
    <div class="stage-controls">
      <strong>올리는 단계</strong><div class="step-counter"><button data-count-step="up" data-delta="-1" aria-label="올리는 단계 줄이기" ${state.up.length <= MIN_PRICE_STEPS ? 'disabled' : ''}>−</button><span>${state.up.length}</span><button data-count-step="up" data-delta="1" aria-label="올리는 단계 늘리기" ${state.up.length >= model.upMaxCount ? 'disabled' : ''}>+</button></div>
      <strong>내리는 단계</strong><div class="step-counter"><button data-count-step="down" data-delta="-1" aria-label="내리는 단계 줄이기" ${state.down.length <= MIN_PRICE_STEPS ? 'disabled' : ''}>−</button><span>${state.down.length}</span><button data-count-step="down" data-delta="1" aria-label="내리는 단계 늘리기" ${state.down.length >= model.downMaxCount ? 'disabled' : ''}>+</button></div>
      <span class="total-stages">기준가 포함 ${state.up.length + state.down.length + 1}개</span>
    </div>
    <div class="stage-workspace">
      <section class="stage-editor" aria-label="가격 단계 편집">
        <div class="direction-heading up-heading">▲ 기준가보다 높게 · 손님이 몰릴 때</div>
        ${stageRows('up')}
        <div class="base-row"><span class="stage-swatch"></span><div><strong>기준가</strong><small>기본 정보에서 정한 평소 가격 · 모든 단계의 출발점</small></div><strong class="base-price">${money(room?.basePrice || 0)}</strong><span class="base-pct">0%</span></div>
        <div class="direction-heading down-heading">▼ 기준가보다 낮게 · 손님이 적을 때</div>
        ${stageRows('down')}
        ${statusBanner()}
        <p class="editor-note">${limitGuidance || '단계를 더하거나 빼도 기준가와 반대 방향의 단계는 그대로 유지돼요.'}</p>
      </section>
      <section class="chart-card" aria-label="가격 단계 미리보기">
        <div class="chart-heading"><h3>기준가에서 얼마나 움직이나요?</h3><p>가운데 선이 기준가예요.<br>오른쪽은 올린 가격, 왼쪽은 내린 가격이에요.</p></div>
        <label class="preview-select"><span class="sr-only">미리 볼 객실</span><select data-preview-room>${state.rooms.map((r) => `<option value="${esc(r.id)}" ${r.id === room?.id ? 'selected' : ''}>${esc(r.name)}　　${r.count}실</option>`).join('')}</select><span>⌄</span></label>
        <div class="chart-wrap">${chartSvg()}</div>
        <div class="chart-legend"><span><i class="legend-dash"></i> 최저·최고 한도</span><span><i class="legend-swatch down"></i> 내린 가격</span><span><i class="legend-swatch up"></i> 올린 가격</span></div>
      </section>
    </div>
  </div>`;
}

function occupancyContent() {
  const total = roomTotal();
  const ranges = occupancyRanges();
  const errors = occupancyValidationErrors();
  const canAdd = state.occupancyEnds.length < 8 && ranges.some((range) => range.upperPercent - range.lowerPercent > 1);
  const rows = ranges.map((range) => {
    const isLast = range.index === ranges.length - 1;
    const nextEnd = state.occupancyEnds[range.index + 1] ?? 100;
    const low = range.lowerPercent + 1;
    const high = isLast ? 100 : nextEnd - 1;
    const sales = range.startRooms <= range.endRooms ? `${range.startRooms}~${range.endRooms}실` : '구간 조정 필요';
    return `<tr>
      <td><span class="occupancy-letter tone-${range.index % 8}">${range.letter}</span></td>
      <td><div class="occupancy-bounds"><label class="field-unit occupancy-bound locked"><input type="number" value="${range.lowerPercent}" aria-label="${range.letter} 구간 시작 점유율" disabled><span>%</span></label><span class="occupancy-separator">~</span><label class="field-unit occupancy-bound ${isLast ? 'locked' : ''}"><input type="number" min="${low}" max="${high}" step="1" value="${range.upperPercent}" aria-label="${range.letter} 구간 끝 점유율" data-occupancy-end="${range.index}" ${isLast ? 'disabled' : ''}><span>%</span></label></div></td>
      <td class="occupancy-sales"><strong>${sales}</strong><span>판매</span></td>
      <td class="occupancy-action"><button aria-label="${range.letter} 구간 삭제" data-remove-occupancy="${range.index}" ${ranges.length <= 2 ? 'disabled title="구간은 두 개 이상 필요해요"' : ''}>×</button></td>
    </tr>`;
  }).join('');
  const nonEmptyRanges = ranges.filter((range) => range.tileCount > 0);
  const headers = nonEmptyRanges.map((range) => `<span class="tone-${range.index % 8}" style="flex:${range.tileCount}">${range.letter}</span>`).join('');
  const tileGroups = nonEmptyRanges.map((range) => {
    const tiles = Array.from({ length: range.tileCount }, (_, offset) => {
      const sold = range.soldStart + offset;
      return `<span class="occupancy-tile">${sold}</span>`;
    }).join('');
    return `<div class="occupancy-tile-group tone-${range.index % 8}" style="flex:${range.tileCount}">${tiles}</div>`;
  }).join('');
  const safeTotal = Math.max(total, 1);
  const ticks = [{ label: '0%', position: 0 }, ...ranges.map((range) => ({
    label: `${range.upperPercent}%`,
    position: Math.max(0, Math.min(100, range.endRooms / safeTotal * 100)),
  }))].map((tick, index, all) => `<span class="occupancy-tick ${index === 0 ? 'start' : ''} ${index === all.length - 1 ? 'end' : ''}" style="left:${tick.position}%">${tick.label}</span>`).join('');

  return `<section class="question-card occupancy-card">
    <div class="question-heading"><span class="q-badge">Q1</span><div><h2>구간 경계를 정해 주세요</h2><p>표에서 각 구간이 끝나는 점유율을 입력해요. 손님이 몰리는 높은 점유율은 구간을 더 세밀하게 나눌 수 있어요.</p></div></div>
    <div class="occupancy-table-wrap"><table class="occupancy-table"><thead><tr><th>구간</th><th>점유율</th><th>판매된 객실 수 <span>(전체 ${total}실 기준)</span></th><th><span class="sr-only">행동</span></th></tr></thead><tbody>${rows}</tbody></table></div>
    <button class="add-occupancy" data-add-occupancy ${canAdd ? '' : 'disabled'}>＋ 구간 추가</button>
    ${errors.length ? `<div class="occupancy-validation" role="alert">${esc(errors[0])}</div>` : ''}
    <section class="occupancy-preview" aria-label="점유율 구간 미리보기">
      <div class="occupancy-preview-heading"><div><strong>구간 미리보기</strong><span>오늘 팔린 객실 수를 보면 어느 구간인지 바로 알 수 있어요</span></div><small>표에서 숫자를 고치면 경계선이 따라 움직여요</small></div>
      <div class="occupancy-preview-line"><strong class="occupancy-total-label">전체 ${total}실</strong><div class="occupancy-preview-body"><div class="occupancy-band-labels">${headers}</div><div class="occupancy-tile-groups">${tileGroups}</div><div class="occupancy-ticks">${ticks}</div></div></div>
    </section>
  </section>`;
}

const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const ordinalDay = (month, day) => MONTH_LENGTHS.slice(0, month - 1).reduce((sum, length) => sum + length, 0) + day - 1;
const monthPosition = (month, day) => month > 12 ? 100 : ((month - 1) + (day - 1) / MONTH_LENGTHS[month - 1]) / 12 * 100;
const seasonTypeLabel = (type) => type === 'shoulder' ? '준성수기' : type === 'holiday' ? '연휴' : '성수기';
const seasonTypeClass = (type) => type === 'shoulder' ? 'shoulder' : type === 'holiday' ? 'holiday' : 'peak';
const dateLabel = (month, day) => `${month}.${String(day).padStart(2, '0')}`;
function parseSeasonDateInput(value) {
  const match = String(value).trim().match(/^(\d{1,2})\s*(?:월|[./-])\s*(\d{1,2})\s*일?$/);
  if (!match) return null;
  const month = Number(match[1]);
  const day = Number(match[2]);
  if (month < 1 || month > 12 || day < 1 || day > MONTH_LENGTHS[month - 1]) return null;
  return { month, day };
}
const seasonDateInputLabel = (month, day) => `${month}월 ${day}일`;
const periodLabel = (period) => `${dateLabel(period.startMonth, period.startDay)} – ${dateLabel(period.endMonth, period.endDay)}`;
function seasonPeriodSummary(season) {
  if (season.automatic) return '자동 반영';
  return season.periods.map(periodLabel).join(' · ');
}
function hasDuplicateSeasonSchedule() {
  const periods = seasonDraft?.periods || [];
  return state.seasons.some((season) => season.id !== editingSeasonId && !season.automatic && season.periods.some((existing) => (
    periods.some((period) => existing.startMonth === period.startMonth
      && existing.startDay === period.startDay
      && existing.endMonth === period.endMonth
      && existing.endDay === period.endDay)
  )));
}
function periodSegments(period) {
  const start = ordinalDay(period.startMonth, period.startDay);
  const end = ordinalDay(period.endMonth, period.endDay);
  const left = monthPosition(period.startMonth, period.startDay);
  const right = monthPosition(period.endMonth, period.endDay + 1);
  if (end >= start) return [{ left, width: Math.max(right - left, 0.45) }];
  return [{ left, width: 100 - left }, { left: 0, width: right }];
}
function seasonBarButton(season, period, periodIndex, segment, segmentIndex) {
  const left = segment.left;
  const width = Math.max(segment.width, 0.45);
  return `<button class="season-bar ${seasonTypeClass(season.type)}" aria-label="${esc(season.name)} ${periodLabel(period)} 편집" title="${esc(season.name)} · ${periodLabel(period)}" style="left:${left}%;width:${width}%" data-season-bar="${esc(season.id)}" data-period-index="${periodIndex}" data-segment-index="${segmentIndex}"></button>`;
}
function seasonPopoverMarkup() {
  if (!seasonPopover) return '';
  const season = state.seasons.find((item) => item.id === seasonPopover.seasonId);
  const period = season?.periods[seasonPopover.periodIndex];
  if (!season || !period) return '';
  const start = ordinalDay(period.startMonth, period.startDay);
  const end = ordinalDay(period.endMonth, period.endDay);
  const duration = end >= start ? end - start + 1 : 365 - start + end + 1;
  return `<div class="season-popover ${seasonPopoverEntering ? 'popover-enter' : ''}" style="left:${seasonPopover.x}%" role="dialog" aria-label="${esc(season.name)}">
    <div class="season-popover-title"><strong>${esc(season.name)}</strong><span class="season-type-badge ${seasonTypeClass(season.type)}">${seasonTypeLabel(season.type)}</span></div>
    <p>매년 ${period.startMonth}월 ${period.startDay}일 – ${period.endMonth}월 ${period.endDay}일 · ${duration}일</p>
    <button class="primary-button" data-edit-season="${esc(season.id)}" data-period-index="${seasonPopover.periodIndex}">수정하기</button>
  </div>`;
}
function seasonTimeline() {
  const months = Array.from({ length: 12 }, (_, index) => `<span>${index + 1}월</span>`).join('');
  const now = new Date();
  const todayPosition = monthPosition(now.getMonth() + 1, now.getDate());
  const rows = state.seasons.map((season, seasonIndex) => {
    const labelButton = season.automatic
      ? `<span class="season-name-static">${esc(season.name)}</span>`
      : `<button class="season-name-button" data-season-popup="${esc(season.id)}" data-period-index="0">${esc(season.name)}</button>`;
    const bars = season.active && !season.automatic
      ? season.periods.flatMap((period, periodIndex) => periodSegments(period).map((segment, segmentIndex) => seasonBarButton(season, period, periodIndex, segment, segmentIndex))).join('')
      : '';
    const today = `<span class="season-today-line" style="left:${todayPosition}%"></span>${seasonIndex === state.seasons.length - 1 ? `<span class="season-today-label" style="left:${todayPosition}%">오늘</span>` : ''}`;
    return `<div class="season-row">
      <div class="season-row-info"><input type="checkbox" aria-label="${esc(season.name)} 사용" data-season-toggle="${esc(season.id)}" ${season.active ? 'checked' : ''}><div class="season-row-copy"><div class="season-title-line">${labelButton}<span class="season-type-badge ${seasonTypeClass(season.type)}">${seasonTypeLabel(season.type)}</span></div><small>${seasonPeriodSummary(season)}</small></div></div>
      <div class="season-track ${season.automatic ? 'automatic' : ''}">${season.automatic ? '<span class="season-auto-note">켜면 해마다 연휴 날짜를 자동으로 맞춰요</span>' : bars}${today}${seasonPopover?.seasonId === season.id ? seasonPopoverMarkup() : ''}</div>
    </div>`;
  }).join('');
  return `<div class="season-timeline">
    <div class="season-month-head"><span></span><div class="season-months">${months}</div></div>
    <div class="season-rows">${rows}</div>
  </div>`;
}
function seasonContent() {
  const weekdays = WEEKDAYS.map((day, index) => `<button class="weekday-option ${state.busyWeekdays.includes(index) ? 'selected' : ''}" aria-pressed="${state.busyWeekdays.includes(index)}" data-weekday="${index}"><strong>${day}</strong>${state.busyWeekdays.includes(index) ? '<small>주말</small>' : ''}</button>`).join('');
  return `<section class="question-card season-card">
      <div class="question-heading season-question-heading"><span class="q-badge">Q1</span><div><h2>매년 반복되는 성수기는 언제인가요?</h2><p>막대를 눌러 기간과 유형을 고쳐요. 자주 쓰는 기간은 미리 넣어뒀어요.</p></div></div>
      <div class="season-legend"><span><i class="peak-key"></i> 성수기</span><span><i class="shoulder-key"></i> 준성수기</span></div>
      ${seasonTimeline()}
      <div class="season-card-actions"><button class="add-season-button" data-season-add>＋ 기간 추가</button><button class="secondary-button season-guide-button" data-season-guide>ⓘ 가이드 보기</button></div>
    </section>
    <section class="question-card season-weekdays-card">
      <div class="question-heading season-weekday-heading"><span class="q-badge">Q2</span><div><h2>매주 손님이 많은 요일은요?</h2><p>주말처럼 매주 반복되는 날이에요. 눌러서 켜고 꺼요.</p></div></div>
      <div class="weekday-options" role="group" aria-label="손님이 많은 요일">${weekdays}</div>
      <label class="holiday-eve-option"><input type="checkbox" data-holiday-eve ${state.holidayEveWeekend ? 'checked' : ''}><span><strong>공휴일 전날도 주말로 보기</strong><small>· 달력 자동</small></span></label>
    </section>`;
}

function calendarMonthMarkup(year, month) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const dayCount = new Date(year, month, 0).getDate();
  const period = seasonDraft?.periods[editingPeriodIndex];
  const startMonth = calendarPendingStart?.month ?? period?.startMonth ?? 1;
  const startDay = calendarPendingStart?.day ?? period?.startDay ?? 1;
  const endMonth = calendarPendingStart ? startMonth : period?.endMonth ?? 1;
  const endDay = calendarPendingStart ? startDay : period?.endDay ?? 1;
  const start = ordinalDay(startMonth, startDay);
  const end = ordinalDay(endMonth, endDay);
  const days = Array.from({ length: firstDay }, () => '<span class="calendar-empty"></span>');
  for (let day = 1; day <= dayCount; day += 1) {
    const value = ordinalDay(month, day);
    const selectedStart = startMonth === month && startDay === day;
    const selectedEnd = !calendarPendingStart && endMonth === month && endDay === day;
    const inRange = !calendarPendingStart && (end >= start ? value >= start && value <= end : value >= start || value <= end);
    days.push(`<button class="calendar-day ${inRange ? 'in-range' : ''} ${selectedStart ? 'range-start' : ''} ${selectedEnd ? 'range-end' : ''}" data-season-calendar-day="${year}-${month}-${day}" aria-label="${year}년 ${month}월 ${day}일">${day}</button>`);
  }
  return `<section class="calendar-month"><h3>${year}년 ${month}월</h3><div class="calendar-weekdays">${WEEKDAYS.map((day, index) => `<span class="${index === 0 ? 'sunday' : index === 6 ? 'saturday' : ''}">${day}</span>`).join('')}</div><div class="calendar-days">${days.join('')}</div></section>`;
}
function dateRangeLabel(period) {
  return `${period.startMonth}월 ${period.startDay}일 – ${period.endMonth}월 ${period.endDay}일`;
}
function seasonOverlays() {
  let drawer = '';
  if (seasonDrawerOpen && seasonDraft) {
    const duplicateSchedule = hasDuplicateSeasonSchedule();
    const missingSeasonName = !seasonDraft.name.trim();
    const dateFields = seasonDraft.periods.map((period, index) => `<div class="season-date-range"><div class="season-date-control"><label><small>시작</small><input type="text" inputmode="numeric" value="${seasonDateInputLabel(period.startMonth, period.startDay)}" data-season-date="start" data-period-index="${index}" aria-label="${index + 1}번째 기간 시작 날짜" placeholder="7월 20일" autocomplete="off"><span class="season-date-error" hidden>날짜 형식을 확인해 주세요.</span></label><button type="button" class="season-date-calendar-button ${calendarOpen && editingPeriodIndex === index && calendarTarget === 'start' ? 'active' : ''}" data-calendar-target="start" data-period-index="${index}" aria-label="${index + 1}번째 기간 시작 날짜 달력" aria-expanded="${calendarOpen && editingPeriodIndex === index}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="16" rx="2.5"></rect><path d="M7.5 3v4M16.5 3v4M3.5 9.5h17"></path></svg></button></div><span>~</span><div class="season-date-control"><label><small>끝</small><input type="text" inputmode="numeric" value="${seasonDateInputLabel(period.endMonth, period.endDay)}" data-season-date="end" data-period-index="${index}" aria-label="${index + 1}번째 기간 끝 날짜" placeholder="8월 20일" autocomplete="off"><span class="season-date-error" hidden>날짜 형식을 확인해 주세요.</span></label><button type="button" class="season-date-calendar-button ${calendarOpen && editingPeriodIndex === index && calendarTarget === 'end' ? 'active' : ''}" data-calendar-target="end" data-period-index="${index}" aria-label="${index + 1}번째 기간 끝 날짜 달력" aria-expanded="${calendarOpen && editingPeriodIndex === index}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="16" rx="2.5"></rect><path d="M7.5 3v4M16.5 3v4M3.5 9.5h17"></path></svg></button></div></div>`).join('');
    drawer = `<div class="season-drawer-backdrop ${seasonDrawerEntering ? 'drawer-enter' : ''}" data-drawer-backdrop><aside class="season-drawer ${seasonDrawerEntering ? 'drawer-enter' : ''}" role="dialog" aria-modal="true" aria-label="${creatingSeason ? '시즌 추가' : '시즌 수정'}">
      <header class="season-drawer-header"><h2>${creatingSeason ? '시즌 추가' : '시즌 수정'}</h2><p>이름과 기간, 유형을 바꿀 수 있어요. 매년 같은 날짜에 반복돼요.</p></header>
      <div class="season-drawer-body">
        <label class="season-form-field"><strong>시즌 이름</strong><input type="text" maxlength="30" value="${esc(seasonDraft.name)}" data-season-name placeholder="예: 여름 성수기" aria-invalid="${missingSeasonName}" aria-describedby="season-name-error"></label><div class="season-form-error" id="season-name-error" data-season-name-error role="alert" ${missingSeasonName ? '' : 'hidden'}>시즌 이름을 입력해 주세요.</div>
        <fieldset class="season-form-field season-type-field"><legend>시즌 유형</legend><div class="season-type-options"><button class="${seasonDraft.type === 'peak' ? 'selected' : ''}" data-season-type="peak">성수기</button><button class="${seasonDraft.type === 'shoulder' ? 'selected' : ''}" data-season-type="shoulder">준성수기</button></div></fieldset>
        <div class="season-form-field"><div class="season-period-label"><strong>기간</strong><span>· 매년 반복</span></div><div class="season-date-fields">${dateFields}</div></div>
        ${duplicateSchedule ? '<div class="season-duplicate-warning" role="alert"><span>!</span>같은 일정이 있습니다.</div>' : ''}
        <div class="season-info-banner"><span>ⓘ</span> 이 기간에는 매핑 표의 ‘${seasonTypeLabel(seasonDraft.type)}’ 열 가격이 적용돼요.</div>
      </div>
      <footer class="season-drawer-footer">${creatingSeason ? '<span></span>' : `<button class="season-delete-button" data-season-delete="${esc(editingSeasonId)}">삭제</button>`}<div><button class="secondary-button" data-season-cancel>취소</button><button class="primary-button" data-season-save ${duplicateSchedule || missingSeasonName ? 'disabled' : ''}>저장</button></div></footer>
    </aside></div>`;
  }
  let calendar = '';
  if (calendarOpen && seasonDraft) {
    const first = new Date(calendarView.year, calendarView.month - 1, 1);
    const second = new Date(calendarView.year, calendarView.month, 1);
    const period = seasonDraft.periods[editingPeriodIndex];
    const start = ordinalDay(period.startMonth, period.startDay);
    const end = ordinalDay(period.endMonth, period.endDay);
    const duration = end >= start ? end - start + 1 : 365 - start + end + 1;
    const calendarSummary = calendarPendingStart
      ? `시작 ${calendarPendingStart.month}월 ${calendarPendingStart.day}일 선택됨 · 다음 날짜는 종료일`
      : `${dateRangeLabel(period)} (${duration}일)`;
    calendar = `<div class="season-calendar-backdrop ${seasonCalendarEntering ? 'calendar-enter' : ''}" data-calendar-backdrop><section class="season-range-calendar ${seasonCalendarEntering ? 'calendar-enter' : ''}" role="dialog" aria-modal="true" aria-label="시즌 날짜 선택">
      <div class="calendar-months-shell"><button class="calendar-nav previous" aria-label="이전 달" data-season-calendar-nav="-1">‹</button><div class="calendar-month-pair">${calendarMonthMarkup(first.getFullYear(), first.getMonth() + 1)}${calendarMonthMarkup(second.getFullYear(), second.getMonth() + 1)}</div><button class="calendar-nav next" aria-label="다음 달" data-season-calendar-nav="1">›</button></div>
      <footer><span>· 매년 같은 날짜에 반복돼요</span><strong aria-live="polite">${calendarSummary}</strong></footer>
    </section></div>`;
  }
  return `${drawer}${calendar}`;
}

function openSeasonEditor(seasonId, periodIndex = 0, create = false) {
  const source = create
    ? { id: `season-${Date.now()}`, name: '새 시즌', type: 'peak', active: true, automatic: false, periods: [{ startMonth: 7, startDay: 1, endMonth: 7, endDay: 7 }] }
    : state.seasons.find((season) => season.id === seasonId);
  if (!source || source.automatic || !source.periods.length) return;
  seasonDraft = structuredClone(source);
  editingSeasonId = source.id;
  editingPeriodIndex = Math.max(0, Math.min(periodIndex, seasonDraft.periods.length - 1));
  creatingSeason = create;
  seasonDrawerOpen = true;
  seasonDrawerEntering = true;
  seasonPopover = null;
  calendarOpen = false;
  calendarPendingStart = null;
  const period = seasonDraft.periods[editingPeriodIndex];
  calendarView = { year: new Date().getFullYear(), month: period.startMonth };
  render();
}

function closeSeasonEditor() {
  seasonDrawerOpen = false;
  seasonDraft = null;
  editingSeasonId = null;
  editingPeriodIndex = 0;
  creatingSeason = false;
  calendarOpen = false;
  calendarPendingStart = null;
}

function footer() {
  if (state.step === 1) {
    const valid = step1IsValid();
    const hint = state.rooms.length ? '객실 수는 1실 이상, 기준가는 100원 이상이어야 해요.' : '객실 정보를 먼저 불러와 주세요.';
    return `<footer class="footer-actions ${valid ? '' : 'has-validation'} ${state.mappingCompleted ? 'step2-footer' : ''}">${state.mappingCompleted ? '<button class="secondary-button back-button" data-open-calendar><span>‹</span> 가격 관리로</button>' : ''}<span class="save-state" data-save-state>자동 저장됨 · 방금 전</span>${valid ? '' : `<span class="footer-validation" role="status">${hint}</span>`}<button class="primary-button" data-go="2" ${valid ? '' : 'disabled'}>다음: 가격 단계 정하기 <span>→</span></button></footer>`;
  }
  if (state.step === 2) {
    const valid = stageValidity();
    return `<footer class="footer-actions step2-footer"><button class="secondary-button back-button" data-go="1"><span>‹</span> 이전</button><span class="save-state" data-save-state>자동 저장됨 · 방금 전</span><button class="primary-button" data-go="3" ${valid ? '' : 'disabled'}>다음: 점유율 구간 정하기 <span>→</span></button></footer>`;
  }
  if (state.step === 3) {
    const valid = occupancyIsValid();
    return `<footer class="footer-actions step2-footer occupancy-footer"><button class="secondary-button back-button" data-go="2"><span>‹</span> 이전</button><span class="save-state" data-save-state>자동 저장됨 · 방금 전</span><button class="primary-button" data-finish ${valid ? '' : 'disabled'}>다음: 시즌 정하기 <span>→</span></button></footer>`;
  }
  if (state.step === 5) {
    const completionError = setupCompletionError();
    return `<footer class="footer-actions step2-footer mapping-footer"><button class="secondary-button back-button" data-go="4"><span>‹</span> 이전</button><span class="save-state" data-save-state>자동 저장됨 · 방금 전</span>${completionError ? `<span class="footer-validation" role="status">${esc(completionError)}</span>` : ''}<button class="primary-button" data-mapping-finish ${completionError ? 'disabled' : ''}>${state.mappingCompleted ? '가격 관리로 이동' : '설정 완료'} <span>${state.mappingCompleted ? '→' : '✓'}</span></button></footer>`;
  }
  return `<footer class="footer-actions step2-footer season-footer"><button class="secondary-button back-button" data-go="3"><span>‹</span> 이전</button><span class="save-state" data-save-state>자동 저장됨 · 방금 전</span><button class="primary-button" data-mapping-next>다음: 매핑하기 <span>→</span></button></footer>`;
}

function render() {
  const preserveScroll = hasRenderedOnce && state.view === lastRenderedView && state.step === lastRenderedStep;
  const previousPageScrollTop = preserveScroll ? document.querySelector('.page-scroll')?.scrollTop || 0 : 0;
  const animateStep = hasRenderedOnce && state.step !== lastRenderedStep;
  const animatePage = hasRenderedOnce && state.view !== lastRenderedView;
  const animateCompletion = hasRenderedOnce && state.mappingCompleted && !lastRenderedCompleted;
  const isMarket = state.view === 'market';
  const isCalendar = state.view === 'calendar';
  const content = isCalendar ? calendarContent() : isMarket ? marketContent() : state.step === 1 ? step1Content() : state.step === 2 ? step2Content() : state.step === 3 ? occupancyContent() : state.step === 4 ? seasonContent() : mappingContent();
  const pageContent = isCalendar || isMarket ? content : `${stepper()}${introCard()}${content}`;
  const fixedFooter = isMarket ? marketFooter() : isCalendar ? '' : footer();
  const scrollClass = isMarket ? 'market-scroll' : isCalendar ? 'calendar-scroll' : '';
  app.innerHTML = `<div class="shell">${sidebar(animateStep, animateCompletion)}<div class="main-column">${topbar()}<main class="main-content ${isMarket ? 'market-main' : ''} ${isCalendar ? 'calendar-main' : ''} ${animateStep ? 'step-enter' : ''} ${animatePage ? 'page-enter' : ''}"><div class="page-scroll ${scrollClass}">${pageContent}</div>${fixedFooter}</main></div></div>${!isMarket && !isCalendar && state.step === 4 ? seasonOverlays() : ''}${resetConfirmDialog()}`;
  stageCountHighlight = null;
  marketResultsRefreshing = false;
  if (preserveScroll) {
    const pageScroll = document.querySelector('.page-scroll');
    if (pageScroll) pageScroll.scrollTop = previousPageScrollTop;
  }
  lastRenderedStep = state.step;
  lastRenderedView = state.view;
  lastRenderedCompleted = state.mappingCompleted;
  hasRenderedOnce = true;
  seasonPopoverEntering = false;
  seasonDrawerEntering = false;
  seasonCalendarEntering = false;
  if (resetConfirmOpen) document.querySelector('[data-reset-cancel]')?.focus();
}

function updateCountStep(type, delta) {
  if (!['up', 'down'].includes(type)) return;
  const capacity = calculatePriceStageModel(stageBasePrice(), state.minLimit, state.maxLimit, 0, 0);
  const maximum = type === 'up' ? capacity.upMaxCount : capacity.downMaxCount;
  const nextCount = Math.max(MIN_PRICE_STEPS, Math.min(maximum, state[type].length + delta));
  if (nextCount === state[type].length) return;
  state[type] = Array(nextCount).fill(0);
  syncPriceStageValues();
}

app.addEventListener('click', (event) => {
  const pricingStep = event.target.closest('[data-pricing-step]');
  if (pricingStep) {
    if (pricingStep.disabled) return;
    const requested = Number(pricingStep.dataset.pricingStep);
    if (!Number.isInteger(requested) || requested < 1 || requested > 5) return;
    state.view = 'pricing';
    state.step = requested;
    rmsMenuOpen = false;
    propertyMenuOpen = false;
    seasonPopover = null;
    closeSeasonEditor();
    calendarDetailOpen = false;
    calendarMappingMenuOpen = false;
    mappingOpenCell = null;
    mappingOpenSeasonCategory = '';
    save(); render(); return;
  }
  if (event.target.closest('[data-reset-demo]')) {
    resetConfirmOpen = true;
    render();
    return;
  }
  if (event.target.closest('[data-reset-cancel]') || event.target.matches('[data-reset-backdrop]')) {
    resetConfirmOpen = false;
    render();
    document.querySelector('[data-reset-demo]')?.focus();
    return;
  }
  if (event.target.closest('[data-reset-confirm]')) {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* local storage may be unavailable */ }
    state = cloneDefaults();
    propertyMenuOpen = false;
    rmsMenuOpen = false;
    seasonPopover = null;
    closeSeasonEditor();
    mappingOpenCell = null;
    mappingOpenSeasonCategory = '';
    mappingHelpOpen = false;
    resetConfirmOpen = false;
    calendarSelectedDate = '';
    calendarPanelToast = '';
    clearTimeout(calendarPanelToastTimer);
    save();
    render();
    showToast('데모를 처음 상태로 초기화했어요.');
    return;
  }
  if (event.target.closest('[data-open-calendar]')) {
    if (!state.mappingCompleted) {
      state.view = 'pricing';
      save();
      render();
      showToast('판매 관리를 사용하려면 가격 설정을 먼저 마쳐 주세요.');
      return;
    }
    state.view = 'calendar'; rmsMenuOpen = false; propertyMenuOpen = false; save(); render(); return;
  }
  if (event.target.closest('[data-calendar-mode]')) {
    state.calendarMode = event.target.closest('[data-calendar-mode]').dataset.calendarMode === 'week' ? 'week' : 'month';
    calendarSelectedDate = '';
    calendarDetailOpen = false; save(); render(); return;
  }
  const calendarPageNav = event.target.closest('[data-calendar-nav]');
  if (calendarPageNav) {
    const date = calendarDate(); const delta = Number(calendarPageNav.dataset.calendarNav);
    if (state.calendarMode === 'month') {
      const day = date.getDate(); date.setDate(1); date.setMonth(date.getMonth() + delta);
      date.setDate(Math.min(day, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()));
    } else date.setDate(date.getDate() + delta * 7);
    state.calendarDate = calendarISO(date); calendarSelectedDate = state.calendarDate; save(); render(); return;
  }
  if (event.target.closest('[data-calendar-today]')) { state.calendarDate = calendarISO(calendarToday()); calendarSelectedDate = state.calendarDate; save(); render(); return; }
  const calendarDayTarget = event.target.closest('[data-calendar-day]');
  if (calendarDayTarget) { openCalendar(calendarDayTarget.dataset.calendarDay, calendarDayTarget.dataset.calendarRoomId); return; }
  if (event.target.closest('[data-calendar-detail-close]') || event.target.matches('[data-calendar-drawer-backdrop]')) {
    calendarDetailOpen = false; calendarDirectEdit = false; calendarApplyConfirmOpen = false; calendarPanelToast = ''; clearTimeout(calendarPanelToastTimer); render(); return;
  }
  const detailNav = event.target.closest('[data-calendar-detail-nav]');
  if (detailNav) {
    const date = calendarDate(calendarSelectionDate()); date.setDate(date.getDate() + Number(detailNav.dataset.calendarDetailNav));
    calendarSelectedDate = calendarISO(date); save(); render(); return;
  }
  if (event.target.closest('[data-calendar-matrix]')) { calendarMatrixExpanded = !calendarMatrixExpanded; render(); return; }
  if (event.target.closest('[data-calendar-competitors]')) { calendarCompetitorsExpanded = !calendarCompetitorsExpanded; render(); return; }
  if (event.target.closest('[data-calendar-mapping-menu]')) { calendarMappingMenuOpen = !calendarMappingMenuOpen; render(); return; }
  if (event.target.closest('[data-calendar-edit-mapping]')) {
    state.view = 'pricing'; state.step = 5; state.step5Unlocked = true; calendarDetailOpen = false; calendarMappingMenuOpen = false; save(); render(); return;
  }
  if (event.target.closest('[data-calendar-direct]')) {
    const info = calendarPriceInfo(calendarDate(calendarSelectionDate()), state.rooms.find((item) => item.id === state.calendarRoomId) || state.rooms[0]);
    if (calendarDirectEdit) { calendarDirectEdit = false; calendarPriceDraft = ''; }
    else { calendarDirectEdit = true; calendarPriceDraft = String(info.currentPrice); }
    render(); return;
  }
  if (event.target.closest('[data-calendar-use-recommendation]')) {
    calendarDirectEdit = false; calendarPriceDraft = '';
    render(); return;
  }
  const calendarPriceChip = event.target.closest('[data-calendar-price-chip]');
  if (calendarPriceChip) { calendarPriceDraft = calendarPriceChip.dataset.calendarPriceChip; render(); return; }
  if (event.target.closest('[data-calendar-apply]')) {
    if (event.target.closest('[data-calendar-apply]').disabled) return;
    calendarApplyConfirmOpen = true; render(); return;
  }
  if (event.target.closest('[data-calendar-apply-cancel]') || event.target.matches('[data-calendar-confirm-backdrop]')) { calendarApplyConfirmOpen = false; render(); return; }
  if (event.target.closest('[data-calendar-apply-confirm]')) {
    const room = state.rooms.find((item) => item.id === state.calendarRoomId) || state.rooms[0];
    const date = calendarDate(calendarSelectionDate());
    const info = calendarPriceInfo(date, room);
    const price = calendarDirectEdit ? Math.max(0, Math.round(Number(String(calendarPriceDraft).replace(/[^\d]/g, '')) || 0)) : info.recommended;
    if (!price) return showToast('가격을 확인해 주세요.');
    if (calendarDirectEdit) state.calendarManualPrices[info.key] = price;
    else delete state.calendarManualPrices[info.key];
    state.calendarAppliedPrices[info.key] = price;
    calendarDirectEdit = false; calendarApplyConfirmOpen = false; calendarPriceDraft = '';
    save(); showCalendarPanelToast(`${date.getMonth() + 1}월 ${date.getDate()}일 ${room.name} ${calendarMoney(price)}원을 반영했어요. 판매 채널 10곳`); return;
  }
  const rmsMenuToggle = event.target.closest('[data-rms-menu-toggle]');
  if (rmsMenuToggle) {
    rmsMenuOpen = !rmsMenuOpen;
    render();
    return;
  }
  const rmsPage = event.target.closest('[data-rms-page]');
  if (rmsPage) {
    if (rmsPage.dataset.rmsPage === 'pricing') {
      state.view = 'pricing';
      rmsMenuOpen = false;
      save(); render(); return;
    }
    state.view = 'market';
    rmsMenuOpen = true;
    propertyMenuOpen = false;
    marketRoomMenuOpen = false;
    marketRadiusMenuOpen = false;
    save(); render(); return;
  }
  if (event.target.closest('[data-market-room-toggle]')) {
    marketRoomMenuOpen = !marketRoomMenuOpen;
    marketRoomSearchQuery = '';
    marketRadiusMenuOpen = false;
    render();
    if (marketRoomMenuOpen) document.querySelector('[data-market-room-search]')?.focus();
    return;
  }
  const marketRoomOption = event.target.closest('[data-market-room]');
  if (marketRoomOption) {
    state.marketRoomId = marketRoomOption.dataset.marketRoom;
    marketRoomMenuOpen = false;
    marketRoomSearchQuery = '';
    state.marketShowAll = false;
    save(); render(); return;
  }
  if (event.target.closest('[data-market-radius-toggle]')) {
    marketRadiusMenuOpen = !marketRadiusMenuOpen;
    marketRoomMenuOpen = false;
    marketRoomSearchQuery = '';
    render(); return;
  }
  const marketRadius = event.target.closest('[data-market-radius]');
  if (marketRadius) {
    state.marketRadiusMeters = Number(marketRadius.dataset.marketRadius);
    marketRadiusMenuOpen = false;
    animateMarketResults();
    save(); render(); return;
  }
  if (event.target.closest('[data-market-radius-slider]')) return;
  const marketCategory = event.target.closest('[data-market-category]');
  if (marketCategory) {
    state.marketCategory = marketCategory.dataset.marketCategory;
    state.marketShowAll = false;
    animateMarketResults();
    save(); render(); return;
  }
  const marketMapPin = event.target.closest('[data-market-map-pin]');
  const marketSearchResult = event.target.closest('[data-market-search-result]');
  if (marketMapPin || marketSearchResult) {
    const id = marketMapPin?.dataset.marketMapPin || marketSearchResult.dataset.marketSearchResult;
    const competitor = COMPETITORS.find((item) => item.id === id);
    if (!competitor || !marketCompetitorRoom(competitor)) return;
    const selected = new Set(state.marketComparedIds);
    if (selected.has(id)) selected.delete(id);
    else if (selected.size >= 5) return showToast('주변 숙소는 최대 5곳까지 고를 수 있어요.');
    else selected.add(id);
    state.marketComparedIds = [...selected];
    save(); render(); return;
  }
  if (event.target.closest('[data-market-search-clear]')) {
    marketSearchQuery = '';
    render();
    document.querySelector('[data-market-search]')?.focus();
    return;
  }
  if (event.target.closest('[data-market-show-all]')) {
    state.marketShowAll = !state.marketShowAll;
    render();
    const tableScroll = document.querySelector('.market-table-scroll');
    if (tableScroll) tableScroll.scrollTop = 0;
    return;
  }
  const marketZoom = event.target.closest('[data-market-zoom]');
  if (marketZoom) {
    state.marketZoom = Math.max(1, Math.min(3, Number(state.marketZoom) + Number(marketZoom.dataset.marketZoom)));
    save(); render(); return;
  }
  if (event.target.closest('[data-market-refresh]')) {
    marketSearchQuery = '';
    render(); showToast('주변 숙소 시세를 새로고침했어요.'); return;
  }
  if (event.target.closest('[data-market-save]')) {
    save(); showToast('주변 시세 설정을 저장했어요.'); return;
  }
  const propertyToggle = event.target.closest('[data-property-toggle]');
  if (propertyToggle) {
    propertyMenuOpen = !propertyMenuOpen;
    render();
    if (propertyMenuOpen) document.querySelector('[data-property-option]')?.focus();
    else document.querySelector('[data-property-toggle]')?.focus();
    return;
  }
  const propertyOption = event.target.closest('[data-property-option]');
  if (propertyOption) {
    const property = PROPERTIES.find((item) => item.id === propertyOption.dataset.propertyOption);
    if (!property) return;
    state.propertyId = property.id;
    propertyMenuOpen = false;
    save();
    render();
    showToast(property.type === 'demo'
      ? `${property.name} 데모 숙소를 선택했어요. 객실 샘플 데이터를 사용해요.`
      : `${property.name}이 선택되어 있어요.`);
    return;
  }
  if (event.target.closest('[data-mapping-reset]')) {
    const room = state.rooms.find((item) => item.id === state.selectedMappingRoomId);
    if (!room) return;
    resetMappingRoomToRecommendations(room.id);
    mappingOpenCell = null;
    mappingOpenSeasonCategory = '';
    save(); render(); showToast(`${room.name}의 상황별 가격을 추천값으로 되돌렸어요.`); return;
  }
  const mapCell = event.target.closest('[data-map-cell]');
  if (mapCell) {
    const [category, index] = mapCell.dataset.mapCell.split('|');
    const isSame = mappingOpenCell?.category === category && mappingOpenCell?.index === Number(index);
    mappingOpenCell = isSame ? null : { category, index: Number(index) };
    mappingOpenSeasonCategory = '';
    render();
    return;
  }
  const mapChoice = event.target.closest('[data-map-choice]');
  if (mapChoice) {
    const [category, rawIndex, key] = mapChoice.dataset.mapChoice.split('|');
    const room = state.rooms.find((item) => item.id === state.selectedMappingRoomId);
    if (room) ensureMappingRoom(room.id)[category][Number(rawIndex)] = key;
    mappingOpenCell = null;
    save(); render(); return;
  }
  const mappingSeasonButton = event.target.closest('[data-mapping-season-picker]');
  if (mappingSeasonButton) {
    const category = mappingSeasonButton.dataset.mappingSeasonPicker;
    mappingOpenSeasonCategory = mappingOpenSeasonCategory === category ? '' : category;
    mappingOpenCell = null;
    render(); return;
  }
  if (event.target.closest('[data-mapping-help-toggle]')) {
    mappingHelpOpen = !mappingHelpOpen;
    render(); return;
  }
  if (event.target.closest('[data-mapping-edit-ranges]')) {
    state.step = 3;
    mappingOpenCell = null;
    save(); render(); return;
  }
  if (event.target.closest('[data-mapping-finish]')) {
    if (setupCompletionError()) return showToast(setupCompletionError());
    state.mappingCompleted = true;
    state.view = 'calendar';
    state.calendarDate = calendarISO(calendarToday());
    state.calendarRoomId = state.rooms.some((room) => room.id === state.calendarRoomId) ? state.calendarRoomId : state.rooms[0]?.id || '';
    calendarDetailOpen = false;
    save(); render(); showToast('상황별 가격 설정을 저장했어요.'); return;
  }
  const seasonBar = event.target.closest('[data-season-bar]');
  const seasonPopupButton = event.target.closest('[data-season-popup]');
  if (seasonBar || seasonPopupButton) {
    const id = seasonBar?.dataset.seasonBar || seasonPopupButton.dataset.seasonPopup;
    const periodIndex = Number(seasonBar?.dataset.periodIndex ?? seasonPopupButton?.dataset.periodIndex ?? 0);
    let x = 50;
    if (seasonBar) {
      const trackRect = seasonBar.closest('.season-track').getBoundingClientRect();
      const barRect = seasonBar.getBoundingClientRect();
      x = Math.max(15, Math.min(85, (barRect.left + barRect.width / 2 - trackRect.left) / trackRect.width * 100));
    }
    seasonPopover = { seasonId: id, periodIndex, x };
    seasonPopoverEntering = true;
    render();
    return;
  }
  const editSeason = event.target.closest('[data-edit-season]');
  if (editSeason) { openSeasonEditor(editSeason.dataset.editSeason, Number(editSeason.dataset.periodIndex || 0)); return; }
  if (event.target.closest('[data-season-add]')) { openSeasonEditor('', 0, true); return; }
  if (event.target.closest('[data-season-guide]')) { showToast('시즌은 매년 같은 날짜에 반복 적용돼요. 막대를 눌러 기간과 유형을 바꿔 보세요.'); return; }
  const seasonType = event.target.closest('[data-season-type]');
  if (seasonType && seasonDraft) { seasonDraft.type = seasonType.dataset.seasonType; render(); return; }
  const calendarTargetButton = event.target.closest('[data-calendar-target]');
  if (calendarTargetButton && seasonDraft) {
    calendarTarget = calendarTargetButton.dataset.calendarTarget;
    calendarPendingStart = null;
    editingPeriodIndex = Number(calendarTargetButton.dataset.periodIndex || 0);
    const period = seasonDraft.periods[editingPeriodIndex];
    calendarView = { year: new Date().getFullYear(), month: calendarTarget === 'start' ? period.startMonth : period.endMonth };
    calendarOpen = true;
    seasonCalendarEntering = true;
    render();
    return;
  }
  const calendarNav = event.target.closest('[data-season-calendar-nav]');
  if (calendarNav) {
    const next = new Date(calendarView.year, calendarView.month - 1 + Number(calendarNav.dataset.seasonCalendarNav), 1);
    calendarView = { year: next.getFullYear(), month: next.getMonth() + 1 };
    render();
    return;
  }
  const calendarDay = event.target.closest('[data-season-calendar-day]');
  if (calendarDay && seasonDraft) {
    const [year, month, day] = calendarDay.dataset.seasonCalendarDay.split('-').map(Number);
    const period = seasonDraft.periods[editingPeriodIndex];
    if (calendarTarget === 'start') {
      calendarPendingStart = { month, day };
      period.startMonth = month;
      period.startDay = day;
      calendarTarget = 'end';
      calendarView = { year, month };
      render();
      return;
    }
    if (calendarPendingStart) {
      period.startMonth = calendarPendingStart.month;
      period.startDay = calendarPendingStart.day;
      period.endMonth = month; period.endDay = day;
      calendarPendingStart = null;
    } else {
      period.endMonth = month; period.endDay = day;
    }
    render();
    return;
  }
  if (event.target.matches('[data-calendar-backdrop]')) { calendarOpen = false; calendarPendingStart = null; render(); return; }
  if (event.target.matches('[data-drawer-backdrop]')) { closeSeasonEditor(); render(); return; }
  if (event.target.closest('[data-season-cancel]')) { closeSeasonEditor(); render(); return; }
  const saveSeasonButton = event.target.closest('[data-season-save]');
  if (saveSeasonButton && seasonDraft) {
    if ([...document.querySelectorAll('[data-season-date]')].some((input) => input.getAttribute('aria-invalid') === 'true')) return showToast('시작일과 종료일을 확인해 주세요.');
    if (hasDuplicateSeasonSchedule()) return showToast('같은 일정이 있습니다. 기간을 확인해 주세요.');
    seasonDraft.name = seasonDraft.name.trim();
    if (!seasonDraft.name) return showToast('시즌 이름을 입력해 주세요.');
    if (creatingSeason) state.seasons.push(seasonDraft);
    else {
      const index = state.seasons.findIndex((item) => item.id === editingSeasonId);
      if (index >= 0) {
        const original = state.seasons[index];
        state.seasons[index] = { ...original, name: seasonDraft.name, type: seasonDraft.type, periods: structuredClone(seasonDraft.periods) };
      }
    }
    closeSeasonEditor(); save(); render(); showToast('시즌을 저장했어요.'); return;
  }
  const deleteSeason = event.target.closest('[data-season-delete]');
  if (deleteSeason) {
    state.seasons = state.seasons.filter((season) => season.id !== deleteSeason.dataset.seasonDelete);
    closeSeasonEditor(); save(); render(); showToast('시즌을 삭제했어요.'); return;
  }
  const weekday = event.target.closest('[data-weekday]');
  if (weekday) {
    const day = Number(weekday.dataset.weekday);
    state.busyWeekdays = state.busyWeekdays.includes(day) ? state.busyWeekdays.filter((item) => item !== day) : [...state.busyWeekdays, day].sort();
    save(); render(); return;
  }
  if (event.target.closest('[data-mapping-next]')) {
    if (setupCompletionError()) return showToast(setupCompletionError());
    state.step4Unlocked = true;
    state.step5Unlocked = true;
    state.step = 5;
    const room = state.rooms.find((item) => item.id === state.selectedMappingRoomId) || state.rooms[0];
    if (room) { state.selectedMappingRoomId = room.id; ensureMappingRoom(room.id); }
    mappingOpenCell = null;
    mappingOpenSeasonCategory = '';
    save(); render(); return;
  }
  const go = event.target.closest('[data-go]');
  if (go) {
    const requested = Number(go.dataset.go);
    if (requested === 2 && roomValidationErrors().length) return showToast(roomValidationErrors()[0]);
    if (requested === 3 && state.step === 2 && !stageValidity()) return showToast(step2ValidationErrors()[0] || '가격 단계를 확인해 주세요.');
    if (requested === 2) state.step2Unlocked = true;
    if (requested === 3) state.step3Unlocked = true;
    state.step = requested; save(); render(); return;
  }
  if (event.target.closest('[data-finish]')) {
    if (!occupancyIsValid()) return showToast(occupancyValidationErrors()[0]);
    state.step3Unlocked = true;
    state.step4Unlocked = true;
    state.step = 4;
    save(); render(); return;
  }
  if (event.target.closest('[data-add-occupancy]')) {
    addOccupancyRange(); save(); render(); return;
  }
  const removeOccupancy = event.target.closest('[data-remove-occupancy]');
  if (removeOccupancy) {
    const index = Number(removeOccupancy.dataset.removeOccupancy);
    if (state.occupancyEnds.length <= 2) return;
    if (index === state.occupancyEnds.length - 1) state.occupancyEnds.splice(index - 1, 1);
    else state.occupancyEnds.splice(index, 1);
    save(); render(); return;
  }
  const del = event.target.closest('[data-delete-room]');
  if (del) {
    if (state.rooms.length <= 1) return;
    const removedId = del.dataset.deleteRoom;
    state.rooms = state.rooms.filter((room) => room.id !== removedId);
    state.removedRoomIds = [...new Set([...(state.removedRoomIds || []), removedId])];
    if (state.previewRoomId === removedId) {
      state.previewRoomId = state.rooms[0]?.id || '';
      syncPriceStageValues();
    }
    save(); render(); return;
  }
  if (event.target.closest('[data-reload]')) {
    state.rooms = cloneDefaults().rooms;
    state.removedRoomIds = [];
    state.previewRoomId = state.rooms[0].id;
    syncPriceStageValues();
    save(); render(); showToast('V-CMS 객실 정보를 다시 불러왔어요.'); return;
  }
  const counter = event.target.closest('[data-count-step]');
  if (counter && !counter.disabled) {
    const type = counter.dataset.countStep;
    const previousCount = state[type]?.length;
    updateCountStep(type, Number(counter.dataset.delta));
    if (state[type]?.length !== previousCount) highlightChangedPriceStage(type);
    save(); render(); return;
  }
  const removeStage = event.target.closest('[data-remove-stage]');
  if (removeStage) {
    const type = removeStage.dataset.removeStage;
    if (!['up', 'down'].includes(type) || !state[type].length) return;
    state[type] = Array(Math.max(0, state[type].length - 1)).fill(0);
    syncPriceStageValues(); save(); render(); return;
  }
  if (event.target.closest('[data-guide]')) { event.preventDefault(); showToast('이 프로토타입에서는 기본 정보와 가격 단계만 제공해요.'); }
});

app.addEventListener('change', (event) => {
  const calendarRoomSelect = event.target.closest('[data-calendar-room], [data-calendar-detail-room]');
  if (calendarRoomSelect) { state.calendarRoomId = calendarRoomSelect.value; save(); render(); return; }
  const directPriceInput = event.target.closest('[data-direct-price]');
  if (directPriceInput) {
    const value = String(directPriceInput.value).replace(/[^\d]/g, '');
    calendarPriceDraft = value ? integer(value) : '';
    render(); return;
  }
  const marketCompare = event.target.closest('[data-market-compare]');
  const marketUnmatched = event.target.closest('[data-market-show-unmatched]');
  const marketRadiusSlider = event.target.closest('[data-market-radius-slider]');
  if (marketCompare) {
    const selected = new Set(state.marketComparedIds);
    if (marketCompare.checked && selected.size >= 5 && !selected.has(marketCompare.dataset.marketCompare)) {
      marketCompare.checked = false;
      return showToast('주변 숙소는 최대 5곳까지 고를 수 있어요.');
    }
    if (marketCompare.checked && !marketCompetitorRoom(COMPETITORS.find((item) => item.id === marketCompare.dataset.marketCompare))) {
      marketCompare.checked = false;
      return showToast('이 객실은 비교할 수 있는 시세가 없어요.');
    }
    if (marketCompare.checked) selected.add(marketCompare.dataset.marketCompare);
    else selected.delete(marketCompare.dataset.marketCompare);
    state.marketComparedIds = [...selected];
    save(); render(); return;
  }
  if (marketUnmatched) {
    state.marketShowUnmatched = marketUnmatched.checked;
    save(); render(); return;
  }
  if (marketRadiusSlider) {
    state.marketRadiusMeters = Number(marketRadiusSlider.value);
    marketRadiusMenuOpen = false;
    animateMarketResults();
    save(); render(); return;
  }
  const mappingRoom = event.target.closest('[data-mapping-room]');
  const mappingSeasonToggle = event.target.closest('[data-mapping-season-toggle]');
  const seasonToggle = event.target.closest('[data-season-toggle]');
  const holidayEve = event.target.closest('[data-holiday-eve]');
  const seasonName = event.target.closest('[data-season-name]');
  const seasonDateInput = event.target.closest('[data-season-date]');
  if (seasonDateInput && seasonDraft) {
    const parsedDate = parseSeasonDateInput(seasonDateInput.value);
    const dateError = seasonDateInput.parentElement.querySelector('.season-date-error');
    seasonDateInput.setAttribute('aria-invalid', String(!parsedDate));
    if (dateError) dateError.hidden = Boolean(parsedDate);
    if (parsedDate) {
      const period = seasonDraft.periods[Number(seasonDateInput.dataset.periodIndex || 0)];
      const prefix = seasonDateInput.dataset.seasonDate;
      period[`${prefix}Month`] = parsedDate.month;
      period[`${prefix}Day`] = parsedDate.day;
      seasonDateInput.value = seasonDateInputLabel(parsedDate.month, parsedDate.day);
    }
    const duplicateSchedule = hasDuplicateSeasonSchedule();
    let duplicateWarning = document.querySelector('.season-duplicate-warning');
    if (duplicateSchedule && !duplicateWarning) {
      const infoBanner = document.querySelector('.season-info-banner');
      infoBanner?.insertAdjacentHTML('beforebegin', '<div class="season-duplicate-warning" role="alert"><span>!</span>같은 일정이 있습니다.</div>');
      duplicateWarning = document.querySelector('.season-duplicate-warning');
    } else if (!duplicateSchedule) duplicateWarning?.remove();
    const invalidDate = [...document.querySelectorAll('[data-season-date]')].some((input) => input.getAttribute('aria-invalid') === 'true');
    const saveButton = document.querySelector('[data-season-save]');
    if (saveButton) saveButton.disabled = invalidDate || !seasonDraft.name.trim() || duplicateSchedule;
    return;
  }
  if (mappingRoom) {
    state.selectedMappingRoomId = mappingRoom.value;
    ensureMappingRoom(mappingRoom.value);
    mappingOpenCell = null;
    mappingOpenSeasonCategory = '';
    save(); render(); return;
  }
  if (mappingSeasonToggle) {
    const [category, id] = mappingSeasonToggle.dataset.mappingSeasonToggle.split('|');
    const selected = new Set(Array.isArray(state.mappingSeasonSelection[category])
      ? state.mappingSeasonSelection[category]
      : activeMappingSeasons(category).map((season) => season.id));
    if (mappingSeasonToggle.checked) selected.add(id); else selected.delete(id);
    state.mappingSeasonSelection[category] = [...selected];
    save(); render(); return;
  }
  if (seasonToggle) {
    const season = state.seasons.find((item) => item.id === seasonToggle.dataset.seasonToggle);
    if (season) season.active = seasonToggle.checked;
    save(); render(); return;
  }
  if (holidayEve) { state.holidayEveWeekend = holidayEve.checked; save(); render(); return; }
  if (seasonName && seasonDraft) { seasonDraft.name = seasonName.value; return; }
  const countInput = event.target.closest('[data-room-count]');
  const priceInput = event.target.closest('[data-base-price]');
  const limitInput = event.target.closest('[data-limit]');
  const stagePercentInput = event.target.closest('[data-stage-pct]');
  const preview = event.target.closest('[data-preview-room]');
  const occupancyEnd = event.target.closest('[data-occupancy-end]');
  if (countInput || priceInput) {
    const id = (countInput || priceInput).dataset.roomCount || (countInput || priceInput).dataset.basePrice;
    const room = state.rooms.find((item) => item.id === id);
    if (!room) return;
    if (countInput) room.count = Math.max(0, Math.round(Number(countInput.value) || 0));
    if (priceInput) room.basePrice = Math.max(0, Math.round(Number(priceInput.value.replace(/[^\d]/g, '')) || 0));
    if (countInput) countInput.value = room.count;
    if (priceInput) priceInput.value = integer(room.basePrice);
    if (priceInput && room.id === state.previewRoomId) syncPriceStageValues();
  } else if (stagePercentInput) {
    const type = stagePercentInput.dataset.stagePct;
    const index = Number(stagePercentInput.dataset.index);
    const nextPercent = stagePercentInput.valueAsNumber;
    const currentModel = priceStageModel();
    if (!['up', 'down'].includes(type) || !Number.isInteger(index) || index < 0 || index >= state[type].length || !Number.isFinite(nextPercent)) {
      render(); return;
    }
    const amount = calculateManualStagePrice(currentModel.base, nextPercent, type, currentModel.minPrice, currentModel.maxPrice);
    if (!Number.isFinite(amount)) { render(); return; }
    const overrides = {
      upPrices: Array(state.up.length).fill(null).map((_, position) => state.stagePriceOverrides.upPrices[position] ?? currentModel.upPrices[position]),
      downPrices: Array(state.down.length).fill(null).map((_, position) => state.stagePriceOverrides.downPrices[position] ?? currentModel.downPrices[position]),
    };
    overrides[`${type}Prices`][index] = amount;
    const model = calculatePriceStageModel(currentModel.base, state.minLimit, state.maxLimit, state.up.length, state.down.length, overrides);
    if (!model.valid) {
      render(); showToast('단계 금액을 현재 한도 안에서 확인해 주세요.'); return;
    }
    state.stagePriceOverrides = overrides;
    state.up = model.up;
    state.down = model.down;
  } else if (limitInput) {
    const key = limitInput.dataset.limit === 'min' ? 'minLimit' : 'maxLimit';
    const value = Number(limitInput.value);
    if (!limitInput.value.trim() || !Number.isFinite(value)) { limitInput.value = state[key]; return; }
    // The minimum limit is always negative; let users enter its magnitude without typing "-".
    const nextValue = key === 'minLimit' ? -Math.abs(Math.round(value)) : Math.round(value);
    const nextMin = key === 'minLimit' ? nextValue : Number(state.minLimit);
    const nextMax = key === 'maxLimit' ? nextValue : Number(state.maxLimit);
    if (nextMin < MIN_PRICE_LIMIT || nextMin >= 0 || nextMax <= 0 || nextMax > MAX_PRICE_LIMIT || nextMin >= nextMax) {
      render();
      showToast('최저 한도는 최고 한도보다 낮아야 해요. 범위 안에서 다시 설정해 주세요.');
      return;
    }
    state.minLimit = nextMin;
    state.maxLimit = nextMax;
    syncPriceStageValues();
  } else if (preview) {
    state.previewRoomId = preview.value;
    syncPriceStageValues();
  } else if (occupancyEnd) {
    const index = Number(occupancyEnd.dataset.occupancyEnd);
    const inputValue = Number(occupancyEnd.value);
    const previous = index === 0 ? 0 : Number(state.occupancyEnds[index - 1]);
    const next = Number(state.occupancyEnds[index + 1] ?? 100);
    const min = previous + 1;
    const max = next - 1;
    if (!Number.isFinite(inputValue) || min > max) { render(); return; }
    state.occupancyEnds[index] = Math.max(min, Math.min(max, Math.round(inputValue)));
  } else return;
  save(); render();
});

app.addEventListener('input', (event) => {
  const directPriceInput = event.target.closest('[data-direct-price]');
  if (directPriceInput) { calendarPriceDraft = directPriceInput.value.replace(/[^\d]/g, ''); return; }
  const marketRoomSearch = event.target.closest('[data-market-room-search]');
  if (marketRoomSearch) {
    marketRoomSearchQuery = marketRoomSearch.value;
    const options = document.querySelector('[data-market-room-options]');
    if (options) options.innerHTML = marketRoomOptions();
    return;
  }
  const marketSearch = event.target.closest('[data-market-search]');
  if (marketSearch) {
    marketSearchQuery = marketSearch.value;
    const host = document.querySelector('[data-market-search-host]');
    if (host) host.innerHTML = marketSearchResults();
    const clearButton = marketSearch.closest('.market-search').querySelector('[data-market-search-clear]');
    if (marketSearchQuery && !clearButton) {
      const button = document.createElement('button');
      button.dataset.marketSearchClear = '';
      button.setAttribute('aria-label', '검색어 지우기');
      button.textContent = '×';
      marketSearch.closest('.market-search').append(button);
    } else if (!marketSearchQuery && clearButton) clearButton.remove();
    return;
  }
  const marketRadiusSlider = event.target.closest('[data-market-radius-slider]');
  if (marketRadiusSlider) {
    state.marketRadiusMeters = Number(marketRadiusSlider.value);
    syncMarketRadiusPreview();
    return;
  }
  const seasonName = event.target.closest('[data-season-name]');
  if (!seasonName || !seasonDraft) return;
  seasonDraft.name = seasonName.value;
  const missing = !seasonDraft.name.trim();
  seasonName.setAttribute('aria-invalid', String(missing));
  document.querySelector('[data-season-name-error]')?.toggleAttribute('hidden', !missing);
  const saveButton = document.querySelector('[data-season-save]');
  const invalidDate = [...document.querySelectorAll('[data-season-date]')].some((input) => input.getAttribute('aria-invalid') === 'true');
  if (saveButton) saveButton.disabled = missing || invalidDate || hasDuplicateSeasonSchedule();
});

app.addEventListener('dragstart', (event) => {
  const row = event.target.closest('[data-stage-row]');
  if (!row || row.draggable === false) return;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', JSON.stringify({ type: row.dataset.stageRow, index: Number(row.dataset.stageIndex) }));
  row.classList.add('dragging');
});
app.addEventListener('dragend', (event) => event.target.closest('[data-stage-row]')?.classList.remove('dragging'));
app.addEventListener('dragover', (event) => { if (event.target.closest('[data-stage-row]')) event.preventDefault(); });
app.addEventListener('drop', (event) => {
  const target = event.target.closest('[data-stage-row]');
  if (!target) return;
  event.preventDefault();
  try {
    const from = JSON.parse(event.dataTransfer.getData('text/plain'));
    const type = target.dataset.stageRow;
    const toIndex = Number(target.dataset.stageIndex);
    if (!['up', 'down'].includes(type)) return;
    const list = state[type];
    const sourceIsLimit = type === 'up' ? from.index === 0 : from.index === list.length - 1;
    const targetIsLimit = type === 'up' ? toIndex === 0 : toIndex === list.length - 1;
    if (from.type !== type || from.index === toIndex || sourceIsLimit || targetIsLimit
      || from.index < 0 || from.index >= list.length || toIndex < 0 || toIndex >= list.length) return;
    const currentModel = priceStageModel();
    const candidate = {
      upPrices: [...currentModel.upPrices],
      downPrices: [...currentModel.downPrices],
    };
    const next = candidate[`${type}Prices`];
    next.splice(toIndex, 0, next.splice(from.index, 1)[0]);
    const model = calculatePriceStageModel(currentModel.base, state.minLimit, state.maxLimit, state.up.length, state.down.length, candidate);
    if (!model.valid) return;
    state.stagePriceOverrides = candidate;
    state.up = model.up;
    state.down = model.down;
    save(); render();
  } catch { /* ignore unsupported drops */ }
});

render();
if (roomCatalogMigrationNeeded) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* local storage may be disabled */ }
}

document.addEventListener('click', (event) => {
  let marketOverlayChanged = false;
  if (marketRoomMenuOpen && !event.target.closest('.market-room-picker')) {
    marketRoomMenuOpen = false;
    marketRoomSearchQuery = '';
    marketOverlayChanged = true;
  }
  if (marketRadiusMenuOpen && !event.target.closest('.market-radius-picker')) {
    marketRadiusMenuOpen = false;
    marketOverlayChanged = true;
  }
  if (marketSearchQuery && !event.target.closest('.market-controls')) {
    marketSearchQuery = '';
    marketOverlayChanged = true;
  }
  if (propertyMenuOpen && !event.target.closest('.property-switcher')) {
    propertyMenuOpen = false;
    render();
  }
  if (seasonPopover && !event.target.closest('.season-popover') && !event.target.closest('[data-season-bar], [data-season-popup]')) {
    seasonPopover = null;
    render();
  }
  let mappingChanged = false;
  if (mappingOpenCell && !event.target.closest('.mapping-cell-wrap')) {
    mappingOpenCell = null;
    mappingChanged = true;
  }
  if (mappingOpenSeasonCategory && !event.target.closest('.mapping-season-picker')) {
    mappingOpenSeasonCategory = '';
    mappingChanged = true;
  }
  if (mappingChanged || marketOverlayChanged) render();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && calendarApplyConfirmOpen) { calendarApplyConfirmOpen = false; render(); return; }
  if (event.key === 'Escape' && calendarDetailOpen) { calendarDetailOpen = false; calendarDirectEdit = false; calendarPanelToast = ''; clearTimeout(calendarPanelToastTimer); render(); return; }
  if (event.key === 'Escape' && resetConfirmOpen) {
    resetConfirmOpen = false;
    render();
    document.querySelector('[data-reset-demo]')?.focus();
    return;
  }
  if (event.key === 'Escape' && (marketRoomMenuOpen || marketRadiusMenuOpen || marketSearchQuery)) {
    marketRoomMenuOpen = false;
    marketRoomSearchQuery = '';
    marketRadiusMenuOpen = false;
    marketSearchQuery = '';
    render();
    return;
  }
  if (event.key === 'Escape' && (mappingOpenCell || mappingOpenSeasonCategory)) {
    mappingOpenCell = null;
    mappingOpenSeasonCategory = '';
    render(); return;
  }
  if (event.key === 'Escape' && calendarOpen) { calendarOpen = false; calendarPendingStart = null; render(); return; }
  if (event.key === 'Escape' && seasonDrawerOpen) { closeSeasonEditor(); render(); return; }
  if (event.key === 'Escape' && seasonPopover) { seasonPopover = null; render(); return; }
  if (event.key === 'Escape' && propertyMenuOpen) {
    propertyMenuOpen = false;
    render();
    document.querySelector('[data-property-toggle]')?.focus();
  }
});
