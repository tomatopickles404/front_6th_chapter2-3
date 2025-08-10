import { forwardRef, HTMLAttributes } from "react"

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  className?: string
}

export const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={`table-fixed w-full caption-bottom text-sm ${className}`} {...props} />
  </div>
))
Table.displayName = "Table"

// 테이블 헤더 컴포넌트
interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(({ className, ...props }, ref) => (
  <thead ref={ref} className={`[&_tr]:border-b ${className}`} {...props} />
))
TableHeader.displayName = "TableHeader"

// 테이블 바디 컴포넌트
interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
))
TableBody.displayName = "TableBody"

// 테이블 로우 컴포넌트
interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  className?: string
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className}`}
    {...props}
  />
))
TableRow.displayName = "TableRow"

// 테이블 헤드 컴포넌트
interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {
  className?: string
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
))
TableHead.displayName = "TableHead"

// 테이블 셀 컴포넌트
interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  className?: string
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(({ className, ...props }, ref) => (
  <td ref={ref} className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />
))
TableCell.displayName = "TableCell"
