import React, { useMemo, useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';

const DUMMY_IMG = require('../../assets/dummy.png');

export interface StockSearchItem {
  id: string;
  ticker: string;
  sector: string;
  per: string;
  pbv: string;
  price: string;
}

interface StockSearchScreenProps {
  stocks: StockSearchItem[];
  favorites: string[];
  onToggleFavorite: (ticker: string) => void;
}

export default function StockSearchScreen({ stocks, favorites, onToggleFavorite }: StockSearchScreenProps): React.ReactElement {
  const [query, setQuery] = useState('');
  const filteredStocks = useMemo(() => {
    const normalizedQuery = query.trim().toUpperCase();
    return stocks.filter((stock) => `${stock.ticker} ${stock.sector}`.toUpperCase().includes(normalizedQuery));
  }, [query, stocks]);

  return (
    <View className="px-margin gap-space-md pt-space-sm">
      <View className="gap-2">
        <Text className="text-headline-md text-on-surface">Cari Saham</Text>
        <Text className="text-body-compact text-on-surface-variant">Temukan emiten dan tambahkan ke favorit untuk melihatnya di Home.</Text>
        <View className="relative justify-center">
          <Image source={DUMMY_IMG} className="absolute left-3 z-10 h-4 w-4" resizeMode="contain" accessibilityLabel="Cari" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Cari ticker (BBCA, BBRI, ASII...)"
            placeholderTextColor="rgba(190,200,210,0.6)"
            className="bg-surface-container-lowest text-on-surface text-body-compact rounded-xl pl-9 pr-3 py-3"
            autoCapitalize="characters"
            autoCorrect={false}
            accessibilityLabel="Cari emiten berdasarkan ticker atau sektor"
          />
        </View>
      </View>
      {filteredStocks.map((stock) => {
        const isFavorite = favorites.includes(stock.ticker);
        return (
          <View key={stock.id} className="bg-surface-container rounded-xl p-3 flex-row items-center justify-between gap-2">
            <View className="flex-1">
              <Text className="text-headline-sm text-on-surface">{stock.ticker}</Text>
              <Text className="text-body-compact text-on-surface-variant">{stock.sector} · PER {stock.per} · PBV {stock.pbv} · {stock.price}</Text>
            </View>
            <Pressable onPress={() => onToggleFavorite(stock.ticker)} className="min-h-11 min-w-11 px-2 rounded-lg bg-surface-container-high items-center justify-center" accessibilityRole="button" accessibilityLabel={isFavorite ? `Hapus ${stock.ticker} dari favorit` : `Tambahkan ${stock.ticker} ke favorit`}>
              <Image source={DUMMY_IMG} className="h-5 w-5" resizeMode="contain" accessibilityLabel={isFavorite ? 'Sudah menjadi favorit' : 'Tambahkan ke favorit'} />
            </Pressable>
          </View>
        );
      })}
      {filteredStocks.length === 0 && <Text className="text-body-default text-on-surface-variant">Saham tidak ditemukan.</Text>}
    </View>
  );
}
