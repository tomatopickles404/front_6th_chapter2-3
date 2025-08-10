import { useState } from "react"

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDialog = () => {
    setIsOpen(!isOpen)
  }

  return {
    isOpen,
    toggleDialog,
  }
}
