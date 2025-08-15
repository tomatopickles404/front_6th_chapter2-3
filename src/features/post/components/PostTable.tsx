import { Post } from "entities/post"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "shared/components"
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { useUsersQuery } from "features/user"
import { HighlightText } from "shared/components/HighlightText"
import { useMemo, useEffect } from "react"
import { usePostReaction } from "../hooks/usePostReaction"
import { mapPostsWithUsers, getPostTagClassName } from "entities/post/helpers"
import { getReactionButtonStyle } from "shared/utils/styles"

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
  const { localPosts, updateReaction, syncPosts, isUpdating } = usePostReaction(posts)

  useEffect(() => {
    syncPosts(posts)
  }, [posts, syncPosts])

  const tableData = useMemo(() => {
    return mapPostsWithUsers(localPosts, usersData?.users ?? [])
  }, [localPosts, usersData?.users])

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
    updateReaction(postId, currentReaction, newReaction)
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
            <TableHead className="w-[200px]">반응</TableHead>
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
                      <span
                        key={tag}
                        className={getPostTagClassName(tag, selectedTag)}
                        onClick={() => handleTagClick(tag)}
                      >
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
                    disabled={isUpdating}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{reactions.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={getReactionButtonStyle(reactions.userReaction === "dislike", "dislike")}
                    onClick={() => handleReactionClick(id, reactions.userReaction || null, "dislike")}
                    disabled={isUpdating}
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
