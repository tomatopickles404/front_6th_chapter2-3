import { Post } from "entities/post"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "shared/components"
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { useUsersQuery } from "features/user"

interface PostTableProps {
  posts: Post[]
  onViewPost: (id: number) => void
  onEditPost: (post: { id: number; title: string; body: string }) => void
  onViewUser: (userId: number) => void
  onDeletePost: (id: number) => void
}

export function PostTable({ posts, onViewPost, onEditPost, onViewUser, onDeletePost }: PostTableProps) {
  const { data: usersData } = useUsersQuery()

  const tableData = posts.map((post) => ({
    ...post,
    author: usersData.users.filter((user) => user.id === post.userId)[0],
  }))

  return (
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
                <div>{title}</div>
                <div className="flex flex-wrap gap-1">
                  {tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-1 text-[9px] font-semibold rounded-[4px] text-blue-800 bg-blue-100 hover:bg-blue-200 cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onViewUser(id)}>
                <img src={author.image} alt={author.username} className="w-8 h-8 rounded-full" />
                <span>{author.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{reactions.likes}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{reactions.dislikes}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => onViewPost(id)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEditPost({ id, title, body })}>
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
  )
}
