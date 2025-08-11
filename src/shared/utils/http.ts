import axiosInstance from "./axios"
import type { AxiosRequestConfig } from "axios"
import { PostsParams } from "features/post"

// 에러 타입 정의
export interface ApiError {
  message: string
  status?: number
  code?: string
}

// 에러 핸들링 헬퍼
const handleApiError = (error: any): ApiError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: "REQUEST_ERROR",
    }
  }

  if (error.response) {
    return {
      message: error.response.data?.message || "서버 오류가 발생했습니다",
      status: error.response.status,
      code: error.response.data?.code,
    }
  } else if (error.request) {
    // 요청은 보냈지만 응답이 없는 경우
    return {
      message: "서버에 연결할 수 없습니다",
      code: "NETWORK_ERROR",
    }
  } else {
    // 요청 자체에 문제가 있는 경우
    return {
      message: error.message || "알 수 없는 오류가 발생했습니다",
      code: "REQUEST_ERROR",
    }
  }
}

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.get<T>(url, config)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.post<T>(url, data, config)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.put<T>(url, data, config)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.patch<T>(url, data, config)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.delete<T>(url, config)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },
}

// 타입 안전성을 위한 헬퍼 함수들
export const httpClient = {
  ...api,

  // 쿼리 파라미터 빌더
  buildQuery: (params: Partial<PostsParams>): string => {
    const urlParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        urlParams.set(key, String(value))
      }
    })
    return urlParams.toString()
  },
}
