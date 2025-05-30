import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Plus, Shield, Zap } from "lucide-react"
import Link from "next/link"
import ProjectStats from "@/components/project-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center space-y-8">
            <div className="space-y-6 max-w-4xl">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Gerencie seus projetos com <span className="text-primary">facilidade</span>
              </h1>
              <p className="max-w-[800px] text-muted-foreground md:text-xl mx-auto">
                COSTS é um sistema simples para gerenciamento de projetos e orçamentos. Crie projetos, defina orçamentos
                e controle seus custos de forma prática.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/projects/new">
                <Button size="lg" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Projeto
                </Button>
              </Link>
              <Link href="/projects">
                <Button size="lg" variant="outline" className="gap-2">
                  Ver Projetos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Por que escolher o COSTS?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl">
                Nossa plataforma oferece tudo que você precisa para gerenciar seus projetos e orçamentos.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12">
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="rounded-full bg-primary/10 p-3 w-fit">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Controle de Orçamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Acompanhe seus gastos em tempo real e mantenha seus projetos sempre dentro do orçamento planejado.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="rounded-full bg-primary/10 p-3 w-fit">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Gestão de Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Adicione e gerencie serviços específicos para cada projeto com total flexibilidade e controle.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="rounded-full bg-primary/10 p-3 w-fit">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Interface Simples</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Design limpo e intuitivo que facilita o uso, sem complicações desnecessárias.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Seus Projetos</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl">Acompanhe o status dos seus projetos.</p>
            </div>
            <ProjectStats />
          </div>
        </div>
      </section>
    </div>
  )
}
