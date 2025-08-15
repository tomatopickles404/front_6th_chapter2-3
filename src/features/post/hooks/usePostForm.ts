import { useState } from "react"
import { Post } from "entities/post"
import { PostFormData } from "../models"

export function usePostForm(initialPost?: Post) {
  const [formData, setFormData] = useState<PostFormData>(() =>
    initialPost
      ? {
          title: initialPost.title,
          body: initialPost.body,
          userId: initialPost.userId || 1, // 기본값 제공
        }
      : {
          title: "",
          body: "",
          userId: 1,
        },
  )

  const updateField = (field: keyof PostFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({ title: "", body: "", userId: 1 })
  }

  return { formData, updateField, resetForm }
}
