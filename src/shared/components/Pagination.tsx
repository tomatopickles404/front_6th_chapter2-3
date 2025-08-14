import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components"
import { Button } from "shared/components"

interface PaginationProps {
  params: {
    skip: number
    limit: number
  }
  updateParams: (params: { skip: number; limit: number }) => void
  total: number
}

export function Pagination({ params, updateParams, total }: PaginationProps) {
  const { skip, limit } = params

  const currentPage = Math.floor(skip / limit) + 1
  const isDisabledPrev = skip === 0
  const isDisabledNext = skip + limit >= total

  const handlePageChange = (newPage: number) => {
    const newSkip = (newPage - 1) * limit
    updateParams({ skip: Math.max(0, newSkip), limit })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    updateParams({ limit: newPageSize, skip: 0 })
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value) => handlePageSizeChange(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={isDisabledPrev} onClick={() => handlePageChange(currentPage - 1)}>
          이전
        </Button>
        <Button disabled={isDisabledNext} onClick={() => handlePageChange(currentPage + 1)}>
          다음
        </Button>
      </div>
    </div>
  )
}
