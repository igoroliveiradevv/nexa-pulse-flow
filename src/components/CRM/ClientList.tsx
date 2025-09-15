import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Building,
  DollarSign,
  Calendar,
  Edit2,
  Trash2,
  Copy
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { NewClientDrawer } from "./NewClientDrawer";

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "lead" | "prospect" | "client" | "inactive";
  value: number;
  lastContact: string;
  nextContact?: string;
}

const initialClients: Client[] = [];

const statusLabels = {
  lead: "Lead",
  prospect: "Prospect",
  client: "Cliente",
  inactive: "Inativo"
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "lead": return "bg-warning/10 text-warning border-warning/20";
    case "prospect": return "bg-primary/10 text-primary border-primary/20";
    case "client": return "bg-success/10 text-success border-success/20";
    case "inactive": return "bg-muted text-muted-foreground border-muted";
    default: return "bg-muted text-muted-foreground";
  }
};

export const ClientList = () => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
    toast({
      title: "Cliente removido",
      description: "Cliente foi excluído do CRM.",
    });
  };

  const handleDuplicateClient = (client: Client) => {
    const duplicated = {
      ...client,
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
      name: `${client.name} (Cópia)`,
    };
    setClients(prev => [...prev, duplicated]);
    toast({
      title: "Cliente duplicado",
      description: `${client.name} foi duplicado no CRM.`,
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">CRM de Clientes</h2>
          <p className="text-muted-foreground">Gerencie leads, prospects e clientes</p>
        </div>
        <NewClientDrawer onAdd={(client) => setClients(prev => [...prev, client])} />
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar clientes, empresas ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{client.name}</h3>
                    <Badge 
                      variant="outline"
                      className={getStatusColor(client.status)}
                    >
                      {statusLabels[client.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{client.company}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{client.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{client.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">R$ {client.value.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Último contato: {client.lastContact}</span>
                    </div>
                    
                    {client.nextContact && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Próximo contato: {client.nextContact}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditClient(client)}>
                    <Edit2 className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Gerar Cobrança
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDuplicateClient(client)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir cliente
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum cliente encontrado</p>
        </div>
      )}
    </div>
  );
};