import { useMutation } from "@tanstack/react-query"
import { api } from "shared/lib"

const updateComment = async (id: number, body: string) => {
  return api.put(`/comments/${id}`, { body })
}

type UpdateCommentMutation = {
  id: number
  body: string
}

export function useUpdateCommentMutation() {
  return useMutation({
    mutationFn: ({ id, body }: UpdateCommentMutation) => updateComment(id, body),
  })
}
