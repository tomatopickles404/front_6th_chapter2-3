import { useSuspenseQuery } from "@tanstack/react-query"
import { TAG_QUERY_KEY } from "../models/queries"
import { api } from "shared/utils/http"
import { Tag } from "entities/tag"
import { TAG_API_PATH } from "entities/tag"

const fetchTag = async () => {
  return api.get<Tag>(TAG_API_PATH.tag)
}

export function useTagQuery() {
  return useSuspenseQuery({
    queryKey: TAG_QUERY_KEY.tag(),
    queryFn: fetchTag,
  })
}
