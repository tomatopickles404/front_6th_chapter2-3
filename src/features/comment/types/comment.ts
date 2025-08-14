import { User } from "entities/user"

export interface CommentFormData {
  body: string
  postId: number
  userId: number
}

export interface CommentManagementState {
  body: string
  currentUser: User | null
  isLoadingUser: boolean
  isPending: boolean
  canSubmit: boolean
}

export interface CommentFormProps {
  body: string
  setBody: (body: string) => void
  currentUser: User | null
  isPending: boolean
  canSubmit: boolean
  onSubmit: () => void
  onSuccess: () => void
}
