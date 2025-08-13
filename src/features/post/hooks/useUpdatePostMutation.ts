import { useMutation } from "@tanstack/react-query"
import { Post } from "entities/post"
import { api } from "shared/lib"
import { POST_API_PATH } from "entities/post"

type UpdatePostMutation = {
  id: number
  post: { title: string; body: string }
}

const updatePost = async (id: number, post: { title: string; body: string }): Promise<Post> => {
  return api.put(POST_API_PATH.id(id), post)
}

export function useUpdatePostMutation() {
  return useMutation({
    mutationFn: ({ id, post }: UpdatePostMutation) => updatePost(id, post),
  })
}
