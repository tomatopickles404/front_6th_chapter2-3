export const COMMENT_QUERY_KEY = {
  all: ["comments"],

  byPost: (postId: number) => [...COMMENT_QUERY_KEY.all, postId],
} as const
