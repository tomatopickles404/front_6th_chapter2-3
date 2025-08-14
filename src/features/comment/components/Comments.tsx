import { useState } from "react"
import { type Comment } from "entities/comment"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "shared/components"
import { overlay } from "overlay-kit"
import { ThumbsUp, Edit2, Trash2, Plus } from "lucide-react"
import {
  useCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useUpdateLikeMutation,
  useDeleteCommentMutation,
} from "../hooks"

export function Comments({ postId }: { postId: number }) {
  const { data: comments, isLoading: isLoadingComments } = useCommentsQuery(postId)

  if (isLoadingComments) return <div>Loading...</div>
  if (!comments) return null

  return (
    <div className="mt-2">
      <CommentHeader postId={postId} />
      <CommentList comments={comments} />
    </div>
  )
}

// 댓글 헤더 컴포넌트
function CommentHeader({ postId }: { postId: number }) {
  const handleAddComment = () => {
    overlay.open(({ isOpen, close }) => <AddCommentDialog postId={postId} open={isOpen} onOpenChange={close} />)
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
  return (
    <div className="space-y-1">
      {comments.map((comment: Comment) => (
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

// 댓글 추가 다이얼로그
function AddCommentDialog({
  open,
  onOpenChange,
}: {
  postId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [body, setBody] = useState("")
  const { mutate: createComment, isPending } = useCreateCommentMutation()

  const handleSubmit = () => {
    if (!body.trim()) return

    createComment(
      // { body: body.trim(), postId, userId },
      {
        onSuccess: () => {
          setBody("")
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={body} onChange={(e) => setBody(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "추가 중..." : "댓글 추가"}
            </Button>
          </div>
        </div>
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
  const [body, setBody] = useState(comment.body)
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
          <Textarea placeholder="댓글 내용" value={body} onChange={(e) => setBody(e.target.value)} />
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

// 좋아요 버튼 컴포넌트
function LikeButton({ comment }: { comment: Comment }) {
  const { mutate: updateLike, isPending } = useUpdateLikeMutation()

  const handleLike = () => {
    // updateLike({ id: comment.id, postId } })
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLike} disabled={isPending}>
      <ThumbsUp className="w-3 h-3" />
      <span className="ml-1 text-xs">{comment.likes}</span>
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
