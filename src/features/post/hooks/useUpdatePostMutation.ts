import { api } from "shared/lib"
import { POST_API_PATH } from "entities/post"
import { useMutation } from "@tanstack/react-query"

const updatePost = async (id: number, post: { title: string; body: string }) => {
  return api.put(POST_API_PATH.id(id), post)
}

type UpdatePostMutation = {
  id: number
  post: { title: string; body: string }
}

export function useUpdatePostMutation() {
  return useMutation({
    mutationFn: ({ id, post }: UpdatePostMutation) => updatePost(id, post),
  })
}
