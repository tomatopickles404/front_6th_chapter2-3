import { useQuery } from "@tanstack/react-query"
import { POST_QUERY_KEY } from "../models/queries"
import { PostsParams } from "../models/types"
import { fetchPosts } from "../apis/api"

export function useSearchPosts(search: string, params: Omit<PostsParams, "search">) {
  return useQuery({
    queryKey: POST_QUERY_KEY.search(search, params),
    queryFn: () => fetchPosts({ ...params, search }),
    staleTime: 0,
  })
}
