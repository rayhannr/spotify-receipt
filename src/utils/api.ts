import { ENDPOINTS } from '../constants/url'
import { User } from '../models'
import { apiClient } from './axios'

export const getCurrentUser = async () => {
  const result = await apiClient.get<User>(ENDPOINTS.user.getCurrentUser())
  return result.data
}
