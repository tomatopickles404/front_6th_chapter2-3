import { path } from "shared/utils/path"

export const TAG_API_PATH = {
  tags: path("posts", "tags"),
  tag: (tag: string) => path("posts", "tag", tag),
} as const
