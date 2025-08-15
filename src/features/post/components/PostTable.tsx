import { Post } from "entities/post"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "shared/components"
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { useUsersQuery } from "features/user"
import { HighlightText } from "shared/components/HighlightText"
import { useUpdatePostReactionMutation } from "../hooks/useUpdatePostReactionMutation"
import { useMemo, useState, useEffect } from "react"

interface PostTableProps {
  posts: Post[]
  selectedTag: string
  searchQuery: string
  onViewPost: (id: number) => void
  onEditPost: (post: Post) => void
  onViewUser: (user: { id: number; username: string; image: string }) => void
  onDeletePost: (id: number) => void
  onTagClick: (tag: string) => void
}

export function PostTable({
  posts,
  selectedTag,
  searchQuery = "",
  onViewPost,
  onEditPost,
  onViewUser,
  onDeletePost,
  onTagClick,
}: PostTableProps) {
  const { data: usersData } = useUsersQuery()
  const { mutate: updateReaction } = useUpdatePostReactionMutation()

  const [localPosts, setLocalPosts] = useState<Post[]>(posts)

  useEffect(() => {
    setLocalPosts(posts)
  }, [posts])

  const tableData = useMemo(() => {
    if (!usersData?.users) return []

    return localPosts.map((post) => ({
      ...post,
      author: usersData.users.find((user) => user.id === post.userId),
    }))
  }, [localPosts, usersData?.users])

  const getTagClassName = (tag: string) => {
    const baseClasses = "px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer"

    if (selectedTag && selectedTag !== "all" && tag === selectedTag) {
      return `${baseClasses} text-white bg-blue-500 hover:bg-blue-600`
    } else {
      return `${baseClasses} text-blue-800 bg-blue-100 hover:bg-blue-200`
    }
  }

  const handleTagClick = (tag: string) => {
    if (onTagClick) {
      onTagClick(tag)
    }
  }

  const handleReactionClick = (
    postId: number,
    currentReaction: "like" | "dislike" | null,
    newReaction: "like" | "dislike",
  ) => {
    // 같은 반응을 다시 클릭하면 반응 제거
    const finalReaction = currentReaction === newReaction ? null : newReaction

    // 즉시 로컬 상태 업데이트 (낙관적 업데이트)
    setLocalPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const currentUserReaction = post.reactions.userReaction
          let newLikes = post.reactions.likes
          let newDislikes = post.reactions.dislikes

          // 이전 반응 제거
          if (currentUserReaction === "like") newLikes--
          if (currentUserReaction === "dislike") newDislikes--

          // 새로운 반응 추가
          if (finalReaction === "like") newLikes++
          if (finalReaction === "dislike") newDislikes++

          return {
            ...post,
            reactions: {
              ...post.reactions,
              likes: newLikes,
              dislikes: newDislikes,
              userReaction: finalReaction,
            },
          }
        }
        return post
      }),
    )

    // API 호출 (백그라운드에서 실행)
    updateReaction({
      postId,
      reaction: finalReaction,
    })
  }

  const getReactionButtonStyle = (isActive: boolean, reactionType: "like" | "dislike") => {
    const baseClasses = "flex items-center gap-1 px-2 py-1 rounded-md transition-colors"

    if (isActive) {
      return `${baseClasses} ${
        reactionType === "like"
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-red-100 text-red-700 hover:bg-red-200"
      }`
    }

    return `${baseClasses} bg-gray-100 text-gray-600 hover:bg-gray-200`
  }

  // 필터링 결과가 없을 때
  if (localPosts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</div>
        <div className="text-sm text-gray-500">
          {searchQuery && `"${searchQuery}"에 대한 검색 결과가 없습니다.`}
          {selectedTag && selectedTag !== "all" && `"${selectedTag}" 태그에 해당하는 게시물이 없습니다.`}
          {!searchQuery && selectedTag === "all" && "게시물이 없습니다."}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-[150px]">작성자</TableHead>
            <TableHead className="w-[150px]">반응</TableHead>
            <TableHead className="w-[150px]">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map(({ id, title, body, tags, author, reactions }) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  {/* 제목에 HighlightText 적용 */}
                  <div className="font-medium">
                    <HighlightText text={title} highlight={searchQuery} />
                  </div>

                  {/* 태그들에도 HighlightText 적용 */}
                  <div className="flex flex-wrap gap-1">
                    {tags?.map((tag) => (
                      <span key={tag} className={getTagClassName(tag)} onClick={() => handleTagClick(tag)}>
                        <HighlightText text={tag} highlight={searchQuery} />
                      </span>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => onViewUser(author || { id: 0, username: "", image: "" })}
                >
                  <img src={author?.image} alt={author?.username} className="w-8 h-8 rounded-full" />
                  <span>{author?.username}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={getReactionButtonStyle(reactions.userReaction === "like", "like")}
                    onClick={() => handleReactionClick(id, reactions.userReaction || null, "like")}
                    disabled={false}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{reactions.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={getReactionButtonStyle(reactions.userReaction === "dislike", "dislike")}
                    onClick={() => handleReactionClick(id, reactions.userReaction || null, "dislike")}
                    disabled={false}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>{reactions.dislikes}</span>
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onViewPost(id)}>
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onEditPost({
                        id,
                        title,
                        body,
                        author,
                        tags,
                        userId: author?.id,
                        reactions,
                      })
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDeletePost(id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
