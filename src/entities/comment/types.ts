type CommentUser = {
  id: number
  username: string
  fullName: string
}

export interface Comment {
  id: number
  body: string
  likes: number
  user: CommentUser
}
