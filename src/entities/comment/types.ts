export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
}

export interface Reaction {
  likes: number
  dislikes: number
}
