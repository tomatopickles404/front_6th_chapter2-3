import { api } from "shared/utils/http"
import { COMMENT_API_PATH } from "entities/comment"

export const fetchComments = async (postId: number) => {
  return api.get(COMMENT_API_PATH.comments, { params: { postId } })
}

export const createComment = async (comment: { body: string; postId: number; userId: number }) => {
  return api.post(COMMENT_API_PATH.comments, comment)
}

export const updateComment = async (id: number, body: string) => {
  return api.put(COMMENT_API_PATH.id(id), { body })
}

export const deleteComment = async (id: number) => {
  return api.delete(COMMENT_API_PATH.id(id))
}

export const likeComment = async (id: number, likes: number) => {
  return api.patch(COMMENT_API_PATH.id(id), { likes })
}
