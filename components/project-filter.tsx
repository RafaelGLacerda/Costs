"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProjectFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentFilter = searchParams.get("filter") || "all"

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams)

    if (value === "all") {
      params.delete("filter")
    } else {
      params.set("filter", value)
    }

    router.push(`/projects?${params.toString()}`)
  }

  return (
    <Select value={currentFilter} onValueChange={handleFilterChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrar projetos" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos os projetos</SelectItem>
        <SelectItem value="in-progress">Em andamento</SelectItem>
        <SelectItem value="completed">Concluídos</SelectItem>
      </SelectContent>
    </Select>
  )
}
