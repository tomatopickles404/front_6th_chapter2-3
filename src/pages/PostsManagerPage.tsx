import { useState } from "react"
import { Edit2, Plus, Search, ThumbsUp, Trash2 } from "lucide-react"
import {
  usePostsParams,
  usePostsQuery,
  useSearchPosts,
  useUpdatePostMutation,
  useDeletePostMutation,
  PostDialog,
  PostTable,
} from "features/post"
import { useTagsQuery } from "features/tag"
import { UserDialog } from "features/user"
import { useCommentsQuery } from "features/comment"
import { useQueryClient } from "@tanstack/react-query"
import { Post } from "entities/post"
import { useDialog } from "shared/hooks"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "shared/components"
import { POST_QUERY_KEY } from "features/post"

export default function PostsManager() {
  const { params, updateParams } = usePostsParams()
  const { search, sortBy, sortOrder, tag: selectedTag } = params

  // TanStack Query 훅으로 서버 상태 관리
  const { data: postPages, isLoading: postsLoading, error: postsError } = usePostsQuery(params)
  const { posts, total, skip: skipPost, limit: limitPost } = postPages

  const { data: resultPosts, isLoading: searchLoading } = useSearchPosts(search, params)
  const { data: tags } = useTagsQuery()

  const isLoadingTable = postsLoading || searchLoading
  const postsToDisplay = search.trim() ? resultPosts?.posts || [] : posts || []

  // Mutation 훅들
  const { mutate: updatePost } = useUpdatePostMutation()
  const { mutate: deletePost } = useDeletePostMutation()

  // 클라이언트 상태만 유지 (UI 상태)
  const [selectedPost, setSelectedPost] = useState<Post | undefined>(undefined)

  const { isOpen: showAddDialog, toggleDialog: toggleShowAddDialog } = useDialog()
  const { isOpen: showEditDialog, toggleDialog: toggleShowEditDialog } = useDialog()
  const { isOpen: showEditCommentDialog, toggleDialog: toggleShowEditCommentDialog } = useDialog()
  const { isOpen: showPostDetailDialog, toggleDialog: toggleShowPostDetailDialog } = useDialog()

  const queryClient = useQueryClient()

  // 간단한 핸들러 함수들

  const handleUpdatePost = () => {
    if (!selectedPost) return

    updatePost(
      { id: selectedPost.id, post: selectedPost },
      {
        onSuccess: (data: Post) => {
          queryClient.setQueryData(POST_QUERY_KEY.detail(data.id), data)
          queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY.all })
          toggleShowEditDialog()
        },
        onError: (error) => {
          console.error("게시물 업데이트 오류:", error)
        },
      },
    )
  }

  const handleDeletePost = (id: number) => {
    deletePost(id, {
      onSuccess: (_, id) => {
        queryClient.removeQueries({ queryKey: POST_QUERY_KEY.detail(id) })
        queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY.all })
      },
    })
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    toggleShowPostDetailDialog()
  }

  //  에러 처리
  if (postsError) {
    return <div>게시물을 불러오는 중 오류가 발생했습니다: {postsError.message}</div>
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => toggleShowAddDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => updateParams({ search: e.target.value })}
                />
              </div>
            </div>
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                updateParams({ tag: value })
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags?.map((tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => updateParams({ sortBy: value as any })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="reactions">반응</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={(value) => updateParams({ sortOrder: value as any })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 게시물 테이블 */}
          {isLoadingTable ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable posts={postsToDisplay} />
          )}

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select value={limitPost.toString()} onValueChange={(value) => updateParams({ limit: Number(value) })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            <div className="flex gap-2">
              <Button
                disabled={skipPost === 0}
                onClick={() => updateParams({ skip: Math.max(0, skipPost - limitPost) })}
              >
                이전
              </Button>
              <Button
                disabled={skipPost + limitPost >= (total || 0)}
                onClick={() => updateParams({ skip: skipPost + limitPost })}
              >
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <PostDialog type="create" open={showAddDialog} onOpenChange={toggleShowAddDialog} />
      <PostDialog
        type="edit"
        open={showEditDialog}
        onOpenChange={toggleShowEditDialog}
        post={selectedPost}
        search={search}
      />
      <PostDialog
        type="view"
        open={showPostDetailDialog}
        onOpenChange={toggleShowPostDetailDialog}
        post={selectedPost}
        search={search}
      />
    </Card>
  )
}
