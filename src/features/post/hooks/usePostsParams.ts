import { useQueryParams } from "shared/hooks"

const defaultParams = {
  skip: 0,
  limit: 10,
  search: "",
  sortBy: "",
  sortOrder: "asc",
  tag: "",
} as const

export function usePostsParams() {
  return useQueryParams(defaultParams)
}
