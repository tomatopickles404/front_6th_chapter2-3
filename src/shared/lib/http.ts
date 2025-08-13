import axiosInstance from "./axios"
import type { AxiosRequestConfig, AxiosResponse } from "axios"

// 에러 타입 정의
export interface ApiError {
  message: string
  status?: number
  code?: string
}

type QueryParams = Record<string, string | number | boolean | undefined | null>

const validateResponse = <T>(response: AxiosResponse<T>): T => {
  if (!response) {
    throw new Error("No response received")
  }

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  if (!response.data) {
    throw new Error("Response data is empty")
  }

  return response.data
}

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.get<T>(url, config)
    return validateResponse(response)
  },

  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.post<T>(url, data, config)
    return validateResponse(response)
  },

  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.put<T>(url, data, config)
    return validateResponse(response)
  },

  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.patch<T>(url, data, config)
    return validateResponse(response)
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.delete<T>(url, config)
    return validateResponse(response)
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
