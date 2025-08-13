import { useMutation } from "@tanstack/react-query"
import { api } from "shared/lib"
import { POST_API_PATH } from "entities/post"

const deletePost = async (id: number) => {
  return api.delete(POST_API_PATH.id(id))
}

export function useDeletePostMutation() {
  return useMutation({
    mutationFn: deletePost,
  })
}
