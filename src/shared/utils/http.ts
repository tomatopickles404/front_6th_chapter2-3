import axiosInstance from "./axios"
import type { AxiosRequestConfig } from "axios"

// 에러 타입 정의
export interface ApiError {
  message: string
  status?: number
  code?: string
}

type QueryParams = Record<string, string | number | boolean | undefined | null>

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.get<T>(url, config)
    return response.data
  },

  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.post<T>(url, data, config)
    return response.data
  },

  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.put<T>(url, data, config)
    return response.data
  },

  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.patch<T>(url, data, config)
    return response.data
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.delete<T>(url, config)
    return response.data
  },
}

// 타입 안전성을 위한 헬퍼 함수들
export const httpClient = {
  ...api,

  // 쿼리 파라미터 빌더
  buildQuery: (params: QueryParams): string => {
    const urlParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        urlParams.set(key, String(value))
      }
    })
    return urlParams.toString()
  },
}
