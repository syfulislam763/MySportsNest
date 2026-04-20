
export const BASE_URL = 'https://deliver-consist-march-plymouth.trycloudflare.com';

export const SOCKET_BASE_URL = 'wss://deliver-consist-march-plymouth.trycloudflare.com/'

export const REGISTER = '/api/auth/register/'
export const VERIFY_EMAIL = '/api/auth/verify-email/'
export const LOGIN = '/api/auth/login/'
export const LOGOUT = '/api/auth/logout/'
export const DELETE_ACCOUNT = '/api/auth/account/parmanent/delete/'


export const RESET_PASS_REQ = '/api/auth/password/reset-request/'
export const RESET_PASS_VERIFY = '/api/auth/password/reset-verify-otp/'
export const RESET_PASS_CONFIRM = '/api/auth/password/reset-confirm/'

export const CHANGE_PASS = '/api/auth/password/change/'

export const RESEND_OTP = '/api/auth/resend-otp/'
export const REFRESH_TOKEN = '/api/auth/token/refresh/'


//ONBOARDING

export const TRENDING = '/api/entities/trending/';
export const GET_NEST_API = "/api/nest/";
export const ADD_NEST_API = "/api/nest/add/";
export const REMOVE_NEST_API = "/api/nest/remove/";
export const PREFERENCE  = "/api/nest/preferences/"

// HOME Page
export const HOME_FEED_API = "/api/feed/nest/";
export const ENTITY_FEED_API = "/api/feed/entity/"