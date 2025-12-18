import { GoogleGenAI } from "@google/genai";
import { PropertyData, ValuationResult } from '../types';
import { formatCurrency } from '../utils';

export const generateValuationReport = async (data: PropertyData, result: ValuationResult): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  // Usando gemini-3-flash-preview conforme recomendado para tarefas de texto
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Atue como um avaliador imobiliário sênior certificado. 
    Analise os dados abaixo e forneça um parecer técnico resumido (em português) sobre o valor de mercado deste imóvel.
    
    RELATÓRIO DE DADOS:
    - Área Terreno: ${data.landArea} m² (VUM: ${formatCurrency(data.landUnitValue)})
    - Depreciação Terreno: ${data.landDepreciation}%
    - Área Construída: ${data.builtArea} m² (CUB: ${formatCurrency(data.constructionUnitCost)})
    - Depreciação Construção: ${data.constructionDepreciation}%
    
    VALORES CALCULADOS:
    - Terreno (Líquido): ${formatCurrency(result.landNet)}
    - Construção (Líquido): ${formatCurrency(result.constructionNet)}
    - VALOR TOTAL ESTIMADO: ${formatCurrency(result.totalValue)}
    
    Instruções:
    1. Seja profissional e direto.
    2. Comente sobre a viabilidade econômica do valor total em relação às metragens.
    3. Use formatação Markdown (negritos e listas).
    4. Conclua confirmando se o valor está dentro das normas técnicas brasileiras (NBR 14653).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Erro ao gerar análise. Os cálculos manuais permanecem válidos.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Falha ao conectar com o serviço de IA.");
  }
};