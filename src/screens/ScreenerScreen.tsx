import React, { useMemo, useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import Svg, { Circle, Line, Rect, Text as SvgText } from 'react-native-svg';

const DUMMY_IMG = require('../../assets/dummy.png');

type ScreenStock = {
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

const STOCKS: ScreenStock[] = [
  { ticker: 'BBCA', name: 'Bank Central Asia', sector: 'Financials', price: 'Rp 10.650', change: '+1,19%', per: 23.4, pbv: 4.7, roe: 21.8, dividend: 3.1, debt: 0.2, marketCap: 1313 },
  { ticker: 'BBRI', name: 'Bank Rakyat Indonesia', sector: 'Financials', price: 'Rp 4.820', change: '-0,62%', per: 11.2, pbv: 2.1, roe: 18.4, dividend: 6.2, debt: 0.6, marketCap: 730 },
  { ticker: 'ASII', name: 'Astra International', sector: 'Industrials', price: 'Rp 5.175', change: '+1,47%', per: 6.8, pbv: 1.05, roe: 15.6, dividend: 7.1, debt: 0.8, marketCap: 209 },
  { ticker: 'TLKM', name: 'Telkom Indonesia', sector: 'Communication', price: 'Rp 2.980', change: '+0,34%', per: 12.8, pbv: 2.3, roe: 16.2, dividend: 4.8, debt: 0.5, marketCap: 295 },
  { ticker: 'ICBP', name: 'Indofood CBP Sukses Makmur', sector: 'Consumer Staples', price: 'Rp 11.100', change: '+0,45%', per: 14.1, pbv: 2.4, roe: 18.1, dividend: 2.7, debt: 0.4, marketCap: 130 },
];

const PRESETS = ['Semua Saham', 'Valuasi Menarik', 'Dividen Tinggi', 'ROE > 15%', 'Utang Rendah'];

type ScreenerScreenProps = {
  favorites: string[];
  onToggleFavorite: (ticker: string) => void;
};

export default function ScreenerScreen({ favorites, onToggleFavorite }: ScreenerScreenProps): React.ReactElement {
  const [query, setQuery] = useState('');
  const [preset, setPreset] = useState(PRESETS[0]);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [sector, setSector] = useState('Semua sektor');
  const [selectedTicker, setSelectedTicker] = useState('BBCA');

  const results = useMemo(() => STOCKS.filter((stock) => {
    const matchesQuery = `${stock.ticker} ${stock.name}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesSector = sector === 'Semua sektor' || stock.sector === sector;
    const matchesPreset = preset === 'Semua Saham'
      || (preset === 'Valuasi Menarik' && stock.per < 15 && stock.pbv < 2.5)
      || (preset === 'Dividen Tinggi' && stock.dividend >= 5)
      || (preset === 'ROE > 15%' && stock.roe > 15)
      || (preset === 'Utang Rendah' && stock.debt <= 0.5);
    return matchesQuery && matchesSector && matchesPreset;
  }), [preset, query, sector]);

  const selectedStock = results.find((stock) => stock.ticker === selectedTicker) ?? results[0];

  return (
    <View className="gap-space-md">
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-headline-md text-on-surface">Screener</Text>
            <Text className="text-body-compact text-on-surface-variant mt-1">Temukan saham berdasarkan metrik fundamental</Text>
          </View>
          <Pressable onPress={() => setFiltersOpen((open) => !open)} className="min-h-11 px-3 rounded-xl bg-surface-container-high items-center justify-center" accessibilityRole="button" accessibilityLabel="Tampilkan atau sembunyikan filter">
            <Text className="text-label-badge text-primary">{filtersOpen ? 'Sembunyikan' : 'Filter'}</Text>
          </Pressable>
        </View>
        <View className="flex-row justify-between rounded-xl bg-surface-container p-3">
          <Metric label="Rata-rata ROE" value="18,0%" />
          <Metric label="Yield rata-rata" value="4,8%" />
          <Metric label="Median PER" value="12,8x" />
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-label-badge text-on-surface-variant">STRATEGI CEPAT</Text>
        <View className="flex-row flex-wrap gap-2">
          {PRESETS.map((item) => (
            <Pressable key={item} onPress={() => setPreset(item)} className={`min-h-11 px-3 rounded-full justify-center ${preset === item ? 'bg-primary-container' : 'bg-surface-container'}`} accessibilityRole="button" accessibilityState={{ selected: preset === item }}>
              <Text className={`text-label-badge ${preset === item ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {filtersOpen && (
        <View className="gap-3 rounded-xl bg-surface-container-low p-3">
          <Text className="text-headline-sm text-on-surface">Filter fundamental</Text>
          <TextInput value={query} onChangeText={setQuery} placeholder="Cari ticker atau nama emiten" placeholderTextColor="#88929b" autoCapitalize="characters" autoCorrect={false} className="min-h-11 rounded-lg bg-surface-container-lowest px-3 text-on-surface" accessibilityLabel="Cari saham" />
          <View className="flex-row flex-wrap gap-2">
            {['Semua sektor', 'Financials', 'Industrials', 'Communication', 'Consumer Staples'].map((item) => (
              <Pressable key={item} onPress={() => setSector(item)} className={`min-h-10 px-3 rounded-lg justify-center ${sector === item ? 'bg-primary-container/20' : 'bg-surface-container'}`} accessibilityRole="button" accessibilityState={{ selected: sector === item }}>
                <Text className={`text-label-badge ${sector === item ? 'text-primary' : 'text-on-surface-variant'}`}>{item}</Text>
              </Pressable>
            ))}
          </View>
          <Text className="text-body-compact text-on-surface-variant">Rentang metrik tersedia di strategi cepat. Sektor dan industri digunakan sebagai filter screener.</Text>
        </View>
      )}

      <View className="gap-2 rounded-xl bg-surface-container-low p-3">
        <View>
          <Text className="text-headline-sm text-on-surface">Bubble Matrix</Text>
          <Text className="text-body-compact text-on-surface-variant mt-1">PBV dibandingkan dengan ROE. Ukuran bubble menunjukkan kapitalisasi pasar.</Text>
        </View>
        <View className="rounded-lg bg-surface-container-lowest p-2">
          <Svg width="100%" height={232} viewBox="0 0 360 232" accessibilityLabel="Matriks saham berdasarkan PBV dan ROE">
            <Rect x={34} y={24} width={127} height={83} fill="#4edea3" fillOpacity={0.08} />
            <Rect x={161} y={24} width={181} height={83} fill="#0ea5e9" fillOpacity={0.06} />
            <Rect x={34} y={107} width={127} height={84} fill="#313540" fillOpacity={0.3} />
            <Rect x={161} y={107} width={181} height={84} fill="#ffb4ab" fillOpacity={0.07} />
            <Line x1={34} y1={24} x2={34} y2={191} stroke="#88929b" strokeWidth={1} />
            <Line x1={34} y1={191} x2={342} y2={191} stroke="#88929b" strokeWidth={1} />
            <Line x1={161} y1={24} x2={161} y2={191} stroke="#3e4850" strokeWidth={1} strokeDasharray="4 4" />
            <Line x1={34} y1={107} x2={342} y2={107} stroke="#3e4850" strokeWidth={1} strokeDasharray="4 4" />
            <SvgText x={40} y={36} fill="#4edea3" fontSize={8}>ROE TINGGI · PBV RENDAH</SvgText>
            <SvgText x={166} y={36} fill="#89ceff" fontSize={8}>PREMIUM</SvgText>
            <SvgText x={40} y={184} fill="#bec8d2" fontSize={8}>VALUASI RENDAH · ROE RENDAH</SvgText>
            <SvgText x={166} y={184} fill="#ffb4ab" fontSize={8}>PERLU DICERMATI</SvgText>
            <SvgText x={34} y={207} fill="#bec8d2" fontSize={9}>0.5x</SvgText>
            <SvgText x={153} y={207} fill="#bec8d2" fontSize={9}>2.0x</SvgText>
            <SvgText x={323} y={207} fill="#bec8d2" fontSize={9}>5.0x PBV</SvgText>
            <SvgText x={4} y={14} fill="#bec8d2" fontSize={9}>ROE</SvgText>
            <SvgText x={4} y={30} fill="#bec8d2" fontSize={9}>30%</SvgText>
            <SvgText x={4} y={110} fill="#bec8d2" fontSize={9}>12.5%</SvgText>
            <SvgText x={12} y={194} fill="#bec8d2" fontSize={9}>-5%</SvgText>
            {results.map((stock, index) => {
              const x = 34 + ((Math.max(0.5, Math.min(5, stock.pbv)) - 0.5) / 4.5) * 308;
              const y = 191 - ((Math.max(-5, Math.min(30, stock.roe)) + 5) / 35) * 167;
              const radius = Math.sqrt(stock.marketCap) * 0.42;
              const color = stock.roe >= 12.5 && stock.pbv < 2 ? '#4edea3' : stock.roe >= 12.5 ? '#89ceff' : stock.pbv < 2 ? '#bec8d2' : '#ffb4ab';
              const labelX = x > 292 ? x - 39 : x + radius + 3;
              const labelY = y + (index % 2 === 0 ? -radius - 3 : radius + 8);
              const selected = selectedStock?.ticker === stock.ticker;
              return (
                <React.Fragment key={stock.ticker}>
                  <Circle cx={x} cy={y} r={radius} fill={color} fillOpacity={selected ? 0.55 : 0.3} stroke={color} strokeWidth={selected ? 2 : 1} onPress={() => setSelectedTicker(stock.ticker)} />
                  <Circle cx={x} cy={y} r={3} fill={color} onPress={() => setSelectedTicker(stock.ticker)} />
                  <SvgText x={labelX} y={labelY} fill={color} fontSize={8} fontWeight={selected ? '700' : '500'} onPress={() => setSelectedTicker(stock.ticker)}>{stock.ticker}</SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {results.map((stock) => (
            <Pressable key={stock.ticker} onPress={() => setSelectedTicker(stock.ticker)} className={`min-h-11 px-3 rounded-lg justify-center ${selectedStock?.ticker === stock.ticker ? 'bg-primary-container' : 'bg-surface-container'}`} accessibilityRole="button" accessibilityState={{ selected: selectedStock?.ticker === stock.ticker }} accessibilityLabel={`Pilih ${stock.ticker} pada matriks`}>
              <Text className={`text-label-badge ${selectedStock?.ticker === stock.ticker ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{stock.ticker}</Text>
            </Pressable>
          ))}
        </View>
        <View className="flex-row flex-wrap gap-x-3 gap-y-1">
          <LegendDot color="#4edea3" label="ROE tinggi, PBV rendah" />
          <LegendDot color="#89ceff" label="ROE tinggi, PBV tinggi" />
          <LegendDot color="#ffb4ab" label="ROE rendah, PBV tinggi" />
        </View>
        {selectedStock ? (
          <View className="rounded-lg bg-surface-container p-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-headline-sm text-on-surface">{selectedStock.ticker}</Text>
              <Text className="text-label-mono-sm text-on-surface-variant">Kapitalisasi Rp {selectedStock.marketCap} T</Text>
            </View>
            <View className="flex-row flex-wrap gap-x-5 gap-y-2 mt-2">
              <Metric label="PBV" value={`${selectedStock.pbv}x`} />
              <Metric label="ROE" value={`${selectedStock.roe}%`} />
              <Metric label="PER" value={`${selectedStock.per}x`} />
              <Metric label="Yield" value={`${selectedStock.dividend}%`} />
            </View>
          </View>
        ) : (
          <Text className="text-body-compact text-on-surface-variant">Tidak ada saham untuk ditampilkan. Ubah filter untuk melihat matriks.</Text>
        )}
      </View>

      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-headline-sm text-on-surface">Hasil screener</Text>
          <Text className="text-label-mono-sm text-on-surface-variant">{results.length} saham</Text>
        </View>
        {results.map((stock) => {
          const isFavorite = favorites.includes(stock.ticker);
          return (
            <View key={stock.ticker} className="rounded-xl bg-surface-container p-3 gap-3">
              <View className="flex-row items-start justify-between gap-2">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-headline-sm text-on-surface">{stock.ticker}</Text>
                    <Text className="text-label-badge text-on-surface-variant">{stock.sector}</Text>
                  </View>
                  <Text className="text-body-compact text-on-surface-variant" numberOfLines={1}>{stock.name}</Text>
                </View>
                <Pressable onPress={() => onToggleFavorite(stock.ticker)} className="min-h-11 min-w-11 px-2 rounded-lg bg-surface-container-high items-center justify-center" accessibilityRole="button" accessibilityLabel={isFavorite ? `Hapus ${stock.ticker} dari favorit` : `Tambahkan ${stock.ticker} ke favorit`}>
                  <Image source={DUMMY_IMG} className="h-5 w-5" resizeMode="contain" accessibilityLabel={isFavorite ? 'Sudah menjadi favorit' : 'Tambahkan ke favorit'} />
                </Pressable>
              </View>
              <View className="flex-row flex-wrap gap-x-5 gap-y-2">
                <Metric label="Harga" value={stock.price} />
                <Metric label="PER" value={`${stock.per}x`} />
                <Metric label="PBV" value={`${stock.pbv}x`} />
                <Metric label="ROE" value={`${stock.roe}%`} />
                <Metric label="Yield" value={`${stock.dividend}%`} />
              </View>
            </View>
          );
        })}
        {results.length === 0 && <Text className="rounded-xl bg-surface-container p-4 text-body-default text-on-surface-variant">Tidak ada saham yang cocok. Ubah kata kunci atau filter.</Text>}
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }): React.ReactElement {
  return (
    <View>
      <Text className="text-label-mono-sm text-on-surface-variant">{label}</Text>
      <Text className="text-metric-default text-on-surface font-semibold">{value}</Text>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }): React.ReactElement {
  return (
    <View className="flex-row items-center gap-1">
      <View className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <Text className="text-label-mono-sm text-on-surface-variant">{label}</Text>
    </View>
  );
}
