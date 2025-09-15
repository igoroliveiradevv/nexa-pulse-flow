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
  Calendar
} from "lucide-react";
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

const mockClients: Client[] = [
  {
    id: "1",
    name: "CMYK Impressão Digital",
    company: "CMYK IMPRESSÃO DIGITAL LTDA",
    email: "contato@cmyk.com.br",
    phone: "(62) 99999-9999",
    status: "client",
    value: 1700,
    lastContact: "2025-01-03",
    nextContact: "2025-02-03"
  },
  {
    id: "2",
    name: "João Silva",
    company: "Empresa ABC Ltda",
    email: "joao@empresaabc.com",
    phone: "(11) 98888-8888",
    status: "prospect",
    value: 2500,
    lastContact: "2024-12-15",
    nextContact: "2025-01-15"
  },
  {
    id: "3",
    name: "Maria Santos",
    company: "Tech Solutions",
    email: "maria@techsolutions.com",
    phone: "(21) 97777-7777",
    status: "lead",
    value: 1200,
    lastContact: "2024-12-20",
  },
  {
    id: "4",
    name: "Carlos Oliveira",
    company: "Inovação Digital",
    email: "carlos@inovacao.com",
    phone: "(85) 96666-6666",
    status: "client",
    value: 3000,
    lastContact: "2024-12-28",
    nextContact: "2025-01-28"
  }
];

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
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    Gerar Cobrança
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
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