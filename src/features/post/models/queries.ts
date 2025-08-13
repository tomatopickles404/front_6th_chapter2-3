import { PostsParams } from "./types"

export const POST_QUERY_KEY = {
  all: ["posts"],

  // 기본 게시물 목록 (페이지네이션, 정렬)
  posts: (params: PostsParams) => [...POST_QUERY_KEY.all, "list", params],

  // 검색 기반 게시물
  search: (searchQuery: string, params: Omit<PostsParams, "search">) => [
    ...POST_QUERY_KEY.all,
    "search",
    searchQuery,
    params,
  ],

  // 태그별 게시물
  byTag: (tag: string, params: Omit<PostsParams, "tag">) => [...POST_QUERY_KEY.all, "tag", tag, params],

  // 개별 게시물 상세
  detail: (id: number) => [...POST_QUERY_KEY.all, "detail", id],

  // 게시물 작성자 정보
  author: (userId: number) => [...POST_QUERY_KEY.all, "author", userId],
} as const
