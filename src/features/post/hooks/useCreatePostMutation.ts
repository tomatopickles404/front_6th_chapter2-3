import { useMutation } from "@tanstack/react-query"
import { api } from "shared/lib"
import { POST_API_PATH } from "entities/post"

export const createPost = async (post: { title: string; body: string; userId: number }) => {
  return api.post(POST_API_PATH.posts, post)
}

export function useCreatePostMutation() {
  return useMutation({
    mutationFn: createPost,
  })
}
