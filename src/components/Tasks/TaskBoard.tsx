import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Plus, Calendar, Flag } from "lucide-react";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  status: "ready" | "working" | "done" | "stuck";
  priority: "high" | "medium" | "low";
  assignee: string;
  dueDate: string;
  project: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Campanha Facebook - CMYK",
    status: "working",
    priority: "high",
    assignee: "RO",
    dueDate: "2025-01-15",
    project: "Tráfego Shows: CMYK"
  },
  {
    id: "2",
    title: "Relatório Mensal - Cliente XYZ",
    status: "ready",
    priority: "medium",
    assignee: "JS",
    dueDate: "2025-01-20",
    project: "Relatórios"
  },
  {
    id: "3",
    title: "Setup Google Ads - Novo Cliente",
    status: "done",
    priority: "high",
    assignee: "MK",
    dueDate: "2025-01-10",
    project: "Tráfego Shows: Novo"
  },
  {
    id: "4",
    title: "Análise de Performance Q4",
    status: "stuck",
    priority: "low",
    assignee: "AL",
    dueDate: "2025-01-25",
    project: "Análises"
  }
];

const statusLabels = {
  ready: "Pronto para Subir",
  working: "Trabalhando",
  done: "Pronto",
  stuck: "Travado"
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ready": return "bg-success/10 text-success border-success/20";
    case "working": return "bg-warning/10 text-warning border-warning/20";
    case "done": return "bg-success/20 text-success border-success/30";
    case "stuck": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted text-muted-foreground";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "text-destructive";
    case "medium": return "text-warning";
    case "low": return "text-success";
    default: return "text-muted-foreground";
  }
};

export const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Gestão de Tarefas</h2>
          <p className="text-muted-foreground">Gerencie projetos e tarefas da equipe</p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover">
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {Object.entries(statusLabels).map(([status, label]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground">{label}</h3>
              <span className="text-sm text-muted-foreground">
                {groupedTasks[status]?.length || 0}
              </span>
            </div>
            
            <div className="space-y-3">
              {groupedTasks[status]?.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-3">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(task.status)}`}
                    >
                      {statusLabels[task.status as keyof typeof statusLabels]}
                    </Badge>
                    
                    <div className="text-xs text-muted-foreground">
                      {task.project}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Flag className={`h-3 w-3 ${getPriorityColor(task.priority)}`} />
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {task.assignee}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                variant="ghost" 
                className="w-full border-2 border-dashed border-muted-foreground/30 h-20 text-muted-foreground hover:border-primary hover:text-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};