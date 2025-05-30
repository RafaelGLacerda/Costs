"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function DebugPage() {
  const [usersData, setUsersData] = useState<string>("Carregando...")
  const [sessionData, setSessionData] = useState<string>("Carregando...")
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const users = localStorage.getItem("costs_users") || "Nenhum usuário encontrado"
      const session = localStorage.getItem("costs_session") || "Nenhuma sessão encontrada"

      try {
        setUsersData(JSON.stringify(JSON.parse(users), null, 2))
      } catch (e) {
        setUsersData(users)
      }

      try {
        setSessionData(JSON.stringify(JSON.parse(session), null, 2))
      } catch (e) {
        setSessionData(session)
      }
    }
  }, [])

  const handleClearUsers = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("costs_users")
      setUsersData("Nenhum usuário encontrado")
      toast({
        title: "Dados limpos",
        description: "Todos os usuários foram removidos.",
      })
    }
  }

  const handleClearSession = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("costs_session")
      setSessionData("Nenhuma sessão encontrada")
      toast({
        title: "Sessão limpa",
        description: "A sessão atual foi removida.",
      })
    }
  }

  const handleRefresh = () => {
    if (typeof window !== "undefined") {
      const users = localStorage.getItem("costs_users") || "Nenhum usuário encontrado"
      const session = localStorage.getItem("costs_session") || "Nenhuma sessão encontrada"

      try {
        setUsersData(JSON.stringify(JSON.parse(users), null, 2))
      } catch (e) {
        setUsersData(users)
      }

      try {
        setSessionData(JSON.stringify(JSON.parse(session), null, 2))
      } catch (e) {
        setSessionData(session)
      }

      toast({
        title: "Dados atualizados",
        description: "Os dados foram atualizados.",
      })
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Página de Debug</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Usuários Cadastrados</CardTitle>
            <CardDescription>Dados armazenados em localStorage["costs_users"]</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96 text-xs">{usersData}</pre>
            <Button variant="destructive" className="mt-4" onClick={handleClearUsers}>
              Limpar Usuários
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sessão Atual</CardTitle>
            <CardDescription>Dados armazenados em localStorage["costs_session"]</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96 text-xs">{sessionData}</pre>
            <Button variant="destructive" className="mt-4" onClick={handleClearSession}>
              Limpar Sessão
            </Button>
          </CardContent>
        </Card>
      </div>

      <Button className="mt-6" onClick={handleRefresh}>
        Atualizar Dados
      </Button>
    </div>
  )
}
