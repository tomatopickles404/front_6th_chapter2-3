import { useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"

type ResultType = Record<string, string | number | boolean>

const parseParamsFromURL = <T extends Record<string, string | number | boolean>>(
  location: { search: string },
  defaultValues: T,
): T => {
  const urlParams = new URLSearchParams(location.search)
  const result = { ...defaultValues }

  Object.entries(defaultValues)
    .map(([key, defaultValue]) => {
      const urlValue = urlParams.get(key)
      return urlValue === null ? null : { key, defaultValue, urlValue }
    })
    .filter(
      (entry): entry is { key: string; defaultValue: string | number | boolean; urlValue: string } => entry !== null,
    )
    .forEach(({ key, defaultValue, urlValue }) => {
      const isNumber = typeof defaultValue === "number"
      const isBoolean = typeof defaultValue === "boolean"

      const parsedValue = isNumber ? Number(urlValue) : isBoolean ? urlValue === "true" : urlValue

      ;(result as ResultType)[key] = parsedValue
    })

  return result as T
}

export function useQueryParams<T extends Record<string, string | number | boolean>>(
  defaultValues: T,
  options?: { excludeDefaults?: boolean },
) {
  const navigate = useNavigate()
  const location = useLocation()

  const params = parseParamsFromURL(location, defaultValues)

  const updateParams = useCallback(
    (updates: Partial<T>) => {
      const newParams = { ...params, ...updates }
      const urlParams = new URLSearchParams()

      Object.entries(newParams).forEach(([key, value]) => {
        const shouldInclude = options?.excludeDefaults
          ? value !== defaultValues[key] && value !== "" && value !== null && value !== 0
          : value !== "" && value !== null

        if (shouldInclude) {
          urlParams.set(key, String(value))
        }
      })

      navigate(`?${urlParams.toString()}`, { replace: true })
    },
    [params, navigate, defaultValues, options],
  )

  return { params, updateParams }
}
