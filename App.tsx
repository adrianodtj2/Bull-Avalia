import React, { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, Building2, CheckCircle2, Sparkles, Loader2, FileText } from 'lucide-react';
import ReactDOM from 'react-dom/client';
import Header from './components/Header';
import InputField, { InputCard } from './components/InputCard';
import { TotalCard, DetailCard, AICard } from './components/SummaryCards';
import { PropertyData, ValuationResult, INITIAL_DATA } from './types';
import { generateValuationReport } from './services/geminiService';
import { formatCurrency } from './utils';

const App: React.FC = () => {
  const [data, setData] = useState<PropertyData>(INITIAL_DATA);
  const [result, setResult] = useState<ValuationResult>({
    landGross: 0,
    landNet: 0,
    constructionGross: 0,
    constructionNet: 0,
    totalValue: 0,
  });
  
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const calculate = useCallback(() => {
    const landGross = (data.landArea || 0) * (data.landUnitValue || 0);
    const landNet = landGross * (1 - ((data.landDepreciation || 0) / 100));
    const constructionGross = (data.builtArea || 0) * (data.constructionUnitCost || 0);
    const constructionNet = constructionGross * (1 - ((data.constructionDepreciation || 0) / 100));
    const totalValue = landNet + constructionNet;

    setResult({
      landGross,
      landNet,
      constructionGross,
      constructionNet,
      totalValue,
    });
  }, [data]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const updateField = (field: keyof PropertyData, value: number) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (confirm("Deseja realmente limpar todos os campos?")) {
      setData(INITIAL_DATA);
      setAiReport(null);
    }
  };

  // Função para renderizar o template PDF manualmente para garantir sincronia
  const renderPdfTemplate = () => {
    return (
      <div className="p-10 font-sans" style={{ width: '210mm', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid black', paddingBottom: '20px', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>Bull Imóveis</h1>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#B45309', margin: 0 }}>PARECER TÉCNICO DE AVALIAÇÃO IMOBILIÁRIA</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#6B7280' }}>
            Documento Original<br/>
            {new Date().toLocaleDateString('pt-BR')} - {new Date().toLocaleTimeString('pt-BR')}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: '#F9FAFB', padding: '20px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '900', color: '#6B7280', textTransform: 'uppercase', marginBottom: '10px' }}>Dados do Terreno</h2>
            <p style={{ fontSize: '13px', margin: '5px 0' }}>Área: <strong>{data.landArea} m²</strong></p>
            <p style={{ fontSize: '13px', margin: '5px 0' }}>VUM: <strong>{formatCurrency(data.landUnitValue)}</strong></p>
            <p style={{ fontSize: '13px', margin: '5px 0' }}>Fator: <strong>{data.landDepreciation}%</strong></p>
            <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #D1D5DB', fontWeight: 'bold' }}>
              Subtotal: {formatCurrency(result.landNet)}
            </div>
          </div>
          <div style={{ background: '#F9FAFB', padding: '20px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '900', color: '#6B7280', textTransform: 'uppercase', marginBottom: '10px' }}>Dados da Construção</h2>
            <p style={{ fontSize: '13px', margin: '5px 0' }}>Área: <strong>{data.builtArea} m²</strong></p>
            <p style={{ fontSize: '13px', margin: '5px 0' }}>CUB: <strong>{formatCurrency(data.constructionUnitCost)}</strong></p>
            <p style={{ fontSize: '13px', margin: '5px 0' }}>Fator: <strong>{data.constructionDepreciation}%</strong></p>
            <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #D1D5DB', fontWeight: 'bold' }}>
              Subtotal: {formatCurrency(result.constructionNet)}
            </div>
          </div>
        </div>

        <div style={{ background: '#111827', color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#FBBF24', letterSpacing: '2px', marginBottom: '5px' }}>Valor de Mercado Estimado (VI)</h2>
          <div style={{ fontSize: '42px', fontWeight: '900', color: '#FBBF24' }}>{formatCurrency(result.totalValue)}</div>
        </div>

        {aiReport && (
          <div style={{ borderTop: '2px solid #F3F4F6', paddingTop: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#4F46E5' }}>Parecer Técnico (Análise IA)</h2>
            <div 
              style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6' }}
              dangerouslySetInnerHTML={{ __html: aiReport.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} 
            />
          </div>
        )}

        <div style={{ marginTop: '50px', textAlign: 'center', borderTop: '1px solid #E5E7EB', paddingTop: '20px', fontSize: '9px', color: '#9CA3AF' }}>
          Este documento é uma estimativa baseada em normas técnicas e análise de dados.<br/>
          Bull Imóveis © {new Date().getFullYear()} - Todos os direitos reservados.
        </div>
      </div>
    );
  };

  const handleExport = async () => {
    if (result.totalValue === 0) {
      alert("Realize uma avaliação antes de exportar.");
      return;
    }

    setIsExporting(true);

    const templateContainer = document.getElementById('pdf-template');
    if (!templateContainer) return;

    // Renderizamos o conteúdo do PDF no container isolado
    const pdfRoot = ReactDOM.createRoot(templateContainer);
    pdfRoot.render(renderPdfTemplate());

    // Pequeno delay para garantir que o React renderizou o DOM no container
    await new Promise(resolve => setTimeout(resolve, 800));

    // Ativamos o modo de exportação (Esconde a UI principal, mostra o template)
    document.body.classList.add('is-exporting-mode');
    
    // Nome do arquivo com extensão explícita
    const safeFileName = `Avaliacao_BullImoveis_${new Date().getTime()}.pdf`;

    const opt = {
      margin: 0,
      filename: safeFileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: true,
        backgroundColor: '#ffffff',
        width: 794 // Forçar largura A4 (210mm a 96dpi)
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore
      await html2pdf().set(opt).from(templateContainer).save();
    } catch (err) {
      console.error("PDF Error:", err);
      alert("Ocorreu um erro ao gerar o arquivo. Tente novamente.");
    } finally {
      // Voltamos ao normal
      document.body.classList.remove('is-exporting-mode');
      pdfRoot.unmount();
      templateContainer.innerHTML = '';
      setIsExporting(false);
    }
  };

  const handleGenerateAI = async () => {
    if (result.totalValue === 0) {
      alert("Insira os dados do imóvel antes de gerar o relatório.");
      return;
    }
    setIsAiLoading(true);
    try {
      const report = await generateValuationReport(data, result);
      setAiReport(report);
      setShowAiModal(true);
    } catch (error) {
      alert("Erro na conexão com a IA.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Overlay de carregamento persistente */}
      {isExporting && (
        <div className="fixed inset-0 bg-white z-[999] flex flex-col items-center justify-center">
          <Loader2 className="animate-spin mb-4 text-bull-gold" size={64} />
          <h2 className="text-2xl font-black text-gray-900 uppercase italic">Bull Avalia</h2>
          <p className="text-gray-500 font-medium animate-pulse">Processando documento seguro...</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Header onReset={handleReset} onExport={handleExport} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <InputCard title="Dados do Terreno" icon={<LayoutDashboard size={24} />}>
              <InputField
                label="Área Total (AT)"
                value={data.landArea}
                onChange={(val) => updateField('landArea', val)}
                suffix="m²"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Valor Unitário (VUM)"
                  value={data.landUnitValue}
                  onChange={(val) => updateField('landUnitValue', val)}
                  prefix="R$"
                />
                <InputField
                  label="Fator de Depreciação"
                  value={data.landDepreciation}
                  onChange={(val) => updateField('landDepreciation', val)}
                  suffix="%"
                />
              </div>
            </InputCard>

            <InputCard title="Dados da Construção" icon={<Building2 size={24} />}>
              <InputField
                label="Área Construída (AC)"
                value={data.builtArea}
                onChange={(val) => updateField('builtArea', val)}
                suffix="m²"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Custo Unitário (CUB/m²)"
                  value={data.constructionUnitCost}
                  onChange={(val) => updateField('constructionUnitCost', val)}
                  prefix="R$"
                />
                <InputField
                  label="Fator de Depreciação"
                  value={data.constructionDepreciation}
                  onChange={(val) => updateField('constructionDepreciation', val)}
                  suffix="%"
                />
              </div>
            </InputCard>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-6 space-y-6">
              <TotalCard value={result.totalValue} />
              <DetailCard 
                title="Valor do Terreno (VT)"
                gross={result.landGross}
                net={result.landNet}
                icon={<LayoutDashboard size={20} />}
              />
              <DetailCard 
                title="Valor da Construção (VC)"
                gross={result.constructionGross}
                net={result.constructionNet}
                icon={<Building2 size={20} />}
              />
              <AICard onGenerate={handleGenerateAI} isLoading={isAiLoading} />
            </div>
          </div>
        </div>
      </div>

      {showAiModal && aiReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <div className="flex items-center gap-2 text-indigo-700">
                <CheckCircle2 size={24} />
                <h3 className="text-xl font-bold">Relatório de IA</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-2xl p-2">&times;</button>
            </div>
            
            <div className="p-8 prose prose-indigo max-w-none text-gray-700 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: aiReport.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 sticky bottom-0 z-10">
               <button onClick={() => setShowAiModal(false)} className="px-4 py-2 text-gray-600 font-medium">Fechar</button>
              <button 
                onClick={() => { setShowAiModal(false); handleExport(); }}
                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg flex items-center gap-2"
              >
                <FileText size={18} />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;