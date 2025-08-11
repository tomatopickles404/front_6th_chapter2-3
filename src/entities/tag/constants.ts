import { path } from "shared/utils/path"

export const TAG_API_PATH = {
  tags: path("posts", "tags"),
  tag: path("posts", "tags"),
} as const
