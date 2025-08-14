import { Plus } from "lucide-react"
import { usePostsParams, usePostsQuery, useSearchPosts, PostDialog, PostTable, PostFilters } from "features/post"
import { useDialog } from "shared/hooks"
import { Button, Card, CardContent, CardHeader, CardTitle, Pagination } from "shared/components"
import { UserDialog, useUserId } from "features/user"
import { useUpdatePostMutation, useDeletePostMutation } from "features/post/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { POST_QUERY_KEY } from "features/post/models"
import { useTagsQuery } from "features/tag"
import { Post } from "entities/post"
import { useState } from "react"

export default function PostsManager() {
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostsManagerHeader />
      <PostsManagerContent />
    </Card>
  )
}

// 게시물 관리자 헤더 (게시물 추가 다이얼로그 완전 관리)
function PostsManagerHeader() {
  const { isOpen: showAddDialog, toggleDialog: toggleShowAddDialog } = useDialog()

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={toggleShowAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>

      {/* 게시물 추가 다이얼로그를 여기서 렌더링 */}
      {showAddDialog && <PostDialog type="create" open={showAddDialog} onOpenChange={toggleShowAddDialog} />}
    </>
  )
}

// 게시물 관리자 메인 콘텐츠 (다른 다이얼로그들만 관리)
function PostsManagerContent() {
  const [selectedPost, setSelectedPost] = useState<Post | undefined>(undefined)
  // showAddDialog 제거 (PostsManagerHeader에서 관리)
  const { isOpen: showEditDialog, toggleDialog: toggleShowEditDialog } = useDialog()
  const { isOpen: showPostDetailDialog, toggleDialog: toggleShowPostDetailDialog } = useDialog()
  const { isOpen: showUserModal, toggleDialog: toggleShowUserModal } = useDialog()

  const { params, updateParams } = usePostsParams()
  const { search } = params
  const { data: postPages, isLoading: postsLoading, error: postsError } = usePostsQuery(params)
  const { posts, total } = postPages
  const { data: resultPosts, isLoading: searchLoading } = useSearchPosts(search, params)
  const { data: tags } = useTagsQuery()
  const { userId, updateUserId } = useUserId()

  const { mutate: updatePost } = useUpdatePostMutation()
  const { mutate: deletePost } = useDeletePostMutation()
  const queryClient = useQueryClient()

  const isLoadingTable = postsLoading || searchLoading
  const postsToDisplay = search.trim() ? resultPosts?.posts || [] : posts || []

  const openPostDetail = (id: number) => {
    const post = postsToDisplay.find((post) => post.id === id)
    if (post) {
      setSelectedPost(post)
      toggleShowPostDetailDialog()
    }
  }

  const openEditDialog = (post: { id: number; title: string; body: string }) => {
    const fullPost = postsToDisplay.find((p) => p.id === post.id)
    if (fullPost) {
      setSelectedPost(fullPost)
      toggleShowEditDialog()
    }
  }

  const openUserDialog = (userId: number) => {
    updateUserId(userId)
    toggleShowUserModal()
  }

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
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY.all })
      },
    })
  }

  // 에러 처리
  if (postsError) {
    return <div>게시물을 불러오는 중 오류가 발생했습니다: {postsError.message}</div>
  }

  return (
    <>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostFilters />

          {isLoadingTable ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={postsToDisplay}
              onViewPost={openPostDetail}
              onEditPost={openEditDialog}
              onViewUser={openUserDialog}
              onDeletePost={handleDeletePost}
            />
          )}

          <Pagination params={params} updateParams={updateParams} total={total} />
        </div>
      </CardContent>

      {/* 게시물 추가 다이얼로그 제거 (PostsManagerHeader에서 관리) */}

      {showEditDialog && (
        <PostDialog
          type="edit"
          open={showEditDialog}
          onOpenChange={toggleShowEditDialog}
          post={selectedPost}
          search={search}
        />
      )}

      {showPostDetailDialog && (
        <PostDialog
          type="view"
          open={showPostDetailDialog}
          onOpenChange={toggleShowPostDetailDialog}
          post={selectedPost}
          search={search}
        />
      )}

      {showUserModal && <UserDialog open={showUserModal} onOpenChange={toggleShowUserModal} userId={userId} />}
    </>
  )
}
