import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { Env } from '@/constants/env'

export const sdk = SpotifyApi.withUserAuthorization(Env.clientId, Env.redirectUri, ['user-read-private', 'user-read-email'])

export const getCurrentUser = async () => {
  const result = await sdk.currentUser.profile()
  return result
}
