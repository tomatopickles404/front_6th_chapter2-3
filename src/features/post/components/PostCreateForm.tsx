import { Button, Input, Textarea } from "shared/components"
import { usePostForm } from "../hooks/usePostForm"
import { PostFormData } from "./PostDialog"

export function PostCreateForm({ onSubmit }: { onSubmit: (data: PostFormData) => void }) {
  const { formData, updateField } = usePostForm()

  return (
    <div className="space-y-4">
      <Input placeholder="제목" value={formData.title} onChange={(e) => updateField("title", e.target.value)} />
      <Textarea
        rows={30}
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
      <Button onClick={() => onSubmit(formData)}>게시물 추가</Button>
    </div>
  )
}
