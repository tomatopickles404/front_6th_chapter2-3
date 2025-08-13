import { useQuery } from "@tanstack/react-query"
import { COMMENT_QUERY_KEY } from "../models/queries"
import { api } from "shared/lib"
import { COMMENT_API_PATH } from "entities/comment"

const fetchComments = async (postId: number) => {
  return api.get(COMMENT_API_PATH.comments, { params: { postId } })
}

export function useCommentsQuery(postId: number) {
  return useQuery({
    queryKey: COMMENT_QUERY_KEY.list(postId),
    queryFn: () => fetchComments(postId),
  })
}
