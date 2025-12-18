export interface PropertyData {
  // Land Data
  landArea: number;
  landUnitValue: number;
  landDepreciation: number;

  // Construction Data
  builtArea: number;
  constructionUnitCost: number;
  constructionDepreciation: number;
}

export interface ValuationResult {
  landGross: number;
  landNet: number;
  constructionGross: number;
  constructionNet: number;
  totalValue: number;
}

export const INITIAL_DATA: PropertyData = {
  landArea: 0,
  landUnitValue: 0,
  landDepreciation: 0,
  builtArea: 0,
  constructionUnitCost: 0,
  constructionDepreciation: 0,
};