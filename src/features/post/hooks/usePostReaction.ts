import { useState, useCallback } from "react"
import { Post } from "entities/post"
import { updatePostReaction } from "entities/post/helpers"
import { useUpdatePostReactionMutation } from "./useUpdatePostReactionMutation"

export function usePostReaction(initialPosts: Post[]) {
  const [localPosts, setLocalPosts] = useState<Post[]>(initialPosts)
  const updateReactionMutation = useUpdatePostReactionMutation()

  const updateReaction = useCallback(
    (postId: number, currentReaction: "like" | "dislike" | null, newReaction: "like" | "dislike") => {
      // 같은 반응을 다시 클릭하면 반응 제거
      const finalReaction = currentReaction === newReaction ? null : newReaction

      // 즉시 로컬 상태 업데이트 (낙관적 업데이트)
      setLocalPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? updatePostReaction(post, finalReaction) : post)),
      )

      // API 호출 (백그라운드에서 실행)
      updateReactionMutation.mutate({
        postId,
        reaction: finalReaction,
      })
    },
    [updateReactionMutation],
  )

  const syncPosts = useCallback((posts: Post[]) => {
    setLocalPosts(posts)
  }, [])

  return {
    localPosts,
    updateReaction,
    syncPosts,
    isUpdating: updateReactionMutation.isPending,
  }
}
