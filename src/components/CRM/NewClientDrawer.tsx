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
            <DrawerTitle className="text-2xl md:text-3xl font-bold tracking-tight">Adicionar cliente - CRM</DrawerTitle>
            <DrawerDescription>Preencha as informações para cadastrar no CRM</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Dados básicos */}
                <section className="space-y-4">
                  <h4 className="text-base font-semibold text-foreground">Dados básicos de identificação</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nomeRazao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo / Razão social</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: CMYK Impressão Digital LTDA" {...field} />
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
                          <FormLabel>CPF ou CNPJ</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 11.222.333/0001-44" {...field} />
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
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input placeholder="Rua, número, bairro" {...field} />
                          </FormControl>
                          <FormDescription>Logradouro e complemento</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Goiânia" {...field} />
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
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input placeholder="GO" {...field} />
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
                          <FormLabel>País</FormLabel>
                          <FormControl>
                            <Input placeholder="Brasil" {...field} />
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
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input placeholder="72872-700" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Dados de contato */}
                <section className="space-y-4">
                  <h4 className="text-base font-semibold text-foreground">Dados de contato</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="celular"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone (celular)</FormLabel>
                          <FormControl>
                            <Input placeholder="(62) 99999-9999" {...field} />
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
                          <FormLabel>Telefone (fixo)</FormLabel>
                          <FormControl>
                            <Input placeholder="(62) 3333-3333" {...field} />
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
                          <FormLabel>WhatsApp</FormLabel>
                          <FormControl>
                            <Input placeholder="(62) 98888-8888" {...field} />
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
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@cliente.com" {...field} />
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
                          <FormLabel>LinkedIn (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/in/..." {...field} />
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
                          <FormLabel>Instagram (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://instagram.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Dados profissionais/comerciais */}
                <section className="space-y-4">
                  <h4 className="text-base font-semibold text-foreground">Dados profissionais/comerciais</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cargo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cargo (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Diretor de Marketing" {...field} />
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
                          <FormLabel>Empresa (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da empresa" {...field} />
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
                          <FormLabel>Setor de atuação</FormLabel>
                          <FormControl>
                            <Input placeholder="Gráfica, Tecnologia, Educação..." {...field} />
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
                          <FormLabel>Tamanho da empresa (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Funcionários, faturamento, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Histórico de relacionamento */}
                <section className="space-y-4">
                  <h4 className="text-base font-semibold text-foreground">Histórico de relacionamento</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="origemLead"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Como conheceu a empresa (origem do lead)</FormLabel>
                          <FormControl>
                            <Input placeholder="Indicação, Instagram, Google Ads, etc." {...field} />
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
                            <FormLabel>Interações anteriores</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Ligações, reuniões, e-mails..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </section>

                <DrawerFooter className="px-0">
                  <Button type="submit">Salvar cliente</Button>
                  <DrawerClose asChild>
                    <Button variant="outline" type="button">Cancelar</Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </Form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
