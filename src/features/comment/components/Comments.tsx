import { useState, useEffect } from "react"
import { type Comment } from "entities/comment"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "shared/components"
import { overlay } from "overlay-kit"
import { ThumbsUp, Edit2, Trash2, Plus } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useCommentsQuery, useUpdateCommentMutation, useUpdateLikeMutation, useDeleteCommentMutation } from "../hooks"
import { COMMENT_QUERY_KEY } from "../models/queries"
import { useCommentManagement } from "../hooks/useCommentManagement"
import { User } from "entities/user"
import { useInputValue } from "shared/hooks"

type CommentsMap = {
  [postId: number]: Comment[]
}

export function Comments({ postId }: { postId: number }) {
  const { data: commentsData, isLoading: isLoadingComments } = useCommentsQuery(postId)

  const [comments, setComments] = useState<CommentsMap>({})

  useEffect(() => {
    if (commentsData) {
      let filteredComments: Comment[] = []

      if (Array.isArray(commentsData)) {
        // postId가 일치하는 댓글만 필터링
        filteredComments = commentsData.filter((comment) => comment.postId === postId)
      }
      // commentsData가 객체이고 comments 속성을 가진 경우만 처리
      else if (commentsData && typeof commentsData === "object" && "comments" in commentsData) {
        // @ts-expect-error 타입 에러 무시하고 간단하게 처리
        const rawComments = Array.isArray(commentsData.comments) ? commentsData.comments : []
        filteredComments = rawComments.filter((comment: Comment) => comment.postId === postId)
      }

      setComments((prev) => ({
        ...prev,
        [postId]: filteredComments,
      }))
    }
  }, [commentsData, postId])

  if (isLoadingComments) return <div>Loading...</div>

  const postComments = comments[postId] || []

  return (
    <div className="mt-2">
      <CommentHeader />
      <CommentList comments={postComments} />
    </div>
  )
}

// 댓글 헤더 컴포넌트
function CommentHeader() {
  const handleAddComment = () => {
    overlay.open(({ isOpen, close }) => <AddCommentDialog open={isOpen} onOpenChange={close} />)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={handleAddComment}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
    </>
  )
}

// 댓글 목록 컴포넌트
function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
        아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

// 댓글 아이템 컴포넌트
function CommentItem({ comment }: { comment: Comment }) {
  const { user, body } = comment

  const handleEdit = () => {
    overlay.open(({ isOpen, close }) => <EditCommentDialog comment={comment} open={isOpen} onOpenChange={close} />)
  }

  return (
    <>
      <div className="flex items-center justify-between text-sm border-b pb-1">
        <div className="flex items-center space-x-2 overflow-hidden">
          <span className="font-medium truncate">{user.username}:</span>
          <span className="truncate">{body}</span>
        </div>

        <div className="flex items-center space-x-1">
          <LikeButton comment={comment} />
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Edit2 className="w-3 h-3" />
          </Button>
          <DeleteButton comment={comment} />
        </div>
      </div>
    </>
  )
}

// 댓글 추가
function AddCommentDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { body, setBody, currentUser, isLoadingUser, isPending, handleSubmit, resetForm } = useCommentManagement()

  const handleSuccess = () => {
    resetForm()
    onOpenChange(false)
  }

  // 로딩 상태 처리
  if (isLoadingUser) {
    return <LoadingDialog title="새 댓글 추가" message="사용자 정보를 불러오는 중..." />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <CommentForm
          body={body}
          setBody={setBody}
          currentUser={currentUser!}
          isPending={isPending}
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}

// 댓글 폼 컴포넌트 (재사용 가능)
function CommentForm({
  body,
  setBody,
  currentUser,
  isPending,
  onSubmit,
  onSuccess,
}: {
  body: string
  setBody: (body: string) => void
  currentUser: User
  isPending: boolean
  onSubmit: () => void
  onSuccess: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        작성자: {currentUser?.username} (ID: {currentUser?.id})
      </div>
      <Textarea placeholder="댓글 내용" value={body} onChange={(e) => setBody(e.target.value)} />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onSuccess}>
          취소
        </Button>
        <Button onClick={onSubmit} disabled={isPending}>
          {isPending ? "추가 중..." : "댓글 추가"}
        </Button>
      </div>
    </div>
  )
}

// 로딩 다이얼로그 (재사용 가능)
function LoadingDialog({ title, message }: { title: string; message: string }) {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="text-center py-4">{message}</div>
      </DialogContent>
    </Dialog>
  )
}

// 댓글 수정 다이얼로그
function EditCommentDialog({
  comment,
  open,
  onOpenChange,
}: {
  comment: Comment
  open: boolean
  onOpenChange: () => void
}) {
  const { value: body, handleChange } = useInputValue(comment.body)
  const { mutate: updateComment, isPending } = useUpdateCommentMutation()

  const handleSubmit = () => {
    if (!body.trim() || body === comment.body) return

    updateComment(
      { id: comment.id, body: body.trim() },
      {
        onSuccess: () => {
          onOpenChange()
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={body} onChange={handleChange} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onOpenChange}>
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "수정 중..." : "댓글 수정"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function LikeButton({ comment }: { comment: Comment }) {
  const queryClient = useQueryClient()

  const { mutate: updateLike, isPending } = useUpdateLikeMutation({
    onMutate: async (data) => {
      const previousComments = queryClient.getQueryData(COMMENT_QUERY_KEY.byPost(comment.postId))

      queryClient.setQueryData(COMMENT_QUERY_KEY.byPost(comment.postId), (old: Comment[] | undefined) => {
        if (!old || !Array.isArray(old)) return old
        return old.map((c) => (c.id === data.id ? { ...c, likes: data.likes } : c))
      })

      return { previousComments }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEY.byPost(comment.postId) })
    },
    onError: (error, _, context) => {
      const typedContext = context as { previousComments: Comment[] } | undefined
      if (typedContext?.previousComments) {
        queryClient.setQueryData(COMMENT_QUERY_KEY.byPost(comment.postId), typedContext.previousComments)
      }
      console.error("좋아요 업데이트에 실패했습니다:", error)
    },
  })

  const handleLike = () => {
    updateLike({
      id: comment.id,
      likes: (comment.likes ?? 0) + 1,
    })
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLike} disabled={isPending}>
      <ThumbsUp className="w-3 h-3" />
      <span className="ml-1 text-xs">{comment.likes || 0}</span>
    </Button>
  )
}

// 삭제 버튼 컴포넌트
function DeleteButton({ comment }: { comment: Comment }) {
  const { mutate: deleteComment, isPending } = useDeleteCommentMutation()

  const handleDelete = () => {
    if (confirm("댓글을 삭제하시겠습니까?")) {
      deleteComment(comment.id)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending}>
      <Trash2 className="w-3 h-3" />
    </Button>
  )
}
