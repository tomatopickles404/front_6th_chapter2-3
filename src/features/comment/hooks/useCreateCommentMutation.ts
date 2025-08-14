import { useMutation } from "@tanstack/react-query"
import { api } from "shared/lib"
import { COMMENT_API_PATH } from "entities/comment"

const createComment = async (comment: { body: string; postId: number; userId: number }) => {
  return api.post(COMMENT_API_PATH.comments, comment)
}

export function useCreateCommentMutation() {
  return useMutation({
    mutationFn: createComment,
  })
}
