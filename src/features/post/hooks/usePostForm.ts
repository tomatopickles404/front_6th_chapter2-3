import { ChangeEvent, useState } from "react"

interface PostForm {
  id: number
  title: string
  body: string
  userId: number
}

const initialPost: PostForm = {
  id: 0,
  title: "",
  body: "",
  userId: 0,
}

export function usePostForm() {
  const [post, setPost] = useState<PostForm>(initialPost)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPost((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const resetPost = () => {
    setPost(initialPost)
  }

  return { post, handleChange, resetPost }
}
