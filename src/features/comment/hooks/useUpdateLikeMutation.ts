import { api } from "shared/lib"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"

const likeComment = async ({ id, likes }: { id: number; likes: number }): Promise<Comment> => {
  const apiPath = `/comments/${id}`
  return api.patch(apiPath, { likes })
}

export function useUpdateLikeMutation(options?: UseMutationOptions<Comment, Error, { id: number; likes: number }>) {
  return useMutation({
    mutationFn: ({ id, likes }: { id: number; likes: number }) => likeComment({ id, likes }),
    ...options,
  })
}
