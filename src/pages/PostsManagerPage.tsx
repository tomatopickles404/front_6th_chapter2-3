import { Plus } from "lucide-react"
import { usePostsParams, usePostsQuery, useSearchPosts, PostDialog, PostTable, PostFilters } from "features/post"
import { Button, Card, CardContent, CardHeader, CardTitle, Pagination } from "shared/components"
import { UserDialog } from "features/user"
import { useDeletePostMutation } from "features/post/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { POST_QUERY_KEY } from "features/post/models"
import { overlay } from "overlay-kit"
import { useMemo } from "react"
import { Table } from "shared/components/Table"
import { useUsersQuery } from "features/user/hooks"

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

  const openUserDialog = (user: { id: number; username: string; image: string }) => {
    overlay.open(({ isOpen, close }) => <UserDialog open={isOpen} onOpenChange={close} userId={user.id} />)
  }

  const handleDeletePost = (id: number) => {
    deletePost(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY.posts(params) })
      },
    })
  }

  const filteredPosts = useMemo(() => {
    if (!posts) return []

    let filtered = [...posts]

    // 1. 검색어 필터링
    if (params.search.trim()) {
      const searchLower = params.search.toLowerCase()
      filtered = filtered.filter(
        (post) => post.title.toLowerCase().includes(searchLower) || post.body.toLowerCase().includes(searchLower),
      )
    }

    // 2. 태그 필터링
    if (params.tag && params.tag !== "all") {
      filtered = filtered.filter((post) => post.tags && post.tags.includes(params.tag))
    }

    // 3. 정렬 적용
    if (params.sortBy !== "none") {
      filtered.sort((a, b) => {
        let aValue: number | string
        let bValue: number | string

        switch (params.sortBy) {
          case "id":
            aValue = a.id
            bValue = b.id
            break
          case "title":
            aValue = a.title.toLowerCase()
            bValue = b.title.toLowerCase()
            break
          case "reactions":
            aValue = (a.reactions?.likes || 0) + (a.reactions?.dislikes || 0)
            bValue = (b.reactions?.likes || 0) + (b.reactions?.dislikes || 0)
            break
          default:
            return 0
        }

        if (params.sortOrder === "asc") {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }

    return filtered
  }, [posts, params.search, params.tag, params.sortBy, params.sortOrder])

  // 태그 클릭 핸들러 추가
  const handleTagClick = (tag: string) => {
    // 현재 선택된 태그와 같으면 "all"로 설정, 다르면 해당 태그로 설정
    const newTag = params.tag === tag ? "all" : tag
    updateParams({ ...params, tag: newTag })
  }

  return (
    <CardContent>
      <div className="flex flex-col gap-4">
        <PostFilters params={params} updateParams={updateParams} />
        {isLoadingTable ? (
          <div className="flex justify-center p-4">로딩 중...</div>
        ) : postsError ? (
          <div>게시물을 불러오는 중 오류가 발생했습니다: {postsError.message}</div>
        ) : (
          <PostTable
            posts={filteredPosts}
            selectedTag={params.tag}
            searchQuery={params.search}
            onViewPost={openPostDetail}
            onEditPost={openEditDialog}
            onViewUser={openUserDialog}
            onDeletePost={handleDeletePost}
            onTagClick={handleTagClick}
          />
        )}

        <Pagination params={params} updateParams={updateParams} total={total} />
      </div>
    </CardContent>
  )
}
