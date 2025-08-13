import { api } from "shared/lib"
import { COMMENT_API_PATH } from "entities/comment"
import { useMutation } from "@tanstack/react-query"

const likeComment = async ({ id, postId }: { id: number; postId: number }) => {
  return api.patch(COMMENT_API_PATH.id(id), { postId })
}

export function useUpdateLikeMutation() {
  return useMutation({
    mutationFn: likeComment,
  })
}
