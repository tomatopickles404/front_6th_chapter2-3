import { Plus } from "lucide-react"
import { usePostsParams, usePostsQuery, useSearchPosts, PostDialog, PostTable, PostFilters } from "features/post"
import { Button, Card, CardContent, CardHeader, CardTitle, Pagination } from "shared/components"
import { UserDialog } from "features/user"
import { useDeletePostMutation } from "features/post/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { POST_QUERY_KEY } from "features/post/models"
import { overlay } from "overlay-kit"

export default function PostsManager() {
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostsManagerHeader />
      <PostsManagerContent />
    </Card>
  )
}

function PostsManagerHeader() {
  const handleAddPost = async () => {
    await overlay.openAsync(({ isOpen, close }) => <PostDialog type="create" open={isOpen} onOpenChange={close} />)
  }

  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>게시물 관리자</span>
        <Button onClick={handleAddPost}>
          <Plus className="w-4 h-4 mr-2" />
          게시물 추가
        </Button>
      </CardTitle>
    </CardHeader>
  )
}

function PostsManagerContent() {
  const { params, updateParams } = usePostsParams()
  const { search } = params
  const { data: postPages, isLoading: postsLoading, error: postsError } = usePostsQuery(params)
  const { posts, total } = postPages
  const { data: resultPosts, isLoading: searchLoading } = useSearchPosts(search, params)
  const { data: tags } = useTagsQuery()

  const { mutate: deletePost } = useDeletePostMutation()
  const queryClient = useQueryClient()

  const isLoadingTable = postsLoading || searchLoading
  const postsToDisplay = search.trim() ? resultPosts?.posts || [] : posts || []

  const openPostDetail = async (id: number) => {
    const post = postsToDisplay.find((post) => post.id === id)
    if (post) {
      await overlay.openAsync(({ isOpen, close }) => (
        <PostDialog type="view" open={isOpen} onOpenChange={close} post={post} />
      ))
    }
  }

  const openEditDialog = async (post: { id: number; title: string; body: string }) => {
    const fullPost = postsToDisplay.find((p) => p.id === post.id)
    if (fullPost) {
      await overlay.openAsync(({ isOpen, close }) => (
        <PostDialog type="edit" open={isOpen} onOpenChange={close} post={fullPost} />
      ))
    }
  }

  const openUserDialog = (userId: number) => {
    overlay.open(({ isOpen, close }) => <UserDialog open={isOpen} onOpenChange={close} userId={userId} />)
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
  )
}
