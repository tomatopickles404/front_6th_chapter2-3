export interface Post {
  id: number
  title: string
  body: string
  userId: number
  author: User
  tags: Tag[]
  reactions: Reaction
}
