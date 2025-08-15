import axios from "axios"

const API_BASE_URL = "https://dummyjson.com/"

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 필요시 토큰 추가 (현재 프로젝트에는 인증이 없으므로 주석)
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => Promise.reject(error),
)

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error)

    return Promise.reject(error)
  },
)

export default axiosInstance
