import { Button, Input, Textarea } from "shared/components"
import { usePostForm } from "../hooks/usePostForm"
import { PostFormData } from "./PostDialog"
import { Post } from "entities/post"

export function PostEditForm({ post, onSubmit }: { post: Post; onSubmit: (data: PostFormData) => void }) {
  const { formData, updateField } = usePostForm(post)

  return (
    <div className="space-y-4">
      <Input placeholder="제목" value={formData.title} onChange={(e) => updateField("title", e.target.value)} />
      <Textarea
        rows={15}
        placeholder="내용"
        value={formData.body}
        onChange={(e) => updateField("body", e.target.value)}
      />
      <Input
        type="number"
        placeholder="사용자 ID"
        value={formData.userId}
        onChange={(e) => updateField("userId", Number(e.target.value))}
      />
      <Button onClick={() => onSubmit(formData)}>게시물 수정</Button>
    </div>
  )
}
