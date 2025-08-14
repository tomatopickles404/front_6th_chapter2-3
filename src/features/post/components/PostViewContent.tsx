import { Post } from "entities/post"
import { Comments } from "features/comment"

interface PostViewContentProps {
  post: Post
  search?: string
}

function highlightText(text: string, highlight: string): string {
  if (!highlight.trim()) return text

  const regex = new RegExp(`(${highlight})`, "gi")
  return text.replace(regex, "<mark>$1</mark>")
}

export function PostViewContent({ post, search }: PostViewContentProps) {
  return (
    <div className="space-y-4">
      <p>{highlightText(post.body, search || "")}</p>
      <Comments postId={post.id} />
    </div>
  )
}
