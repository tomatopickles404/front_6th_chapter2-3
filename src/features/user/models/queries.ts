export const USER_QUERY_KEY = {
  all: ["users"],
  users: () => [...USER_QUERY_KEY.all],
  user: (id: number) => [...USER_QUERY_KEY.all, id],
} as const
