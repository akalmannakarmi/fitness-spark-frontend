import axios from 'axios'
import { BASE_URL } from '@/lib/routes'
import Router from 'next/router'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || BASE_URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
})

// Attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
