import { api } from "shared/lib"
import { POST_API_PATH } from "entities/post"
import { useMutation } from "@tanstack/react-query"

export const createPost = async (post: { title: string; body: string; userId: number }) => {
  return api.post(POST_API_PATH.posts, post)
}

export function usePostMutation() {
  return useMutation({
    mutationFn: createPost,
  })
}
