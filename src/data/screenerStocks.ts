export type ScreenStock = {
  ticker: string;
  name: string;
  sector: string;
  price: string;
  change: string;
  per: number;
  pbv: number;
  roe: number;
  dividend: number;
  debt: number;
  marketCap: number;
};

export const SCREENER_STOCKS: ScreenStock[] = [
  { ticker: 'BBCA', name: 'Bank Central Asia', sector: 'Financials', price: 'Rp 10.650', change: '+1,19%', per: 23.4, pbv: 4.7, roe: 21.8, dividend: 3.1, debt: 0.2, marketCap: 1313 },
  { ticker: 'BBRI', name: 'Bank Rakyat Indonesia', sector: 'Financials', price: 'Rp 4.820', change: '-0,62%', per: 11.2, pbv: 2.1, roe: 18.4, dividend: 6.2, debt: 0.6, marketCap: 730 },
  { ticker: 'ASII', name: 'Astra International', sector: 'Industrials', price: 'Rp 5.175', change: '+1,47%', per: 6.8, pbv: 1.05, roe: 15.6, dividend: 7.1, debt: 0.8, marketCap: 209 },
  { ticker: 'TLKM', name: 'Telkom Indonesia', sector: 'Communication', price: 'Rp 2.980', change: '+0,34%', per: 12.8, pbv: 2.3, roe: 16.2, dividend: 4.8, debt: 0.5, marketCap: 295 },
  { ticker: 'ICBP', name: 'Indofood CBP Sukses Makmur', sector: 'Consumer Staples', price: 'Rp 11.100', change: '+0,45%', per: 14.1, pbv: 2.4, roe: 18.1, dividend: 2.7, debt: 0.4, marketCap: 130 },
];

export const SCREENER_PRESETS = ['Semua Saham', 'Valuasi Menarik', 'Dividen Tinggi', 'ROE > 15%', 'Utang Rendah'];
export const SCREENER_SECTORS = ['Semua sektor', 'Financials', 'Industrials', 'Communication', 'Consumer Staples'];
