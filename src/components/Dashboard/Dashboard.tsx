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
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Dashboard = () => {
  const [clientCount, setClientCount] = useState(0);
  const [recentClients, setRecentClients] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const stats = [
    {
      title: "Clientes Ativos",
      value: clientCount.toString(),
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

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Get client count
        const { count: clientCountData } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true });
        
        setClientCount(clientCountData || 0);

        // Get recent clients
        const { data: clientsData } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        setRecentClients(clientsData || []);

        // Get recent activities
        const { data: activitiesData } = await supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentActivities(activitiesData || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

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
                  <p className="font-medium text-sm">{client.nome_razao}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline"
                      className={
                        client.status === "client" ? "bg-success/10 text-success border-success/20" :
                        client.status === "prospect" ? "bg-primary/10 text-primary border-primary/20" :
                        "bg-warning/10 text-warning border-warning/20"
                      }
                    >
                      {client.status === "client" ? "Cliente" : 
                       client.status === "prospect" ? "Prospect" : "Lead"}
                    </Badge>
                    <span className="text-sm font-medium text-success">R$ {client.value?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
            ))}
            {recentClients.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum cliente cadastrado ainda
              </p>
            )}
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
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'client_added' ? 'bg-primary' :
                  activity.type === 'client_deleted' ? 'bg-destructive' :
                  activity.type === 'client_updated' ? 'bg-warning' :
                  'bg-success'
                }`}></div>
                <div>
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.created_at).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma atividade recente
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};