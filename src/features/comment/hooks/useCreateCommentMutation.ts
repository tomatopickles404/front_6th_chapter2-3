import { useMutation } from "@tanstack/react-query"
import { api } from "shared/lib"

const createComment = async (comment: { body: string; postId: number; userId: number }) => {
  return api.post("/comments/add", { [comment.postId]: [comment] })
}

export function useCreateCommentMutation() {
  return useMutation({
    mutationFn: createComment,
  })
}
