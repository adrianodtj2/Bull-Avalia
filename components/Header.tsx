import React from 'react';
import { RotateCcw, Download } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset, onExport }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4 md:mb-0">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-bull-gold font-bold text-sm border-2 border-bull-gold">
          Bull
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-none">Bull Imóveis</h1>
          <span className="text-xs text-bull-gold font-bold tracking-widest uppercase">Avaliação Imobiliária</span>
        </div>
      </div>

      <div className="flex gap-3 no-print w-full md:w-auto">
        <button 
          type="button"
          onClick={onReset}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
        >
          <RotateCcw size={16} />
          Limpar
        </button>
        <button 
          type="button"
          onClick={() => {
            console.log("Iniciando exportação PDF...");
            onExport();
          }}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-white rounded-lg transition-all shadow-md text-sm font-bold"
        >
          <Download size={18} />
          Exportar PDF
        </button>
      </div>
    </header>
  );
};

export default Header;