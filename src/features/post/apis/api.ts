import { api, httpClient } from "shared/utils/http"
import { PostsParams } from "../models"
import { API_PATH } from "entities/post"

const getEndpoint = (search: string | undefined, tag: string | undefined) => {
  if (search) return API_PATH.POSTS_SEARCH
  if (tag && tag !== "all") return API_PATH.POSTS_TAG
  return API_PATH.POSTS
}

const getQueryParams = (search: string | undefined, restParams: Partial<PostsParams>) => {
  if (search) return { ...restParams, q: search }
  return restParams
}

export const fetchPosts = async (params: Partial<PostsParams> = {}) => {
  const { search, tag, ...restParams } = params

  // 쿼리 파라미터 구성

  const endpoint = getEndpoint(search, tag)
  const queryParams = getQueryParams(search, restParams)
  const query = httpClient.buildQuery(queryParams)

  return api.get(`${endpoint}?${query}`)
}

// 게시물 CRUD
export const createPost = async (post: { title: string; body: string; userId: number }) => {
  return api.post(API_PATH.POSTS, post)
}

export const updatePost = async (id: number, post: { title: string; body: string }) => {
  return api.put(API_PATH.POSTS_ID(id), post)
}

export const deletePost = async (id: number) => {
  return api.delete(API_PATH.POSTS_ID(id))
}
