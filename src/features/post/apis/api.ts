import { api, httpClient } from "shared/lib"
import { PostsParams, PostResponse } from "../models"
import { POST_API_PATH } from "entities/post"

const getEndpoint = (search: string | undefined, tag: string | undefined) => {
  if (search) return POST_API_PATH.search
  if (tag && tag !== "all") return POST_API_PATH.tag
  return POST_API_PATH.posts
}

const getQueryParams = (search: string | undefined, restParams: Partial<PostsParams>) => {
  if (search) return { ...restParams, q: search }
  return restParams
}

export const fetchPosts = async (params: Partial<PostsParams> = {}): Promise<PostResponse> => {
  const { search, tag, ...restParams } = params

  // 쿼리 파라미터 구성

  const endpoint = getEndpoint(search, tag)
  const queryParams = getQueryParams(search, restParams)
  const query = httpClient.buildQuery(queryParams)

  return api.get(`${endpoint}?${query}`)
}
