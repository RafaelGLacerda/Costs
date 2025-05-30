import { Suspense } from "react"
import { ProjectList } from "@/components/project-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ProjectFilter } from "@/components/project-filter"
import { Skeleton } from "@/components/ui/skeleton"
import { AuthGuard } from "@/components/auth-guard"

export default function ProjectsPage() {
  return (
    <AuthGuard>
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
            <p className="text-muted-foreground">Gerencie todos os seus projetos em um só lugar.</p>
          </div>
          <div className="flex items-center gap-2">
            <ProjectFilter />
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Novo Projeto
              </Link>
            </Button>
          </div>
        </div>

        <Suspense fallback={<ProjectListSkeleton />}>
          <ProjectList />
        </Suspense>
      </div>
    </AuthGuard>
  )
}

function ProjectListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array(6)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between items-center pt-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
