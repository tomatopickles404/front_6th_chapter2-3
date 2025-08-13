export const TAG_QUERY_KEY = {
  all: ["tags"],
  tags: () => [...TAG_QUERY_KEY.all, "tags"],
  tag: (tag: string) => [...TAG_QUERY_KEY.all, "tag", tag],
} as const
