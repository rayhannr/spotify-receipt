export const AUTH_BASE_URL = 'https://accounts.spotify.com'
export const API_BASE_URL = 'https://api.spotify.com'

export const ENDPOINTS = {
  auth: {
    getToken: () => '/api/token',
    authorize: () => '/authorize',
  },
  user: {
    getCurrentUser: () => '/v1/me',
  },
}
