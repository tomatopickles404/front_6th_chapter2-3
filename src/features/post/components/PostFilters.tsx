import { Search } from "lucide-react"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components"
import { usePostsParams } from "features/post"
import { useTagsQuery } from "features/tag"

export function PostFilters() {
  const { params, updateParams } = usePostsParams()
  const { search, sortBy, sortOrder, tag: selectedTag } = params
  const { data: tags, isLoading, error } = useTagsQuery() // 에러 상태 추가

  return (
    <div className="flex gap-4">
      <SearchFilter value={search} onChange={(value) => updateParams({ search: value })} />
      <TagFilter
        value={selectedTag}
        options={tags || []} // 에러 시 빈 배열 사용
        onChange={(value) => updateParams({ tag: value })}
        isLoading={isLoading} // 로딩 상태 전달
        error={error} // 에러 상태 전달
      />
      <SortByFilter value={sortBy} onChange={(value) => updateParams({ sortBy: value })} />
      <SortOrderFilter value={sortOrder} onChange={(value) => updateParams({ sortOrder: value })} />
    </div>
  )
}

// 검색 필터
function SearchFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="게시물 검색..." className="pl-8" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  )
}

function TagFilter({
  value,
  options,
  onChange,
  isLoading,
  error,
}: {
  value: string
  options?: Array<{ url: string; slug: string }>
  onChange: (value: string) => void
  isLoading?: boolean
  error?: unknown
}) {
  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 로딩 중..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="loading">로딩 중...</SelectItem>
        </SelectContent>
      </Select>
    )
  }

  if (error) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 로드 실패" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="error">태그 로드 실패</SelectItem>
        </SelectContent>
      </Select>
    )
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="태그 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">모든 태그</SelectItem>
        {options?.map((tag) => (
          <SelectItem key={tag.url} value={tag.slug}>
            {tag.slug}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// 정렬 기준 필터
function SortByFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const sortOptions = [
    { value: "none", label: "없음" },
    { value: "id", label: "ID" },
    { value: "title", label: "제목" },
    { value: "reactions", label: "반응" },
  ]

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="정렬 기준" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// 정렬 순서 필터
function SortOrderFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="정렬 순서" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="asc">오름차순</SelectItem>
        <SelectItem value="desc">내림차순</SelectItem>
      </SelectContent>
    </Select>
  )
}
