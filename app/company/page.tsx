import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Award, Users, Target, Zap } from "lucide-react"

export default function CompanyPage() {
  return (
    <div className="container py-10">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Nossa Empresa</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transformando a gestão de projetos com tecnologia inovadora e foco na experiência do usuário.
          </p>
        </div>

        {/* About Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Sobre a COSTS</CardTitle>
            <CardDescription>Nossa história e missão</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="lg:w-2/3 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  A COSTS foi fundada em 2020 com uma visão clara: simplificar o gerenciamento de projetos e orçamentos
                  para empresas de todos os tamanhos. Nascemos da necessidade de ter uma ferramenta intuitiva, eficiente
                  e que realmente atendesse às demandas do mercado brasileiro.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Nossa plataforma foi desenvolvida por uma equipe experiente em gestão de projetos e tecnologia,
                  combinando as melhores práticas do mercado com uma interface moderna e funcional. Acreditamos que a
                  tecnologia deve facilitar o trabalho, não complicá-lo.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Hoje, atendemos centenas de empresas em todo o Brasil, desde startups até grandes corporações,
                  ajudando-as a manter seus projetos organizados, dentro do prazo e do orçamento.
                </p>
              </div>
              <div className="lg:w-1/3">
                <Image
                  src="/images/company-building.png"
                  alt="Escritório da COSTS"
                  width={400}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Nossos Valores</CardTitle>
            <CardDescription>Os princípios que guiam nosso trabalho diário</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Simplicidade</h3>
                <p className="text-sm text-muted-foreground">
                  Acreditamos que as melhores ferramentas são aquelas que são fáceis de usar e entender.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Eficiência</h3>
                <p className="text-sm text-muted-foreground">
                  Desenvolvemos soluções que otimizam processos e aumentam a produtividade das equipes.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Colaboração</h3>
                <p className="text-sm text-muted-foreground">
                  Facilitamos o trabalho em equipe e a comunicação entre todos os envolvidos no projeto.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Qualidade</h3>
                <p className="text-sm text-muted-foreground">
                  Mantemos os mais altos padrões de qualidade em tudo que desenvolvemos e entregamos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Nossa Equipe</CardTitle>
            <CardDescription>Conheça os profissionais que tornam a COSTS possível</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Ana Silva",
                  role: "CEO & Fundadora",
                  image: "/images/team-ana.png",
                  bio: "15 anos de experiência em gestão de projetos e empreendedorismo. Formada em Administração pela USP.",
                  skills: ["Gestão", "Estratégia", "Liderança"],
                },
                {
                  name: "Carlos Mendes",
                  role: "CTO",
                  image: "/images/team-carlos.png",
                  bio: "Especialista em desenvolvimento de software com foco em soluções escaláveis. Mestre em Ciência da Computação.",
                  skills: ["Tecnologia", "Arquitetura", "DevOps"],
                },
                {
                  name: "Juliana Costa",
                  role: "Head de Produto",
                  image: "/images/team-juliana.png",
                  bio: "Especialista em UX/UI e gestão de produtos digitais. Focada em criar experiências excepcionais para o usuário.",
                  skills: ["UX/UI", "Produto", "Design"],
                },
                {
                  name: "Roberto Santos",
                  role: "Head de Vendas",
                  image: "/images/team-roberto.png",
                  bio: "Profissional experiente em vendas B2B e relacionamento com clientes. Especialista em soluções empresariais.",
                  skills: ["Vendas", "Relacionamento", "Negócios"],
                },
                {
                  name: "Marina Oliveira",
                  role: "Head de Marketing",
                  image: "/images/team-marina.png",
                  bio: "Especialista em marketing digital e growth hacking. Focada em estratégias de crescimento sustentável.",
                  skills: ["Marketing", "Growth", "Conteúdo"],
                },
                {
                  name: "Pedro Lima",
                  role: "Lead Developer",
                  image: "/images/team-pedro.png",
                  bio: "Desenvolvedor full-stack com expertise em React, Node.js e arquiteturas modernas. Apaixonado por código limpo.",
                  skills: ["Frontend", "Backend", "Mobile"],
                },
              ].map((member, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="relative mx-auto w-32 h-32 overflow-hidden rounded-full">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{member.bio}</p>
                    <div className="flex flex-wrap justify-center gap-1 mt-3">
                      {member.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">COSTS em Números</CardTitle>
            <CardDescription>Nosso impacto no mercado brasileiro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <p className="text-sm text-muted-foreground">Empresas Atendidas</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                <p className="text-sm text-muted-foreground">Projetos Gerenciados</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">R$ 50M+</div>
                <p className="text-sm text-muted-foreground">Em Orçamentos Controlados</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <p className="text-sm text-muted-foreground">Uptime da Plataforma</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
