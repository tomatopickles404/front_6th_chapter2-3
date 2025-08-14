export interface User {
  id: string
  image: string
  username: string
}

export interface Reaction {
  likes: number
  dislikes: number
}

export interface Post {
  id: number
  title: string
  body: string
  author: User
  tags: string[]
  userId: number
  reactions: Reaction
}
