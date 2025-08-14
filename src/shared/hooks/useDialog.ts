import { useState } from "react"

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDialog = () => {
    setIsOpen((prev) => !prev)
  }

  return {
    isOpen,
    toggleDialog,
  }
}
