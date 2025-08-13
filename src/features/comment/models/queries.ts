export const COMMENT_QUERY_KEY = {
  all: ["comments"],

  // 사용자 목록
  list: (postId: number) => [...COMMENT_QUERY_KEY.all, "list", postId],

  // 개별 사용자
  detail: (id: number) => [...COMMENT_QUERY_KEY.all, "detail", id],

  // 사용자 프로필 (이미지, 사용자명만)
  profile: (id: number) => [...COMMENT_QUERY_KEY.all, "profile", id],
} as const
