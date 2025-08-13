import { path } from "shared/utils/path"

export const POST_API_PATH = {
  posts: path("posts"),
  tag: path("posts", "tag"),
  search: path("posts", "search"),
  id: (id: number) => path("posts", id.toString()),
}
