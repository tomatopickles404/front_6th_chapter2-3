import { api } from "shared/lib"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"

const updatePostReaction = async ({ postId, reaction }: { postId: number; reaction: "like" | "dislike" | null }) => {
  const apiPath = `/posts/${postId}`
  return api.patch(apiPath, { reaction })
}

export function useUpdatePostReactionMutation(
  options?: UseMutationOptions<unknown, Error, { postId: number; reaction: "like" | "dislike" | null }>,
) {
  return useMutation({
    mutationFn: ({ postId, reaction }: { postId: number; reaction: "like" | "dislike" | null }) =>
      updatePostReaction({ postId, reaction }),
    ...options,
  })
}
