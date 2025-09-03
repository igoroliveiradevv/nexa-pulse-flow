import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  FileText, 
  BarChart3,
  Plus,
  ChevronDown
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tasks", label: "Gestão de Tarefas", icon: CheckSquare },
    { id: "crm", label: "CRM Clientes", icon: Users },
    { id: "contracts", label: "Contratos", icon: FileText },
    { id: "reports", label: "Relatórios", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-full flex flex-col">
      <div className="p-4">
        <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                activeTab === item.id && "bg-accent text-accent-foreground"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Áreas de Trabalho</span>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="mt-2 space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
            Tráfego Pago
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
            Desenvolvimento
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
            Design
          </Button>
        </div>
      </div>
    </aside>
  );
};