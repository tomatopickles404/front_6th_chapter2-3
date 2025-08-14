import { useMutation } from "@tanstack/react-query"
import { api } from "shared/lib"

const deleteComment = async (id: number) => {
  return api.delete(`/comments/${id}`)
}

export function useDeleteCommentMutation() {
  return useMutation({
    mutationFn: deleteComment,
  })
}
