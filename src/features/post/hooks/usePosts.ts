import { useSuspenseQuery } from "@tanstack/react-query"
import { POST_QUERY_KEY } from "../models/queries"
import { PostsParams } from "../models"
import { fetchPosts } from "../apis/api"

export function usePosts(params: PostsParams) {
  return useSuspenseQuery({
    queryKey: POST_QUERY_KEY.posts(params),
    queryFn: () => fetchPosts(params),
    staleTime: 5 * 60 * 1000, // 5분
  })
}
