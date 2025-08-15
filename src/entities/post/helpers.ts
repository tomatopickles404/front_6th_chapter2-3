import { Post } from "./types"

// useUsersQuery에서 사용하는 User 타입과 일치
interface User {
  id: number
  username: string
  image: string
}

/**
 * Post와 User 데이터를 조합하여 author 정보를 포함한 Post 데이터를 생성
 */
export const mapPostsWithUsers = (posts: Post[], users: User[]) => {
  if (!users || users.length === 0) return []

  return posts.map((post) => ({
    ...post,
    author: users.find((user) => user.id === post.userId),
  }))
}

/**
 * Post의 태그에 대한 CSS 클래스명을 생성
 */
export const getPostTagClassName = (tag: string, selectedTag: string) => {
  const baseClasses = "px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer"

  if (selectedTag && selectedTag !== "all" && tag === selectedTag) {
    return `${baseClasses} text-white bg-blue-500 hover:bg-blue-600`
  } else {
    return `${baseClasses} text-blue-800 bg-blue-100 hover:bg-blue-200`
  }
}

/**
 * Post의 반응 상태를 기반으로 반응 수를 업데이트
 */
export const updatePostReaction = (post: Post, newReaction: "like" | "dislike" | null): Post => {
  const currentReaction = post.reactions.userReaction
  let newLikes = post.reactions.likes
  let newDislikes = post.reactions.dislikes

  // 이전 반응 제거
  if (currentReaction === "like") newLikes--
  if (currentReaction === "dislike") newDislikes--

  // 새로운 반응 추가
  if (newReaction === "like") newLikes++
  if (newReaction === "dislike") newDislikes++

  return {
    ...post,
    reactions: {
      ...post.reactions,
      likes: newLikes,
      dislikes: newDislikes,
      userReaction: newReaction,
    },
  }
}
