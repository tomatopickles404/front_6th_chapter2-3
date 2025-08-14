import { useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "shared/components"
import { POST_QUERY_KEY } from "../models/queries"
import { useCreatePostMutation, useUpdatePostMutation } from "../hooks"
import { Post } from "entities/post"
import { PostCreateForm, PostEditForm, PostViewContent } from "features/post"
import { PostFormData } from "../models/types"

// 통합된 다이얼로그
export function PostDialog({
  type,
  open,
  onOpenChange,
  post,
  search,
}: {
  type: "create" | "edit" | "view"
  open: boolean
  onOpenChange: (open: boolean) => void
  post?: Post
  search?: string
}) {
  const queryClient = useQueryClient()
  const { mutate: createPost } = useCreatePostMutation()
  const { mutate: updatePost } = useUpdatePostMutation()

  const handleCreate = (formData: PostFormData) => {
    createPost(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY.all })
        onOpenChange(false)
      },
    })
  }

  const handleEdit = (formData: PostFormData) => {
    if (!post) return

    updatePost(
      { id: post.id, post: formData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY.all })
          onOpenChange(false)
        },
      },
    )
  }

  const getTitle = () => {
    switch (type) {
      case "create":
        return "새 게시물 추가"
      case "edit":
        return "게시물 수정"
      case "view":
        return post?.title || ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={type === "view" ? "max-w-3xl" : undefined}>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        {/* JSX로 직접 표현 - 선언적이고 명확 */}
        {type === "create" && <PostCreateForm onSubmit={handleCreate} />}
        {type === "edit" && post && <PostEditForm post={post} onSubmit={handleEdit} />}
        {type === "view" && post && <PostViewContent post={post} search={search} />}
      </DialogContent>
    </Dialog>
  )
}
