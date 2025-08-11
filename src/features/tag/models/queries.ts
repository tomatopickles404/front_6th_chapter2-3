export const TAG_QUERY_KEY = {
  all: ["tags"],
  tags: () => [...TAG_QUERY_KEY.all, "tags"],
  tag: () => [...TAG_QUERY_KEY.all, "tag"],
} as const
