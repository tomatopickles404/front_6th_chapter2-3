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
    createComment(
      {
        body: body.trim(),
        postId: Number(postId),
        userId: userId!,
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
    handleSubmit,
    resetForm,
  }
}
