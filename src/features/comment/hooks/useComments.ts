import { useState, useEffect } from "react"
import { Comment } from "entities/comment"

type CommentsMap = {
  [postId: number]: Comment[]
}

export function useComments({ postId, commentsData }: { postId: number; commentsData: Comment[] }) {
  const [comments, setComments] = useState<CommentsMap>({})

  useEffect(() => {
    if (commentsData) {
      let filteredComments: Comment[] = []

      if (Array.isArray(commentsData)) {
        // postId가 일치하는 댓글만 필터링
        filteredComments = commentsData.filter((comment) => comment.postId === postId)
      }
      // commentsData가 객체이고 comments 속성을 가진 경우만 처리
      else if (commentsData && typeof commentsData === "object" && "comments" in commentsData) {
        // @ts-expect-error 타입 에러 무시하고 간단하게 처리
        const rawComments = Array.isArray(commentsData.comments) ? commentsData.comments : []
        filteredComments = rawComments.filter((comment: Comment) => comment.postId === postId)
      }

      setComments((prev) => ({
        ...prev,
        [postId]: filteredComments,
      }))
    }
  }, [commentsData, postId])

  return {
    comments,
  }
}
