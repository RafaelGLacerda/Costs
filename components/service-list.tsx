"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Service } from "@/lib/types"
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
import { projectService } from "@/lib/services/project-service"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"

interface ServiceListProps {
  services: Service[]
  onServiceRemoved: (id: string) => void
}

export function ServiceList({ services, onServiceRemoved }: ServiceListProps) {
  const [removingId, setRemovingId] = useState<string | null>(null)
  const { toast } = useToast()

  function handleRemoveService(id: string) {
    try {
      setRemovingId(id)
      projectService.removeService(id)
      onServiceRemoved(id)
      toast({
        title: "Serviço removido",
        description: "O serviço foi removido com sucesso.",
      })
    } catch (error) {
      console.error("Error removing service:", error)
      toast({
        title: "Erro",
        description: "Não foi possível remover o serviço.",
        variant: "destructive",
      })
    } finally {
      setRemovingId(null)
    }
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
        <p className="text-muted-foreground">Nenhum serviço adicionado ainda.</p>
        <p className="text-sm text-muted-foreground mt-1">Use o formulário acima para adicionar o primeiro serviço.</p>
      </div>
    )
  }

  const totalCost = services.reduce((acc, service) => acc + Number(service.cost), 0)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {services.length} serviço{services.length !== 1 ? "s" : ""} • Total: {formatCurrency(totalCost)}
        </p>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex-1">
                <CardTitle className="text-base font-medium">{service.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(Number(service.cost))}</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      disabled={removingId === service.id}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remover serviço</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover serviço?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. O serviço "{service.name}" será removido permanentemente do
                        projeto.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveService(service.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
