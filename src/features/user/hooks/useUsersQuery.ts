import { useQuery } from "@tanstack/react-query"
import { USER_QUERY_KEY } from "../models/queries"
import { api } from "shared/utils/http"
import { User } from "entities/user"

const fetchUsers = async () => {
  return api.get<User[]>("/users?limit=0&select=username,image")
}

export const useUsersQuery = () => {
  return useQuery({
    queryKey: USER_QUERY_KEY.users(),
    queryFn: fetchUsers,
  })
}
