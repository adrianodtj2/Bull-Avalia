import React from 'react';
import { Calculator, Sparkles, Building2, LayoutDashboard } from 'lucide-react';
import { formatCurrency } from '../utils';

interface SummaryCardsProps {
  totalValue: number;
  landGross: number;
  landNet: number;
  constGross: number;
  constNet: number;
  onGenerateAI?: () => void;
  isGenerating?: boolean;
}

export const TotalCard: React.FC<{ value: number }> = ({ value }) => (
  <div className="bg-[#111827] rounded-xl p-6 text-white shadow-lg relative overflow-hidden mb-6 border border-gray-800">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-bold">Total do Imóvel (VI)</h3>
      <div className="p-2 bg-gray-800 rounded-lg text-yellow-500 border border-gray-700 no-print">
        <Calculator size={20} />
      </div>
    </div>
    
    <div className="mt-2">
      <div className="text-4xl font-black text-yellow-500 tracking-tight">
        {formatCurrency(value)}
      </div>
      <p className="text-gray-400 text-xs mt-1">Valor final calculado</p>
    </div>
    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500 opacity-5 rounded-full -mr-10 -mt-10 blur-xl no-print"></div>
  </div>
);

export const DetailCard: React.FC<{ 
  title: string; 
  gross: number; 
  net: number; 
  icon: React.ReactNode 
}> = ({ title, gross, net, icon }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600 no-print">
        {icon}
      </div>
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
    </div>

    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-gray-50 pb-3">
        <span className="text-sm text-gray-500">Valor Bruto</span>
        <span className="text-sm font-medium text-gray-700">{formatCurrency(gross)}</span>
      </div>
      <div className="flex justify-between items-center pt-1">
        <span className="text-sm font-bold text-gray-600">Valor Líquido</span>
        <span className="text-xl font-bold text-gray-900">{formatCurrency(net)}</span>
      </div>
    </div>
  </div>
);

export const AICard: React.FC<{ onGenerate: () => void; isLoading: boolean }> = ({ onGenerate, isLoading }) => (
  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-6 mb-6 no-print">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Sparkles className="text-indigo-600" size={20} />
        <h3 className="font-bold text-indigo-900">Análise de IA</h3>
      </div>
      <span className="text-xs font-medium px-2 py-1 bg-white text-indigo-600 rounded border border-indigo-100">Beta</span>
    </div>
    <p className="text-sm text-indigo-700 mb-4">
      Obtenha um resumo profissional de mercado baseado nos valores calculados utilizando o Gemini AI.
    </p>
    <button
      onClick={onGenerate}
      disabled={isLoading}
      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-bold rounded-lg shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Analisando dados...
        </span>
      ) : (
        <>
          <Sparkles size={16} />
          Gerar Relatório Inteligente
        </>
      )}
    </button>
  </div>
);