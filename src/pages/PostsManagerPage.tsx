import { useState } from "react"
import { Edit2, MessageSquare, Plus, Search, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import {
  usePostsParams,
  useSearchPosts,
  useUpdatePostMutation,
  useDeletePostMutation,
  useCreatePostMutation,
  usePostsQuery,
  usePostForm,
} from "features/post"
import { useTagsQuery } from "features/tag"
import { useUsersQuery, useUserQuery } from "features/user"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "shared/components"
import { POST_QUERY_KEY } from "features/post/models/queries"

const highlightText = (text: string, highlight: string) => {
  if (!text) return null
  if (!highlight.trim()) {
    return <span>{text}</span>
  }
  const regex = new RegExp(`(${highlight})`, "gi")
  const parts = text.split(regex)
  return (
    <span>
      {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
    </span>
  )
}

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
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

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

      {/* 게시물 추가 대화상자 */}
      <PostDialog open={showAddDialog} toggleDialog={toggleShowAddDialog} />

      {/* 게시물 수정 대화상자 */}
      <Dialog open={showEditDialog} onOpenChange={toggleShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={selectedPost?.title || ""}
              onChange={(e) => setSelectedPost(selectedPost ? { ...selectedPost, title: e.target.value } : null)}
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={selectedPost?.body || ""}
              onChange={(e) => setSelectedPost(selectedPost ? { ...selectedPost, body: e.target.value } : null)}
            />
            <Button onClick={handleUpdatePost}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={toggleShowPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title || "", search)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body || "", search)}</p>
            {selectedPost && <Comments postId={selectedPost.id} />}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export function PostDetailDialog({
  open,
  toggleDialog,
  post,
  search,
}: {
  open: boolean
  toggleDialog: () => void
  post: Post
  search: string
}) {
  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post?.title || "", search)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post?.body || "", search)}</p>
          {post && <Comments postId={post.id} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function PostEditDialog({
  open,
  toggleDialog,
  post,
  search,
}: {
  open: boolean
  toggleDialog: () => void
  post: Post
  search: string
}) {
  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title || "", search)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post.body || "", search)}</p>
          {post && <Comments postId={post.id} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function PostDialog({ open, toggleDialog }: { open: boolean; toggleDialog: () => void }) {
  const queryClient = useQueryClient()
  const { mutate: createPost } = useCreatePostMutation()
  const { post, handleChange, resetPost } = usePostForm()

  const handleAddPost = () => {
    createPost(post, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY.all })
        toggleDialog()
        resetPost()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" name="title" value={post.title} onChange={handleChange} />
          <Textarea rows={30} placeholder="내용" name="body" value={post.body} onChange={handleChange} />
          <Input type="number" placeholder="사용자 ID" name="userId" value={post.userId} onChange={handleChange} />
          <Button onClick={handleAddPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface PostTableProps {
  posts: Post[]
}

export function PostTable({ posts }: PostTableProps) {
  const { params, updateParams } = usePostsParams()
  const { search, tag: selectedTag } = params

  const { isOpen: showUserModal, toggleDialog: toggleShowUserModal } = useDialog()
  const { data: userData } = useUsersQuery()
  const [userId, setUserId] = useState<number | null>(null)

  const tableData = posts.map((post) => ({
    ...post,
    author: userData?.users.filter((user) => user.id === post.userId)[0],
  }))

  const { mutate: deletePost } = useDeletePostMutation()
  const queryClient = useQueryClient()

  // 게시물 삭제
  const handleDeletePost = (id: number) => {
    deletePost(id, {
      onSuccess: (_, id) => {
        queryClient.removeQueries({ queryKey: POST_QUERY_KEY.detail(id) })
        queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY.all })
      },
    })
  }

  const handleShowUserModal = (userId: number) => {
    setUserId(userId)
    toggleShowUserModal()
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-[150px]">작성자</TableHead>
            <TableHead className="w-[150px]">반응</TableHead>
            <TableHead className="w-[150px]">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map(({ id, title, tags, reactions, author }) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>{highlightText(title, search)}</div>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                          selectedTag === tag
                            ? "text-white bg-blue-500 hover:bg-blue-600"
                            : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                        }`}
                        onClick={() => {
                          updateParams({ tag })
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => handleShowUserModal(author.id)}
                >
                  <img src={author.image} alt={author.username} className="w-8 h-8 rounded-full" />
                  <span>{author.username}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{reactions.likes || 0}</span>
                  <ThumbsDown className="w-4 h-4" />
                  <span>{reactions.dislikes || 0}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeletePost(id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 사용자 모달 */}
      {showUserModal && <UserDialog open={showUserModal} onOpenChange={toggleShowUserModal} userId={userId} />}
    </>
  )
}

export function UserDialog({
  open,
  onOpenChange,
  userId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: number | null
}) {
  const { data: user } = useUserQuery(userId || null)
  if (!user) return null

  const { firstName, lastName, age, email, phone, address, company, image, username } = user

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img src={image} alt={username} className="w-24 h-24 rounded-full mx-auto" />
          <h3 className="text-xl font-semibold text-center">{username}</h3>
          <div className="space-y-2">
            <p>
              <strong>이름:</strong> {firstName} {lastName}
            </p>
            <p>
              <strong>나이:</strong> {age}
            </p>
            <p>
              <strong>이메일:</strong> {email}
            </p>
            <p>
              <strong>전화번호:</strong> {phone}
            </p>
            <p>
              <strong>주소:</strong> {address?.address}, {address?.city}, {address?.state}
            </p>
            <p>
              <strong>직장:</strong> {company?.name} - {company?.title}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ✅ Comments 컴포넌트 - 자체 훅으로 상태 관리
export function Comments({ postId }: { postId: number }) {
  // ✅ 자체 훅으로 댓글 데이터 관리
  const { data: comments, isLoading: isLoadingComments } = useCommentsQuery(postId)

  // ✅ 자체 상태 관리
  const [newComment, setNewComment] = useState({ body: "", postId: null as number | null, userId: 1 })
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  // ✅ 자체 dialog 상태 관리
  const { isOpen: showAddCommentDialog, toggleDialog: toggleShowAddCommentDialog } = useDialog()
  const { isOpen: showEditCommentDialog, toggleDialog: toggleShowEditCommentDialog } = useDialog()

  if (isLoadingComments) return <div>Loading...</div>

  return (
    <>
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">댓글</h3>
          <Button
            size="sm"
            onClick={() => {
              setNewComment((prev) => ({ ...prev, postId }))
              toggleShowAddCommentDialog()
            }}
          >
            <Plus className="w-3 h-3 mr-1" />
            댓글 추가
          </Button>
        </div>
        <div className="space-y-1">
          {comments?.map((comment: Comment) => (
            <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
              <div className="flex items-center space-x-2 overflow-hidden">
                <span className="font-medium truncate">{comment.user.username}:</span>
                <span className="truncate">{comment.body}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="w-3 h-3" />
                  <span className="ml-1 text-xs">{comment.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedComment(comment)
                    toggleShowEditCommentDialog()
                  }}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 댓글 추가 대화상자 */}
      <Dialog open={showAddCommentDialog} onOpenChange={toggleShowAddCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={newComment.body}
              onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
            />
            <Button onClick={() => toggleShowAddCommentDialog()}>댓글 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog open={showEditCommentDialog} onOpenChange={toggleShowEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
              onChange={(e) =>
                setSelectedComment(selectedComment ? { ...selectedComment, body: e.target.value } : null)
              }
            />
            <Button onClick={() => toggleShowEditCommentDialog()}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
