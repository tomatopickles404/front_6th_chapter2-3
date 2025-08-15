import { useState, useCallback } from "react"
import { Post } from "entities/post"
import { updatePostReaction } from "entities/post/helpers"
import { useUpdateReactionMutation } from "./useUpdateReactionMutation"

export function usePostReaction() {
  const [localPosts, setLocalPosts] = useState<Post[]>([])
  const { mutate: mutateReaction, isPending: isUpdating } = useUpdateReactionMutation()

  const updateReaction = (
    postId: number,
    currentReaction: "like" | "dislike" | null,
    newReaction: "like" | "dislike",
  ) => {
    // 같은 반응을 다시 클릭하면 반응 제거
    const finalReaction = currentReaction === newReaction ? null : newReaction

    setLocalPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? updatePostReaction(post, finalReaction) : post)),
    )

    // API 호출 (백그라운드에서 실행)
    mutateReaction({
      postId,
      reaction: finalReaction,
    })
  }

  const syncPosts = useCallback((posts: Post[]) => {
    setLocalPosts(posts)
  }, [])

  return {
    localPosts,
    updateReaction,
    syncPosts,
    isUpdating,
  }
}
