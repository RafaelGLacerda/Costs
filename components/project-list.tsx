"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { projectService } from "@/lib/services/project-service"
import type { Project } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const filter = searchParams.get("filter")
  const { toast } = useToast()

  useEffect(() => {
    const fetchProjects = () => {
      try {
        setLoading(true)
        const data = projectService.getAll()

        let filteredProjects = [...data]

        if (filter === "in-progress") {
          filteredProjects = data.filter((project) => !project.completed)
        } else if (filter === "completed") {
          filteredProjects = data.filter((project) => project.completed)
        }

        setProjects(filteredProjects)
      } catch (error) {
        console.error("Error fetching projects:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os projetos.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [filter, toast])

  const handleDelete = (id: string) => {
    try {
      projectService.remove(id)
      setProjects(projects.filter((project) => project.id !== id))
      toast({
        title: "Projeto removido",
        description: "O projeto foi removido com sucesso.",
      })
    } catch (error) {
      console.error("Error removing project:", error)
      toast({
        title: "Erro",
        description: "Não foi possível remover o projeto.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <p>Carregando projetos...</p>
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold mb-2">Nenhum projeto encontrado</h3>
        <p className="text-muted-foreground mb-6">
          {filter ? "Não há projetos com o filtro selecionado." : "Comece criando seu primeiro projeto!"}
        </p>
        <Button asChild>
          <Link href="/projects/new">Criar Projeto</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const totalSpent = project.services?.reduce((acc, service) => acc + Number(service.cost), 0) || 0
        const budgetUsed = project.budget > 0 ? (totalSpent / project.budget) * 100 : 0

        return (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="line-clamp-2">{project.name}</CardTitle>
                <Badge variant={project.completed ? "default" : "outline"}>
                  {project.completed ? "Concluído" : "Em andamento"}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              <Badge variant="secondary" className="w-fit capitalize">
                {project.category}
              </Badge>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="space-y-3">
                {project.budget > 0 ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Orçamento:</span>
                      <span className="font-medium">{formatCurrency(project.budget)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gasto:</span>
                      <span className="font-medium">{formatCurrency(totalSpent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Restante:</span>
                      <span
                        className={`font-medium ${project.budget - totalSpent >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {formatCurrency(project.budget - totalSpent)}
                      </span>
                    </div>
                    <Progress value={budgetUsed} className="h-2" />
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">Orçamento não definido</p>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Serviços:</span>
                  <span className="font-medium">{project.services?.length || 0}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/projects/${project.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir projeto?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente o projeto "{project.name}" e todos
                      os seus serviços.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(project.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
