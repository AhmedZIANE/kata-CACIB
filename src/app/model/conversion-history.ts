export interface ConversionHistory {
    realRate: number;
    fixedRate: number | null;
    inputValue: number;
    inputCurrency: 'EUR' | 'USD';
    outputValue: number;
    outputCurrency: 'EUR' | 'USD';
  }