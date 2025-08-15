import { useState } from "react"
import { useParams } from "react-router-dom"
import { useUserStore } from "features/user/models"
import { useUserQuery } from "features/user"
import { useCreateCommentMutation } from "./useCreateCommentMutation"

export function useCommentManagement() {
  const [body, setBody] = useState("")
  const { postId } = useParams()
  const { userId } = useUserStore()
  const { data: currentUser, isLoading: isLoadingUser } = useUserQuery(userId!)
  const { mutate: createComment, isPending } = useCreateCommentMutation()

  const handleSubmit = () => {
    if (!body.trim()) {
      alert("댓글 내용을 입력해주세요.")
      return
    }

    if (!postId || isNaN(Number(postId))) {
      alert("게시물 ID가 유효하지 않습니다.")
      return
    }

    if (!userId) {
      alert("사용자 정보가 없습니다.")
      return
    }

    createComment(
      {
        body: body.trim(),
        postId: Number(postId),
        userId: userId,
      },
      {
        onSuccess: () => {
          setBody("")
        },
        onError: (error) => {
          console.error("댓글 생성 실패:", error)
          alert("댓글 생성에 실패했습니다. 다시 시도해주세요.")
        },
      },
    )
  }

  const resetForm = () => setBody("")

  return {
    body,
    setBody,
    currentUser,
    isLoadingUser,
    isPending,
    handleSubmit,
    resetForm,
  }
}
