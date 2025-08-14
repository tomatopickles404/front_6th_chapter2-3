import { useState } from "react"

export function useUserId() {
  const [userId, setUserId] = useState<number | null>(null)

  const updateUserId = (userId: number) => {
    setUserId(userId)
  }

  return { userId, updateUserId }
}
