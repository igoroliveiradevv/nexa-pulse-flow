import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, FileText, Download, Send } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";

interface ContractData {
  clientName: string;
  clientCNPJ: string;
  clientAddress: string;
  value: string;
  startDate: string;
  endDate: string;
  plan: string;
  additionalTerms: string;
}

const plans = [
  { value: "basic", label: "Plano Básico - R$ 1.200", price: 1200 },
  { value: "standard", label: "Plano Padrão - R$ 1.700", price: 1700 },
  { value: "premium", label: "Plano Premium - R$ 2.500", price: 2500 },
  { value: "enterprise", label: "Plano Enterprise - R$ 4.000", price: 4000 },
];

export const ContractEditor = () => {
  const { toast } = useToast();
  const [contractData, setContractData] = useState<ContractData>({
    clientName: "",
    clientCNPJ: "",
    clientAddress: "",
    value: "",
    startDate: "",
    endDate: "",
    plan: "",
    additionalTerms: "",
  });

  const handleInputChange = (field: keyof ContractData, value: string) => {
    setContractData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlanChange = (planValue: string) => {
    const selectedPlan = plans.find(p => p.value === planValue);
    setContractData(prev => ({
      ...prev,
      plan: planValue,
      value: selectedPlan ? selectedPlan.price.toString() : ""
    }));
  };

  const generatePDF = () => {
    if (!contractData.clientName || !contractData.value) {
      toast({
        title: "Erro",
        description: "Preencha pelo menos o nome do cliente e o valor do contrato",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF();
    const margin = 20;
    let yPosition = margin;

    // Título
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE GESTÃO DE TRÁFEGO PAGO", margin, yPosition);
    yPosition += 20;

    // Contratada
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CONTRATADA:", margin, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "normal");
    doc.text("NEXA PULSE LTDA inscrito no CNPJ sob o nº 53.548.850/0001-95,", margin, yPosition);
    yPosition += 6;
    doc.text("com endereço na Conjunto Residencial 7, Condomínio 1, SN, Bloco B, Apt 3,", margin, yPosition);
    yPosition += 6;
    doc.text("Parque das Cachoeiras, Valparaíso de Goiás - GO, CEP 72872-700.", margin, yPosition);
    yPosition += 15;

    // Contratante
    doc.setFont("helvetica", "bold");
    doc.text("CONTRATANTE:", margin, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`${contractData.clientName}, inscrita no CNPJ sob o nº ${contractData.clientCNPJ},`, margin, yPosition);
    yPosition += 6;
    doc.text(`com endereço na ${contractData.clientAddress}.`, margin, yPosition);
    yPosition += 15;

    // Cláusula 1
    doc.setFont("helvetica", "bold");
    doc.text("CLÁUSULA 1 – DO OBJETO E VALORES", margin, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "normal");
    doc.text("O presente contrato tem por objeto a prestação de serviços de gestão", margin, yPosition);
    yPosition += 6;
    doc.text("de tráfego pago em multiplataformas digitais. O valor acordado entre", margin, yPosition);
    yPosition += 6;
    doc.text(`as partes é de R$ ${contractData.value}.`, margin, yPosition);
    yPosition += 15;

    // Cláusula 2
    doc.setFont("helvetica", "bold");
    doc.text("CLÁUSULA 2 – DO PRAZO", margin, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "normal");
    doc.text("O presente contrato terá duração de 60 (sessenta) dias corridos,", margin, yPosition);
    yPosition += 6;
    doc.text(`com início em ${contractData.startDate} e término em ${contractData.endDate}.`, margin, yPosition);
    yPosition += 15;

    // Assinaturas
    yPosition += 30;
    doc.text(`Valparaíso de Goiás, ${new Date().toLocaleDateString('pt-BR')}`, margin, yPosition);
    yPosition += 30;
    doc.text("_________________________________", margin, yPosition);
    yPosition += 6;
    doc.text("NEXA PULSE LTDA", margin, yPosition);
    yPosition += 6;
    doc.text("CNPJ: 53.548.850/0001-95", margin, yPosition);
    yPosition += 20;
    doc.text("_________________________________", margin, yPosition);
    yPosition += 6;
    doc.text(contractData.clientName, margin, yPosition);
    yPosition += 6;
    doc.text(`CNPJ: ${contractData.clientCNPJ}`, margin, yPosition);

    // Salvar PDF
    doc.save(`Contrato_${contractData.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "PDF Gerado",
      description: "O contrato foi gerado e baixado com sucesso!",
    });
  };

  const sendForSignature = () => {
    if (!contractData.clientName || !contractData.value) {
      toast({
        title: "Erro",
        description: "Preencha os dados obrigatórios antes de enviar para assinatura",
        variant: "destructive",
      });
      return;
    }

    // Simulação de envio para plataforma de assinatura
    toast({
      title: "Enviado para Assinatura",
      description: `Contrato enviado para ${contractData.clientName}. Integração com sistema de assinatura digital será implementada.`,
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Editor de Contratos</h2>
          <p className="text-muted-foreground">Crie e gerencie contratos de serviços</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generatePDF}>
            <Download className="h-4 w-4 mr-2" />
            Gerar PDF
          </Button>
          <Button className="bg-primary hover:bg-primary-hover" onClick={sendForSignature}>
            <Send className="h-4 w-4 mr-2" />
            Enviar p/ Assinatura
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Edição */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dados do Contrato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Nome do Cliente/Empresa</Label>
                <Input
                  id="clientName"
                  value={contractData.clientName}
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                  placeholder="Ex: CMYK Impressão Digital"
                />
              </div>
              <div>
                <Label htmlFor="clientCNPJ">CNPJ</Label>
                <Input
                  id="clientCNPJ"
                  value={contractData.clientCNPJ}
                  onChange={(e) => handleInputChange("clientCNPJ", e.target.value)}
                  placeholder="00.000.000/0001-00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="clientAddress">Endereço Completo</Label>
              <Textarea
                id="clientAddress"
                value={contractData.clientAddress}
                onChange={(e) => handleInputChange("clientAddress", e.target.value)}
                placeholder="Rua, número, bairro, cidade, CEP"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plan">Plano de Serviço</Label>
                <Select value={contractData.plan} onValueChange={handlePlanChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.value} value={plan.value}>
                        {plan.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="value">Valor (R$)</Label>
                <Input
                  id="value"
                  type="number"
                  value={contractData.value}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  placeholder="1700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={contractData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={contractData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="additionalTerms">Termos Adicionais</Label>
              <Textarea
                id="additionalTerms"
                value={contractData.additionalTerms}
                onChange={(e) => handleInputChange("additionalTerms", e.target.value)}
                placeholder="Adicione termos específicos para este contrato..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview do Contrato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Preview do Contrato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg text-sm leading-relaxed max-h-96 overflow-y-auto">
              <div className="text-center font-bold mb-4">
                CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE GESTÃO DE TRÁFEGO PAGO
              </div>
              
              <p className="mb-2">
                <strong>CONTRATADA:</strong><br />
                NEXA PULSE LTDA inscrito no CNPJ sob o nº 53.548.850/0001-95, com endereço na Conjunto Residencial 7, Condomínio 1, SN, Bloco B, Apt 3, Parque das Cachoeiras, Valparaíso de Goiás - GO, CEP 72872-700.
              </p>
              
              <p className="mb-4">
                <strong>CONTRATANTE:</strong><br />
                {contractData.clientName || "[NOME DO CLIENTE]"}, inscrita no CNPJ sob o nº {contractData.clientCNPJ || "[CNPJ]"}, com endereço na {contractData.clientAddress || "[ENDEREÇO]"}.
              </p>
              
              <p className="mb-2">
                <strong>CLÁUSULA 1 – DO OBJETO E VALORES</strong><br />
                O presente contrato tem por objeto a prestação de serviços de gestão de tráfego pago em multiplataformas digitais. O valor acordado entre as partes é de R$ {contractData.value || "[VALOR]"} ({contractData.value ? `${contractData.value} reais` : "[VALOR POR EXTENSO]"}).
              </p>
              
              <p className="mb-2">
                <strong>CLÁUSULA 2 – DO PRAZO</strong><br />
                O presente contrato terá duração de 60 (sessenta) dias corridos, com início em {contractData.startDate || "[DATA INÍCIO]"} e término em {contractData.endDate || "[DATA TÉRMINO]"}.
              </p>
              
              <p className="mb-2">
                <strong>CLÁUSULA 3 – DO PAGAMENTO</strong><br />
                O pagamento será efetuado por meio de sistema automatizado de cobrança recorrente via plataforma Asaas.
              </p>
              
              {contractData.additionalTerms && (
                <p className="mb-2">
                  <strong>TERMOS ADICIONAIS:</strong><br />
                  {contractData.additionalTerms}
                </p>
              )}
              
              <div className="mt-4 text-right">
                <p>Valparaíso de Goiás, {new Date().toLocaleDateString('pt-BR')}</p>
                <br />
                <p>________________________<br />NEXA PULSE LTDA<br />CNPJ: 53.548.850/0001-95</p>
                <br />
                <p>________________________<br />{contractData.clientName || "[NOME DO CLIENTE]"}<br />CNPJ: {contractData.clientCNPJ || "[CNPJ]"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};