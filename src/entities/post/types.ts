export interface User {
  id: number
  image: string
  username: string
}

export interface Reaction {
  likes: number
  dislikes: number
  userReaction?: "like" | "dislike" | null
}

export interface Post {
  id: number
  title: string
  body: string
  author?: User
  tags: string[]
  userId?: number
  reactions: Reaction
}
