import { useSuspenseQuery } from "@tanstack/react-query"
import { USER_QUERY_KEY } from "../models/queries"
import { api } from "shared/lib/http"

interface User {
  id: number
  username: string
  image: string
}

interface UserResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

const fetchUser = async () => {
  return api.get<UserResponse>(`/users?limit=0&select=username,image`)
}

export function useUsersQuery() {
  return useSuspenseQuery({
    queryKey: USER_QUERY_KEY.users(),
    queryFn: () => fetchUser(),
  })
}
