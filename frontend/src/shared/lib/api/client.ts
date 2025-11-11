import axios from 'axios'
import { env } from '@/shared/config/env'
import { useAuthStore } from '@/shared/store/auth.store'
import { useRoleStore } from '@/shared/store/role.store'

export const apiClient = axios.create({
  baseURL: env.API_URL,
  timeout: 30000,
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  const activeRole = useRoleStore.getState().activeRole
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  if (activeRole) {
    config.headers = config.headers ?? {}
    ;(config.headers as Record<string, string>)['X-Active-Role'] = activeRole
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle global errors
    return Promise.reject(error)
  }
)


