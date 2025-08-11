import { path } from "shared/utils/path"

export const POST_API_PATH = {
  posts: path(""),
  tag: path("tag"),
  search: path("search"),
  id: (id: number) => path(id.toString()),
}
