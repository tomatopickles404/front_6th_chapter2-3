import { useQuery } from "@tanstack/react-query"
import { TAG_QUERY_KEY } from "../models/queries"
import { api } from "shared/lib/http"
import { Tag } from "entities/tag"
import { TAG_API_PATH } from "entities/tag"

const fetchTag = async (tag: string) => {
  return api.get<Tag>(TAG_API_PATH.tag(tag))
}

export function useTagQuery(tag: string) {
  return useQuery({
    queryKey: TAG_QUERY_KEY.tag(tag),
    queryFn: () => fetchTag(tag),
    enabled: !!tag,
  })
}
