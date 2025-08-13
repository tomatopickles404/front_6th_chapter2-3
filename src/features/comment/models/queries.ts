export const COMMENT_QUERY_KEY = {
  all: ["comments"],

  // 게시물별 댓글 목록
  byPost: (postId: number) => [...COMMENT_QUERY_KEY.all, "byPost", postId],

  // 개별 댓글
  detail: (id: number) => [...COMMENT_QUERY_KEY.all, "detail", id],

  // 사용자별 댓글
  byUser: (userId: number) => [...COMMENT_QUERY_KEY.all, "byUser", userId],
} as const
