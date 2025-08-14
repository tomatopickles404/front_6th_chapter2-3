import { useState } from "react"
import { useParams } from "react-router-dom"
import { useUserStore } from "features/user/models"
import { useUserQuery } from "features/user"
import { useCreateCommentMutation } from "./useCreateCommentMutation"

export function useCommentManagement() {
  const [body, setBody] = useState("")
  const { postId } = useParams()
  const { userId, isLoggedIn } = useUserStore()
  const { data: currentUser, isLoading: isLoadingUser } = useUserQuery(userId)
  const { mutate: createComment, isPending } = useCreateCommentMutation()

  const canSubmit = body.trim() && currentUser && userId && isLoggedIn

  const handleSubmit = () => {
    if (!canSubmit) return

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
    canSubmit,
    handleSubmit,
    resetForm,
  }
}
