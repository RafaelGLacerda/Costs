"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Plus } from "lucide-react"
import { projectService } from "@/lib/services/project-service"
import type { Service } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "O nome do serviço deve ter pelo menos 3 caracteres.",
  }),
  cost: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "O custo deve ser um número maior que zero.",
  }),
  description: z.string().min(5, {
    message: "A descrição deve ter pelo menos 5 caracteres.",
  }),
})

interface ServiceFormProps {
  projectId: string
  budget: number
  cost: number
  onServiceAdded: (service: Service) => void
}

export function ServiceForm({ projectId, budget, cost, onServiceAdded }: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cost: "",
      description: "",
    },
  })

  const availableBudget = budget - cost

  function onSubmit(values: z.infer<typeof formSchema>) {
    const serviceCost = Number(values.cost)

    // Só valida orçamento se foi definido
    if (budget > 0 && serviceCost > availableBudget) {
      toast({
        title: "Orçamento excedido",
        description: "O custo do serviço excede o orçamento disponível.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const newService = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: values.name,
        cost: serviceCost,
        description: values.description,
      }

      const result = projectService.addService(projectId, newService)
      onServiceAdded(result)

      form.reset()

      toast({
        title: "Serviço adicionado",
        description: "O serviço foi adicionado ao projeto com sucesso!",
      })
    } catch (error) {
      console.error("Error adding service:", error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o serviço. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {budget > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Orçamento disponível</AlertTitle>
          <AlertDescription>
            {formatCurrency(availableBudget)} de {formatCurrency(budget)}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Serviço</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Design do logo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custo (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 500" step="0.01" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição do Serviço</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva o que será feito neste serviço..."
                    className="resize-none min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Explique brevemente o que está incluído neste serviço.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {isSubmitting ? "Adicionando..." : "Adicionar Serviço"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
