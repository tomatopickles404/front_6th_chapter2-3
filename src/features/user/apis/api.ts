import { api } from "shared/utils/http"
import { User } from "entities/user"

export const fetchUsers = async () => {
  return api.get<User[]>("/users?limit=0&select=username,image")
}

export const fetchUser = async (id: number) => {
  return api.get<User>(`/users/${id}`)
}
