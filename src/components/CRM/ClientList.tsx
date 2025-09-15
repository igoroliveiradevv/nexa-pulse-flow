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
import { useState, useEffect } from "react";
import { NewClientDrawer } from "./NewClientDrawer";
import { supabase } from "@/integrations/supabase/client";

interface Client {
  id: string;
  nome_razao: string;
  cpf_cnpj?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  cep?: string;
  celular?: string;
  telefone_fixo?: string;
  whatsapp?: string;
  email?: string;
  linkedin?: string;
  instagram?: string;
  cargo?: string;
  empresa?: string;
  setor_atuacao?: string;
  tamanho_empresa?: string;
  origem_lead?: string;
  interacoes_anteriores?: string;
  status: string;
  value: number;
  last_contact?: string;
  created_at: string;
  updated_at: string;
}

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
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load clients from database
  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter(client =>
    client.nome_razao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.empresa && client.empresa.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      // Add activity
      await supabase
        .from('activities')
        .insert({
          type: 'client_deleted',
          entity_type: 'client',
          entity_id: clientId,
          description: 'Cliente excluído do CRM'
        });

      loadClients();
      toast({
        title: "Cliente removido",
        description: "Cliente foi excluído do CRM.",
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o cliente.",
        variant: "destructive"
      });
    }
  };

  const handleDuplicateClient = async (client: Client) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...client,
          id: undefined,
          nome_razao: `${client.nome_razao} (Cópia)`,
          created_at: undefined,
          updated_at: undefined
        })
        .select()
        .single();

      if (error) throw error;

      // Add activity
      await supabase
        .from('activities')
        .insert({
          type: 'client_added',
          entity_type: 'client',
          entity_id: data.id,
          description: `Cliente duplicado: ${data.nome_razao}`
        });

      loadClients();
      toast({
        title: "Cliente duplicado",
        description: `${client.nome_razao} foi duplicado no CRM.`,
      });
    } catch (error) {
      console.error('Error duplicating client:', error);
      toast({
        title: "Erro",
        description: "Não foi possível duplicar o cliente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">CRM de Clientes</h2>
          <p className="text-muted-foreground">Gerencie leads, prospects e clientes</p>
        </div>
        <NewClientDrawer onClientAdded={loadClients} />
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

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando clientes...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{client.nome_razao}</h3>
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
                        <span>{client.empresa || client.nome_razao}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{client.email || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{client.celular || client.whatsapp || client.telefone_fixo || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">R$ {client.value?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Último contato: {client.last_contact || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Criado em: {new Date(client.created_at).toLocaleDateString()}</span>
                      </div>
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
        
        {filteredClients.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
};