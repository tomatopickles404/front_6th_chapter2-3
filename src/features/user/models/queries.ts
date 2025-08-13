export const USER_QUERY_KEY = {
  all: ["users"],
  users: () => [...USER_QUERY_KEY.all],
} as const
