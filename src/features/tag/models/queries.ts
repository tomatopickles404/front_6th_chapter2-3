export const TAG_QUERY_KEY = {
  all: ["tags"],
  tags: () => [...TAG_QUERY_KEY.all],
  tag: () => [...TAG_QUERY_KEY.all],
} as const
