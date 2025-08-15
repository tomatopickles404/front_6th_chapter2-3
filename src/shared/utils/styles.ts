/**
 * 반응 버튼의 스타일 클래스를 생성
 */
export const getReactionButtonStyle = (isActive: boolean, reactionType: "like" | "dislike") => {
  const baseClasses = "flex items-center gap-1 px-2 py-1 rounded-md transition-colors"

  if (isActive) {
    return `${baseClasses} ${
      reactionType === "like"
        ? "bg-green-100 text-green-700 hover:bg-green-200"
        : "bg-red-100 text-red-700 hover:bg-red-200"
    }`
  }

  return `${baseClasses} bg-gray-100 text-gray-600 hover:bg-gray-200`
}

/**
 * 상태에 따른 버튼 비활성화 여부를 결정
 */
export const getButtonDisabledState = (isLoading: boolean, isDisabled?: boolean) => {
  return isLoading || isDisabled || false
}
