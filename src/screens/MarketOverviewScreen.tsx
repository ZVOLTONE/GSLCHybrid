import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, {
  Path,
  Circle,
  Line,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import type { SafeUser } from '../auth/useAuth';
import marketOverviewData from '../data/marketOverview.json';
import ScreenerScreen from './ScreenerScreen';
import StockSearchScreen from './StockSearchScreen';

const DUMMY_IMG = require('../../assets/dummy.png');

type IndexKey = 'ihsg' | 'lq45' | 'idx30';
type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

interface KpiCard {
  id: string;
  label: string;
  primary: string;
  primaryColor: string;
  line1: string;
  line1Color: string;
  line2: string;
  line2Color: string;
}

interface ArchetypeCard {
  id: string;
  companies: string;
  companiesBg: string;
  companiesColor: string;
  metric: string;
  title: string;
  description: string;
  topStocks: string;
}

interface BlueChipStock {
  id: string;
  abbr: string;
  ticker: string;
  sector: string;
  per: string;
  perColor: string;
  pbv: string;
  price: string;
  change: string;
  changePositive: boolean;
}

interface NavTab {
  id: string;
  label: string;
  active: boolean;
}

interface MarketSummary {
  indexName: string;
  value: string;
  change: string;
  changePoints: string;
  turnover: string;
  session: string;
}

export interface MarketOverviewScreenProps {
  user?: SafeUser | null;
  onLogout?: () => void;
}

const KPI_CARDS: KpiCard[] = marketOverviewData.kpiCards;
const ARCHETYPES: ArchetypeCard[] = marketOverviewData.archetypes;
const BLUE_CHIPS: BlueChipStock[] = marketOverviewData.blueChips;
const NAV_TABS: NavTab[] = marketOverviewData.navTabs;
const INDEX_TABS: IndexKey[] = marketOverviewData.indexTabs as IndexKey[];
const TIME_RANGES: TimeRange[] = marketOverviewData.timeRanges as TimeRange[];
const MARKET_SUMMARY: MarketSummary = marketOverviewData.marketSummary;

function SparklineSvg(): React.ReactElement {
  return (
    <Svg width={80} height={28} viewBox="0 0 80 28" style={{ overflow: 'visible' }}>
      <Defs>
        <LinearGradient id="sparklineGrad" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0%" stopColor="#4edea3" stopOpacity={0.3} />
          <Stop offset="100%" stopColor="#4edea3" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path
        d="M0 22 L10 20 L20 23 L32 14 L42 16 L54 8 L66 11 L80 3"
        stroke="#4edea3"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M0 22 L10 20 L20 23 L32 14 L42 16 L54 8 L66 11 L80 3 L80 28 L0 28 Z"
        fill="url(#sparklineGrad)"
      />
      <Circle cx={80} cy={3} r={2} fill="#4edea3" />
    </Svg>
  );
}

function AreaChartSvg(): React.ReactElement {
  return (
    <Svg width="100%" height={144} viewBox="0 0 320 140" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="areaGlowGrad" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
          <Stop offset="60%" stopColor="#4edea3" stopOpacity={0.08} />
          <Stop offset="100%" stopColor="#0f131d" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Line x1={0} x2={320} y1={25} y2={25} stroke="#313540" strokeWidth={0.75} strokeDasharray="3 3" opacity={0.4} />
      <Line x1={0} x2={320} y1={65} y2={65} stroke="#313540" strokeWidth={0.75} strokeDasharray="3 3" opacity={0.4} />
      <Line x1={0} x2={320} y1={105} y2={105} stroke="#313540" strokeWidth={0.75} strokeDasharray="3 3" opacity={0.4} />
      <Line x1={110} x2={110} y1={20} y2={125} stroke="#0ea5e9" strokeWidth={1} strokeDasharray="2 2" opacity={0.6} />
      <Circle cx={110} cy={80} r={3} fill="#0ea5e9" />
      <Line x1={220} x2={220} y1={20} y2={125} stroke="#4edea3" strokeWidth={1} strokeDasharray="2 2" opacity={0.6} />
      <Circle cx={220} cy={46} r={3} fill="#4edea3" />
      <Path
        d="M 0 115 Q 30 110, 55 98 T 110 80 T 160 88 T 220 46 T 275 38 L 320 22 L 320 140 L 0 140 Z"
        fill="url(#areaGlowGrad)"
      />
      <Path
        d="M 0 115 Q 30 110, 55 98 T 110 80 T 160 88 T 220 46 T 275 38 L 320 22"
        fill="none"
        stroke="#38bdf8"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <Circle cx={320} cy={22} r={3.5} fill="#38bdf8" />
      <Circle cx={320} cy={22} r={7} fill="#38bdf8" opacity={0.25} />
    </Svg>
  );
}

export default function MarketOverviewScreen({ user, onLogout }: MarketOverviewScreenProps): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState<IndexKey>('ihsg');
  const [activeRange, setActiveRange] = useState<TimeRange>('3M');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (ticker: string) => {
    setFavorites((current) => current.includes(ticker)
      ? current.filter((item) => item !== ticker)
      : [...current, ticker]);
  };

  const filteredChips = searchQuery
    ? BLUE_CHIPS.filter((s) => s.ticker.includes(searchQuery.toUpperCase().trim()))
    : BLUE_CHIPS;

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="light" />

      <SafeAreaView edges={['top']} className="bg-surface-container-lowest/80">
        <View className="h-14 px-margin flex-row items-center justify-between gap-1">
          <View className="flex-row items-center gap-2 flex-1 min-w-0">
            <View
              className="w-7 h-7 rounded-full items-center justify-center shrink-0"
              style={{ backgroundColor: '#0ea5e9', shadowColor: '#0ea5e9', shadowRadius: 8, shadowOpacity: 0.5 }}
            >
              <View className="w-2.5 h-2.5 rounded-full bg-surface-container-lowest/70" />
            </View>

            <View className="flex-col min-w-0 flex-1">
              <View className="flex-row items-center gap-1">
                <Text className="text-headline-sm text-on-surface tracking-tight" numberOfLines={1}>
                  Market Intel
                </Text>
                <View className="flex-row items-center gap-1 px-1.5 py-0.5 rounded-full bg-tertiary/10 shrink-0">
                  <View className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                  <Text className="text-label-badge text-tertiary uppercase tracking-wider">
                    IDX OPEN
                  </Text>
                </View>
              </View>
              <Text className="text-label-mono-sm text-on-surface-variant" numberOfLines={1}>
                {user?.name ? `${user.name} • Overview` : `${MARKET_SUMMARY.session} • Overview`}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-1 shrink-0">
            <Pressable
              className="w-11 h-11 items-center justify-center rounded-xl"
              accessibilityLabel="Notifications"
            >
              <Image source={DUMMY_IMG} className="w-5 h-5" resizeMode="contain" />
              <View className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-primary-container" />
            </Pressable>
            <TouchableOpacity
              onPress={onLogout}
              className="w-8 h-8 rounded-full bg-primary items-center justify-center overflow-hidden"
              activeOpacity={0.8}
              accessibilityLabel="User profile / Keluar"
            >
              <Image source={DUMMY_IMG} className="w-8 h-8 rounded-full" resizeMode="cover" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{ paddingBottom: 88 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === 'screener' ? (
          <View className="px-margin gap-space-md pt-space-sm">
            <ScreenerScreen favorites={favorites} onToggleFavorite={toggleFavorite} />
          </View>
        ) : activeTab === 'stock' ? (
          <StockSearchScreen stocks={BLUE_CHIPS} favorites={favorites} onToggleFavorite={toggleFavorite} />
        ) : (
        <View className="px-margin gap-space-md pt-space-sm">

          {favorites.length > 0 && (
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-headline-sm text-on-surface">Favorit Saya</Text>
                <Text className="text-label-mono-sm text-on-surface-variant">{favorites.length} saham</Text>
              </View>
              {BLUE_CHIPS.filter((stock) => favorites.includes(stock.ticker)).map((stock) => (
                <View key={stock.id} className="bg-surface-container rounded-xl p-3 flex-row items-center justify-between">
                  <View>
                    <Text className="text-headline-sm text-on-surface">{stock.ticker}</Text>
                    <Text className="text-label-mono-sm text-on-surface-variant">{stock.price} · PER {stock.per}</Text>
                  </View>
                  <TouchableOpacity onPress={() => toggleFavorite(stock.ticker)} className="min-h-11 min-w-11 items-center justify-center" accessibilityRole="button" accessibilityLabel={`Hapus ${stock.ticker} dari favorit`}>
                    <Image source={DUMMY_IMG} className="h-5 w-5" resizeMode="contain" accessibilityLabel="Saham favorit" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View className="flex-row items-center gap-1">
            <View className="flex-1 relative">
              <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
                <Image source={DUMMY_IMG} className="w-4 h-4" resizeMode="contain" />
              </View>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search ticker (BBCA, BBRI, ASII...)"
                placeholderTextColor="rgba(190,200,210,0.6)"
                className="bg-surface-container-lowest text-on-surface text-body-compact rounded-xl pl-9 pr-10 py-2"
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <View className="absolute right-2.5 top-0 bottom-0 justify-center">
                <View className="bg-surface-container-high px-1.5 py-0.5 rounded">
                  <Text className="text-label-mono-sm text-on-surface-variant/70 uppercase">IDX</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              className="w-9 h-9 rounded-xl bg-surface-container-low items-center justify-center shrink-0"
              activeOpacity={0.8}
              accessibilityLabel="Filter parameters"
            >
              <Image source={DUMMY_IMG} className="w-4 h-4" resizeMode="contain" />
              <View className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary-container" />
            </TouchableOpacity>
          </View>

          <View className="bg-surface-container-low rounded-xl p-space-sm flex-row items-center justify-between">
            <View className="flex-col min-w-0 flex-1 pr-2">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-headline-sm text-on-surface">{MARKET_SUMMARY.indexName}</Text>
                <Text className="text-metric-large text-on-surface font-semibold tracking-tight">
                  {MARKET_SUMMARY.value}
                </Text>
              </View>
              <View className="flex-row items-center gap-2 mt-0.5">
                <Text className="text-label-mono-sm text-tertiary font-semibold">
                  {MARKET_SUMMARY.change} ({MARKET_SUMMARY.changePoints})
                </Text>
                <Text className="text-on-surface-variant/40">•</Text>
                <Text className="text-label-mono-sm text-on-surface-variant">Turnover {MARKET_SUMMARY.turnover}</Text>
              </View>
            </View>

            <View className="items-end shrink-0">
              <SparklineSvg />
              <Text className="text-[9px] text-tertiary mt-1 uppercase tracking-wider font-semibold">
                {MARKET_SUMMARY.session}
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-space-sm">
            {KPI_CARDS.map((card) => (
              <View
                key={card.id}
                className="bg-surface-container rounded-xl p-3 flex-col justify-between overflow-hidden"
                style={{ width: '47.5%' }}
              >
                <View className="absolute -right-3 -top-3 w-12 h-12 bg-primary/5 rounded-full" />
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-label-badge text-on-surface-variant uppercase tracking-wider">
                    {card.label}
                  </Text>
                  <Image source={DUMMY_IMG} className="h-4 w-4" resizeMode="contain" accessibilityLabel={card.label} />
                </View>
                <View>
                  <Text className={`text-metric-large font-semibold tracking-tight ${card.primaryColor}`}>
                    {card.primary}
                  </Text>
                  <View className="flex-row items-center justify-between mt-1">
                    <Text className={`text-label-mono-sm font-semibold ${card.line1Color}`}>
                      {card.line1}
                    </Text>
                    <Text className={`text-label-mono-sm ${card.line2Color}`} numberOfLines={1}>
                      {card.line2}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View className="bg-surface-container-low rounded-2xl p-space-sm flex-col gap-space-xs">
            <View className="flex-row items-center justify-between">
              <View className="flex-row bg-surface-container-lowest p-0.5 rounded-lg gap-0.5">
                {INDEX_TABS.map((idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setActiveIndex(idx)}
                    className={`px-2.5 py-1 rounded ${
                      activeIndex === idx
                        ? 'bg-surface-container'
                        : ''
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-label-badge font-semibold uppercase ${
                        activeIndex === idx ? 'text-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      {idx.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View className="bg-surface-container-highest px-1.5 py-0.5 rounded">
                <Text className="text-[9px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  Demo Data
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between pt-1 pb-0.5">
              <View className="flex-row items-center gap-1">
                {TIME_RANGES.map((range) => (
                  <TouchableOpacity
                    key={range}
                    onPress={() => setActiveRange(range)}
                    className={`px-2 py-0.5 rounded ${
                      activeRange === range ? 'bg-surface-container' : ''
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-[11px] font-semibold ${
                        activeRange === range
                          ? 'text-primary-container'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      {range}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text className="text-[11px] text-tertiary font-semibold">
                ↑ +4.82% QTD
              </Text>
            </View>

            <View className="relative w-full bg-surface-container-lowest/60 rounded-xl p-2.5 overflow-hidden">
              <View className="absolute top-2.5 left-4 z-10 flex-row items-center gap-1.5">
                <View className="flex-row items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface-container-high/90">
                  <View className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                  <Text className="text-[9px] text-on-surface-variant">BI Rate 6.00%</Text>
                </View>
                <View className="flex-row items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface-container-high/90">
                  <View className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                  <Text className="text-[9px] text-tertiary">Q2 GDP +5.05%</Text>
                </View>
              </View>

              <View style={{ height: 144 }}>
                <AreaChartSvg />
              </View>

              <View className="flex-row items-center justify-between pt-1">
                <Text className="text-[10px] text-on-surface-variant/70">01 Jun (7,036)</Text>
                <Text className="text-[10px] text-on-surface-variant/70">01 Jul (7,320)</Text>
                <Text className="text-[10px] text-on-surface-variant/70">01 Aug (7,515)</Text>
                <Text className="text-[10px] text-primary font-semibold">Today (7,720)</Text>
              </View>
            </View>
          </View>

          <View className="flex-col gap-space-xs">
            <View className="flex-row items-center justify-between px-0.5">
              <View className="flex-row items-center gap-1.5">
                <Image source={DUMMY_IMG} className="w-4 h-4" resizeMode="contain" />
                <Text className="text-headline-sm text-on-surface">Fundamental Archetypes</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-label-badge text-primary">Screen All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
              style={{ marginHorizontal: -16 }}
            >
              {ARCHETYPES.map((card) => (
                <TouchableOpacity
                  key={card.id}
                  activeOpacity={0.8}
                  style={{ width: 245 }}
                  className="bg-surface-container rounded-xl p-3 flex-col justify-between shrink-0 overflow-hidden"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className={`px-2 py-0.5 rounded-full ${card.companiesBg}`}>
                      <Text className={`text-label-badge ${card.companiesColor}`}>
                        {card.companies}
                      </Text>
                    </View>
                    <Text className="text-[10px] text-on-surface-variant">{card.metric}</Text>
                  </View>
                  <View>
                    <Text className="text-headline-sm text-on-surface">{card.title}</Text>
                    <Text className="text-body-compact text-on-surface-variant mt-1" numberOfLines={2}>
                      {card.description}
                    </Text>
                  </View>
                  <View className="mt-3 pt-2.5 border-t border-surface-container-highest/60 flex-row items-center justify-between">
                    <Text className="text-[10px] text-tertiary">{card.topStocks}</Text>
                    <Text className="text-on-surface-variant text-[16px]">›</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View className="bg-surface-container-low rounded-2xl p-space-sm flex-col gap-space-xs">
            <View className="flex-row items-center justify-between px-1">
              <View className="flex-row items-center gap-1.5">
                <Image source={DUMMY_IMG} className="w-4 h-4" resizeMode="contain" />
                <Text className="text-headline-sm text-on-surface">Core Blue Chips</Text>
              </View>
              <Text className="text-label-mono-sm text-on-surface-variant">IDX30 Selected</Text>
            </View>

            <View className="flex-col gap-1.5 mt-1">
              {filteredChips.map((stock) => (
                <TouchableOpacity
                  key={stock.id}
                  activeOpacity={0.8}
                  className="bg-surface-container rounded-xl p-2.5 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-2.5 flex-1 min-w-0">
                    <View className="w-9 h-9 rounded-lg bg-surface-container-lowest items-center justify-center shrink-0">
                      <Text className="text-headline-sm text-primary font-bold">{stock.abbr}</Text>
                    </View>
                    <View className="flex-col min-w-0">
                      <View className="flex-row items-center gap-1.5">
                        <Text className="text-headline-sm text-on-surface font-semibold tracking-tight">
                          {stock.ticker}
                        </Text>
                        <View className="bg-surface-container-highest px-1 rounded">
                          <Text className="text-[10px] text-on-surface-variant">{stock.sector}</Text>
                        </View>
                      </View>
                      <View className="flex-row items-center gap-2 mt-0.5">
                        <Text className="text-[10px] text-on-surface-variant">
                          PER <Text className={`font-semibold ${stock.perColor}`}>{stock.per}</Text>
                        </Text>
                        <Text className="text-on-surface-variant">•</Text>
                        <Text className="text-[10px] text-on-surface-variant">
                          PBV <Text className="text-on-surface font-semibold">{stock.pbv}</Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="flex-col items-end shrink-0 pl-2">
                    <Text className="text-metric-default text-on-surface font-semibold">{stock.price}</Text>
                    <Text className={`text-label-mono-sm font-medium mt-0.5 ${
                      stock.changePositive ? 'text-tertiary' : 'text-error'
                    }`}>
                      <Image source={DUMMY_IMG} className="h-3 w-3" resizeMode="contain" accessibilityLabel={stock.changePositive ? 'Harga naik' : 'Harga turun'} /> {stock.change}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </View>
        )}
      </ScrollView>

      <SafeAreaView edges={['bottom']} className="bg-surface-container-lowest/90 absolute bottom-0 left-0 right-0">
        <View className="h-16 px-1 flex-row items-center justify-around">
          {NAV_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
              className="flex-1 h-full min-w-11 flex-col items-center justify-center gap-0.5"
            >
              {activeTab === tab.id && (
                <View className="absolute top-0 w-8 h-0.5 rounded-full bg-primary-container" />
              )}
              <Image source={DUMMY_IMG} className="h-5 w-5" resizeMode="contain" accessibilityLabel={tab.label} />
              <Text className={`text-label-badge leading-tight ${
                  activeTab === tab.id ? 'text-primary-container font-semibold' : 'text-on-surface-variant'
              }`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}
