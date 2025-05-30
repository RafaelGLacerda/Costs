"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { projectService } from "@/lib/services/project-service"
import type { Project, Service } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { ServiceForm } from "@/components/service-form"
import { ServiceList } from "@/components/service-list"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft, DollarSign, Package } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"

const budgetSchema = z.object({
  budget: z.string().refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), {
    message: "O orçamento deve ser um número válido.",
  }),
  completed: z.boolean(),
})

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [activeTab, setActiveTab] = useState("budget")
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      budget: "",
      completed: false,
    },
  })

  // Buscar projeto apenas uma vez
  useEffect(() => {
    if (!params.id || isInitialized) return

    const isNewProject = searchParams.get("created") === "true"
    let attempts = 0
    const maxAttempts = isNewProject ? 10 : 3

    const tryFetch = () => {
      attempts++
      const data = projectService.get(params.id)

      if (data) {
        setProject(data)
        setServices(data.services || [])

        // Inicializar form apenas uma vez
        form.reset({
          budget: data.budget > 0 ? String(data.budget) : "",
          completed: Boolean(data.completed),
        })

        setIsLoading(false)
        setIsInitialized(true)
      } else if (attempts < maxAttempts) {
        setTimeout(tryFetch, 100)
      } else {
        toast({
          title: "Erro",
          description: "Projeto não encontrado.",
          variant: "destructive",
        })
        router.push("/projects")
        setIsLoading(false)
      }
    }

    tryFetch()
  }, [params.id, searchParams, isInitialized]) // Removido form, router, toast das dependências

  function onSubmit(values: z.infer<typeof budgetSchema>) {
    if (!project) return

    try {
      setIsSubmitting(true)

      const budgetValue = values.budget === "" ? 0 : Number(values.budget)

      const updatedProject = {
        ...project,
        budget: budgetValue,
        completed: values.completed,
      }

      const result = projectService.update(updatedProject)
      setProject(result)

      toast({
        title: "Projeto atualizado",
        description: "As alterações foram salvas com sucesso!",
      })
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o projeto. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleServiceAdded(newService: Service) {
    if (!project) return

    const updatedServices = [...services, newService]
    setServices(updatedServices)

    const updatedProject = {
      ...project,
      services: updatedServices,
    }

    setProject(updatedProject)
  }

  function handleServiceRemoved(id: string) {
    if (!project) return

    const updatedServices = services.filter((service) => service.id !== id)
    setServices(updatedServices)

    const updatedProject = {
      ...project,
      services: updatedServices,
    }

    setProject(updatedProject)
  }

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Carregando projeto...</span>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Projeto não encontrado</h2>
          <p className="text-muted-foreground mb-4">O projeto que você está procurando não existe.</p>
          <Button onClick={() => router.push("/projects")}>Voltar para Projetos</Button>
        </div>
      </div>
    )
  }

  const totalSpent = services.reduce((acc, service) => acc + Number(service.cost), 0)
  const budgetUsed = project.budget > 0 ? (totalSpent / project.budget) * 100 : 0
  const remainingBudget = project.budget - totalSpent

  return (
    <AuthGuard>
      <div className="container py-10">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/projects")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Projetos
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <p className="text-muted-foreground mt-1">{project.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="capitalize">
                  {project.category}
                </Badge>
                <Badge variant={project.completed ? "default" : "secondary"}>
                  {project.completed ? "Concluído" : "Em andamento"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Overview */}
        {project.budget > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Resumo Orçamentário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Orçamento Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(project.budget)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Gasto</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Restante</p>
                  <p className={`text-2xl font-bold ${remainingBudget >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(remainingBudget)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Uso do Orçamento</span>
                  <span>{budgetUsed.toFixed(1)}%</span>
                </div>
                <Progress value={budgetUsed} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="budget">Orçamento</TabsTrigger>
                <TabsTrigger value="services">Serviços</TabsTrigger>
              </TabsList>

              <TabsContent value="budget">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Configurar Orçamento</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Defina o orçamento total disponível para este projeto.
                    </p>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Orçamento Total (R$)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Ex: 10000" step="0.01" min="0" {...field} />
                            </FormControl>
                            <FormDescription>Defina o valor total disponível para este projeto.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="completed"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Projeto Concluído</FormLabel>
                              <FormDescription>Marque esta opção quando o projeto estiver finalizado.</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} name={field.name} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Salvando..." : "Salvar Orçamento"}
                      </Button>
                    </form>
                  </Form>
                </div>
              </TabsContent>

              <TabsContent value="services">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Gerenciar Serviços
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Adicione serviços e custos ao seu projeto.</p>

                    {project.budget === 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          ⚠️ Defina um orçamento primeiro na aba "Orçamento" para controlar os gastos.
                        </p>
                      </div>
                    )}

                    <ServiceForm
                      projectId={project.id}
                      budget={Number(project.budget)}
                      cost={totalSpent}
                      onServiceAdded={handleServiceAdded}
                    />
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-md font-medium mb-4">Serviços Adicionados</h4>
                    <ServiceList services={services} onServiceRemoved={handleServiceRemoved} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
