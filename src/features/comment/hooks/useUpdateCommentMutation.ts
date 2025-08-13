import { useMutation } from "@tanstack/react-query"
import { api } from "shared/lib"
import { COMMENT_API_PATH } from "entities/comment"

const updateComment = async (id: number, body: string) => {
  return api.put(COMMENT_API_PATH.id(id), { body })
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
