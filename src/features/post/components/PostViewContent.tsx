import { Post } from "entities/post"
import { Comments } from "features/comment"
import { HighlightText } from "shared/components"

interface PostViewContentProps {
  post: Post
  search?: string
}

export function PostViewContent({ post, search }: PostViewContentProps) {
  const { id, body } = post
  return (
    <div className="space-y-4">
      <HighlightText text={body} highlight={search || ""} />
      <Comments postId={id} />
    </div>
  )
}
