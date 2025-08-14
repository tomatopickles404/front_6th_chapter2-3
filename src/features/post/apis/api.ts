import { api, httpClient } from "shared/lib"
import { PostsParams, PostResponse } from "../models"
import { POST_API_PATH } from "entities/post"

export const fetchPosts = async (params: Partial<PostsParams> = {}): Promise<PostResponse> => {
  const { search, tag, ...restParams } = params

  let endpoint = POST_API_PATH.posts
  let queryParams = { ...restParams }

  if (search) {
    endpoint = POST_API_PATH.search
    queryParams = { ...restParams, q: search }
  } else if (tag && tag !== "all") {
    // 태그별 조회 시 쿼리 파라미터에 태그 포함
    queryParams = { ...restParams, tag }
  }

  const query = httpClient.buildQuery(queryParams)
  return api.get(`${endpoint}?${query}`)
}
