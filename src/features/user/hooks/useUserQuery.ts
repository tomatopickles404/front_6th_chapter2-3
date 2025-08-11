import { useQuery } from "@tanstack/react-query"
import { USER_QUERY_KEY } from "../models/queries"
import { api } from "shared/utils/http"
import { User } from "entities/user"

const fetchUser = async (id: number) => {
  return api.get<User>(`/users/${id}`)
}

export function useUserQuery(id: number) {
  return useQuery({
    queryKey: USER_QUERY_KEY.user(id),
    queryFn: () => fetchUser(id),
    enabled: !!id,
  })
}
