import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "/shared/lib/http"
import { Tag } from "entities/tag"
import { TAG_API_PATH } from "entities/tag"
import { TAG_QUERY_KEY } from "../models/queries"

export const fetchTags = async () => {
  return api.get<Tag[]>(TAG_API_PATH.tags)
}

export function useTagsQuery() {
  return useSuspenseQuery({
    queryKey: TAG_QUERY_KEY.tags(),
    queryFn: fetchTags,
  })
}
