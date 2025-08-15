import { useQuery } from "@tanstack/react-query"
import { api } from "shared/lib"
import { User } from "entities/user"

const fetchUser = async (id: number) => {
  if (!id) return null
  return api.get<User>(`/users/${id}`)
}

export function useUserQuery(id: number) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  })
}
