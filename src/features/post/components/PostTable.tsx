import { usePostsParams } from "../hooks"
import { useUsersQuery } from "features/user"
import { useDialog } from "shared/hooks"
import { useDeletePostMutation } from "../hooks"
import { useQueryClient } from "@tanstack/react-query"
import { POST_QUERY_KEY } from "../models/queries"
import { Post } from "entities/post"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, HighlightText, Button } from "shared/components"
import { ThumbsUp, ThumbsDown, MessageSquare, Edit2, Trash2 } from "lucide-react"
import { UserDialog, useUserId } from "features/user"

interface PostTableProps {
  posts: Post[]
}

export function PostTable({ posts }: PostTableProps) {
  const { params, updateParams } = usePostsParams()
  const { search, tag: selectedTag } = params

  const { isOpen: showUserModal, toggleDialog: toggleShowUserModal } = useDialog()
  const queryClient = useQueryClient()

  const { data: userData } = useUsersQuery()
  const { mutate: deletePost } = useDeletePostMutation()
  const { userId, updateUserId } = useUserId()

  const tableData = posts.map((post) => ({
    ...post,
    author: userData?.users.filter((user) => user.id === post.userId)[0],
  }))

  // 게시물 삭제
  const handleDeletePost = (id: number) => {
    deletePost(id, {
      onSuccess: (_, id) => {
        queryClient.removeQueries({ queryKey: POST_QUERY_KEY.detail(id) })
        queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY.all })
      },
    })
  }

  const handleShowUserModal = (userId: number) => {
    updateUserId(userId)
    toggleShowUserModal()
  }

  return (
    <>
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
          {tableData.map(({ id, title, tags, reactions, author }) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <HighlightText text={title} highlight={search} />
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                          selectedTag === tag
                            ? "text-white bg-blue-500 hover:bg-blue-600"
                            : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                        }`}
                        onClick={() => {
                          updateParams({ tag })
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => handleShowUserModal(author.id)}
                >
                  <img src={author.image} alt={author.username} className="w-8 h-8 rounded-full" />
                  <span>{author.username}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{reactions.likes || 0}</span>
                  <ThumbsDown className="w-4 h-4" />
                  <span>{reactions.dislikes || 0}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeletePost(id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 사용자 모달 */}
      {showUserModal && <UserDialog open={showUserModal} onOpenChange={toggleShowUserModal} userId={userId} />}
    </>
  )
}
