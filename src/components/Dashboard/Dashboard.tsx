import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  CheckSquare, 
  FileText, 
  DollarSign,
  TrendingUp,
  Calendar,
  Clock
} from "lucide-react";

export const Dashboard = () => {
  const stats = [
    {
      title: "Clientes Ativos",
      value: "24",
      change: "+12%",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Tarefas Pendentes",
      value: "18",
      change: "-5%",
      icon: CheckSquare,
      color: "text-warning"
    },
    {
      title: "Contratos Assinados",
      value: "8",
      change: "+25%",
      icon: FileText,
      color: "text-success"
    },
    {
      title: "Receita Mensal",
      value: "R$ 42.800",
      change: "+18%",
      icon: DollarSign,
      color: "text-success"
    }
  ];

  const recentTasks = [
    { id: 1, title: "Campanha Facebook - CMYK", status: "working", dueDate: "Hoje" },
    { id: 2, title: "Relatório Mensal - Cliente XYZ", status: "ready", dueDate: "Amanhã" },
    { id: 3, title: "Setup Google Ads - Novo Cliente", status: "done", dueDate: "Ontem" },
  ];

  const recentClients = [
    { id: 1, name: "CMYK Impressão Digital", status: "client", value: "R$ 1.700" },
    { id: 2, name: "Tech Solutions", status: "prospect", value: "R$ 2.500" },
    { id: 3, name: "Inovação Digital", status: "client", value: "R$ 3.000" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral das operações da Nexa</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-xs ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                      {stat.change} do mês anterior
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tarefas Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Tarefas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={
                        task.status === "working" ? "bg-warning/10 text-warning border-warning/20" :
                        task.status === "ready" ? "bg-success/10 text-success border-success/20" :
                        "bg-success/20 text-success border-success/30"
                      }
                    >
                      {task.status === "working" ? "Trabalhando" : 
                       task.status === "ready" ? "Pronto" : "Concluído"}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Clientes Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Clientes Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentClients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{client.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline"
                      className={
                        client.status === "client" ? "bg-success/10 text-success border-success/20" :
                        "bg-primary/10 text-primary border-primary/20"
                      }
                    >
                      {client.status === "client" ? "Cliente" : "Prospect"}
                    </Badge>
                    <span className="text-sm font-medium text-success">{client.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Atividade Recente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Novo cliente adicionado: CMYK Impressão Digital</p>
                <p className="text-xs text-muted-foreground">Há 2 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Tarefa concluída: Setup Google Ads - Novo Cliente</p>
                <p className="text-xs text-muted-foreground">Há 4 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Contrato enviado para assinatura: Tech Solutions</p>
                <p className="text-xs text-muted-foreground">Há 6 horas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};