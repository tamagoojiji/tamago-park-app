// API エンドポイント集約
// Phase 1: GAS → Phase 2: Python(FastAPI)に切替時、ここのURLだけ変更
export { apiConfig, apiFetch } from './config';

// 各機能のAPIは機能解放時に追加
// export { calendarApi } from './calendar';
// export { authApi } from './auth';
// export { planningApi } from './planning';
