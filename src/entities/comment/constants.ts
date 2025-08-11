import { path } from "shared/utils/path"

export const COMMENT_API_PATH = {
  comments: path("comments"),
  id: (id: number) => path(id.toString()),
  like: (id: number) => path(id.toString(), "like"),
} as const
