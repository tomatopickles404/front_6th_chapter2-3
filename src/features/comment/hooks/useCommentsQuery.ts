import { useQuery } from "@tanstack/react-query"
import { api } from "shared/lib"
import { type Comment } from "entities/comment"
import { COMMENT_API_PATH } from "entities/comment"
import { COMMENT_QUERY_KEY } from "../models"

const fetchComments = async (postId: number) => {
  return await api.get<Comment[]>(COMMENT_API_PATH.comments, { params: { postId } })
}

export function useCommentsQuery(postId: number) {
  return useQuery({
    queryKey: COMMENT_QUERY_KEY.byPost(postId),
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
  })
}
