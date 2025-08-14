import { useCommentsQuery } from "../hooks"
import { useDialog } from "shared/hooks"
import { useState } from "react"
import { Comment as CommentType } from "entities/comment"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "shared/components"
import { ThumbsUp, Edit2, Trash2, Plus } from "lucide-react"

export function Comments({ postId }: { postId: number }) {
  const { data: comments, isLoading: isLoadingComments } = useCommentsQuery(postId)

  const [newComment, setNewComment] = useState({ body: "", postId: null as number | null, userId: 1 })
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  const { isOpen: showAddCommentDialog, toggleDialog: toggleShowAddCommentDialog } = useDialog()
  const { isOpen: showEditCommentDialog, toggleDialog: toggleShowEditCommentDialog } = useDialog()

  if (isLoadingComments) return <div>Loading...</div>
  if (!comments) return null

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
          {comments.map((comment: CommentType) => (
            <CommentItem key={comment.id} comment={comment} />
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

function CommentForm({ comment }: { comment: CommentType }) {
  return <div>CommentForm</div>
}

function CommentEditForm({ comment }: { comment: CommentType }) {
  return <div>CommentEditForm</div>
}

function CommentDeleteForm({ comment }: { comment: CommentType }) {
  return <div>CommentDeleteForm</div>
}

function CommentDialog({ comment }: { comment: CommentType }) {
  return <div>CommentDialog</div>
}

function CommentItem({ comment }: { comment: CommentType }) {
  const { isOpen: showEditCommentDialog, toggleDialog: toggleShowEditCommentDialog } = useDialog()
  const { user, likes, body } = comment

  return (
    <div className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{user.username}:</span>
        <span className="truncate">{body}</span>
      </div>

      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm">
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{likes}</span>
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
  )
}
