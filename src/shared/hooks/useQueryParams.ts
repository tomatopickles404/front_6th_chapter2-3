import { useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"

const parseParamsFromURL = <T extends Record<string, string | number | boolean>>(
  location: { search: string },
  defaultValues: T,
): T => {
  const urlParams = new URLSearchParams(location.search)
  const result = { ...defaultValues }

  for (const [key, defaultValue] of Object.entries(defaultValues)) {
    const urlValue = urlParams.get(key)
    if (urlValue === null) continue
    ;(result as Record<string, string | number | boolean>)[key] =
      typeof defaultValue === "number"
        ? parseInt(urlValue)
        : typeof defaultValue === "boolean"
          ? urlValue === "true"
          : urlValue
  }

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
