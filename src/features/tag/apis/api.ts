import { api } from "shared/utils/http"
import { Tag } from "entities/tag"
import { Post } from "entities/post"

export const fetchPostsByTag = async (tag: string) => {
  return api.get<Post[]>(`/posts/tag/${tag}`)
}

export const fetchTags = async () => {
  return api.get<Tag[]>("/posts/tags")
}
