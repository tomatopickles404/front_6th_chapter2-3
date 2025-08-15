import { useMutation } from "@tanstack/react-query"
import { api } from "shared/lib"

export const createPost = async (post: { title: string; body: string; userId: number }) => {
  return api.post("/posts/add", post)
}

export function useCreatePostMutation() {
  return useMutation({
    mutationFn: createPost,
  })
}
