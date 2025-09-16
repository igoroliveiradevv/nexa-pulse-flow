import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  nomeRazao: z.string().min(2, "Informe o nome ou razão social"),
  cpfCnpj: z.string().min(11, "Informe CPF ou CNPJ"),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  pais: z.string().optional(),
  cep: z.string().optional(),

  celular: z.string().optional(),
  telefoneFixo: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("E-mail inválido"),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),

  cargo: z.string().optional(),
  empresa: z.string().optional(),
  setorAtuacao: z.string().min(2, "Informe o setor de atuação"),
  tamanhoEmpresa: z.string().optional(),

  origemLead: z.string().min(2, "Informe a origem do lead"),
  interacoesAnteriores: z.string().optional(),
});

export type NewClientFormValues = z.infer<typeof FormSchema>;

type Props = {
  onAdd?: (client: any) => void;
  onClientAdded?: () => void;
};

export function NewClientDrawer({ onAdd, onClientAdded }: Props) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<NewClientFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nomeRazao: "",
      cpfCnpj: "",
      endereco: "",
      cidade: "",
      estado: "",
      pais: "",
      cep: "",
      celular: "",
      telefoneFixo: "",
      whatsapp: "",
      email: "",
      linkedin: "",
      instagram: "",
      cargo: "",
      empresa: "",
      setorAtuacao: "",
      tamanhoEmpresa: "",
      origemLead: "",
      interacoesAnteriores: "",
    },
  });

  async function onSubmit(values: NewClientFormValues) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Autenticação necessária",
          description: "Faça login para adicionar clientes ao CRM.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const today = new Date().toISOString().slice(0, 10);

      // Insert client into database
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert({
          nome_razao: values.nomeRazao,
          cpf_cnpj: values.cpfCnpj,
          endereco: values.endereco,
          cidade: values.cidade,
          estado: values.estado,
          pais: values.pais,
          cep: values.cep,
          celular: values.celular,
          telefone_fixo: values.telefoneFixo,
          whatsapp: values.whatsapp,
          email: values.email,
          linkedin: values.linkedin,
          instagram: values.instagram,
          cargo: values.cargo,
          empresa: values.empresa,
          setor_atuacao: values.setorAtuacao,
          tamanho_empresa: values.tamanhoEmpresa,
          origem_lead: values.origemLead,
          interacoes_anteriores: values.interacoesAnteriores,
          status: 'lead',
          value: 0,
          last_contact: today,
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // Add activity to recent activities
      await supabase
        .from('activities')
        .insert({
          type: 'client_added',
          entity_type: 'client',
          entity_id: client.id,
          description: `Novo cliente adicionado: ${values.nomeRazao}`
        });

      // Legacy support for older components
      if (onAdd) {
        const legacyClient = {
          id: client.id,
          name: values.nomeRazao,
          company: values.empresa || values.nomeRazao,
          email: values.email,
          phone: values.celular || values.whatsapp || values.telefoneFixo || "",
          status: "lead" as const,
          value: 0,
          lastContact: today,
        };
        onAdd(legacyClient);
      }

      if (onClientAdded) {
        onClientAdded();
      }

      toast({
        title: "Cliente adicionado",
        description: `${values.nomeRazao} foi cadastrado no CRM.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o cliente. Verifique se você está autenticado e tente novamente.",
        variant: "destructive"
      });
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-3xl">
          <DrawerHeader className="pb-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Adicionar Cliente - CRM
              </h1>
              <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            <DrawerDescription>Preencha as informações para cadastrar no CRM</DrawerDescription>
          </DrawerHeader>
          <div className="px-6 pb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Dados básicos */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">Dados básicos de identificação</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11">
                    <FormField
                      control={form.control}
                      name="nomeRazao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Nome completo / Razão social</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ex: CMYK Impressão Digital LTDA" 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cpfCnpj"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">CPF ou CNPJ</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ex: 11.222.333/0001-44" 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endereco"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-sm font-medium text-foreground">Endereço</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Rua, número, bairro" 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-muted-foreground">Logradouro e complemento</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Cidade</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Goiânia" 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="estado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Estado</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="GO" 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pais"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">País</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Brasil" 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">CEP</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="72872-700" 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Dados de contato */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">Dados de contato</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11">
                    <FormField
                      control={form.control}
                      name="celular"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Telefone (celular)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(62) 99999-9999" 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="telefoneFixo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Telefone (fixo)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(62) 3333-3333" 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">WhatsApp</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(62) 98888-8888" 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">E-mail</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="email@cliente.com" 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">LinkedIn (opcional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://linkedin.com/in/..." 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Instagram (opcional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://instagram.com/..." 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Dados profissionais/comerciais */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">3</span>
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">Dados profissionais/comerciais</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11">
                    <FormField
                      control={form.control}
                      name="cargo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Cargo (opcional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Diretor de Marketing" 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="empresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Empresa (opcional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Nome da empresa" 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="setorAtuacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Setor de atuação</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Gráfica, Tecnologia, Educação..." 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tamanhoEmpresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Tamanho da empresa (opcional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Funcionários, faturamento, etc." 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Histórico de relacionamento */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">4</span>
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">Histórico de relacionamento</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11">
                    <FormField
                      control={form.control}
                      name="origemLead"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Como conheceu a empresa (origem do lead)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Indicação, Instagram, Google Ads, etc." 
                              className="h-11 border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="interacoesAnteriores"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">Interações anteriores</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Ligações, reuniões, e-mails..." 
                                className="min-h-[100px] border-2 focus:border-primary transition-colors resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </section>

                <DrawerFooter className="px-0 pt-8">
                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary-hover transition-colors"
                    >
                      Salvar cliente
                    </Button>
                  <DrawerClose asChild>
                      <Button 
                        variant="outline" 
                        type="button" 
                        className="flex-1 h-12 text-base font-semibold border-2 hover:bg-muted transition-colors"
                      >
                        Cancelar
                      </Button>
                  </DrawerClose>
                  </div>
                </DrawerFooter>
              </form>
            </Form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
