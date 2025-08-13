import { useMutation } from "@tanstack/react-query"
import { api } from "shared/lib"
import { COMMENT_API_PATH } from "entities/comment"

const deleteComment = async (id: number) => {
  return api.delete(COMMENT_API_PATH.id(id))
}

export function useDeleteCommentMutation() {
  return useMutation({
    mutationFn: deleteComment,
  })
}
