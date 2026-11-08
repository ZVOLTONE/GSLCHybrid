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

const DUMMY_IMG = require('../../assets/dummy.png');

type IndexKey = 'ihsg' | 'lq45' | 'idx30';
type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

interface KpiCard {
  id: string;
  label: string;
  iconText: string;
  iconColor: string;
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
  icon: string;
  active: boolean;
}

const KPI_CARDS: KpiCard[] = [
  {
    id: 'composite',
    label: 'COMPOSITE',
    iconText: '↗',
    iconColor: 'text-primary',
    primary: '7,720.45',
    primaryColor: 'text-on-surface',
    line1: '+0.55%',
    line1Color: 'text-tertiary',
    line2: 'Vol 18.4B sh',
    line2Color: 'text-on-surface-variant',
  },
  {
    id: 'emiten',
    label: 'EMITEN BASE',
    iconText: '⬛',
    iconColor: 'text-secondary',
    primary: '934',
    primaryColor: 'text-on-surface',
    line1: '+3 IPO',
    line1Color: 'text-tertiary',
    line2: 'L:42 • M:186 • S:706',
    line2Color: 'text-on-surface-variant',
  },
  {
    id: 'deepvalue',
    label: 'DEEP VALUE',
    iconText: '◈',
    iconColor: 'text-primary-container',
    primary: '142',
    primaryColor: 'text-primary-container',
    line1: 'Stocks',
    line1Color: 'text-on-surface-variant',
    line2: '< -1.0σ 5Y PER/PBV',
    line2Color: 'text-on-surface-variant',
  },
  {
    id: 'multiples',
    label: 'MULTIPLES',
    iconText: '◉',
    iconColor: 'text-tertiary',
    primary: '14.8x',
    primaryColor: 'text-on-surface',
    line1: '-8.6% 5Y',
    line1Color: 'text-error',
    line2: 'PBV 1.95x · Yield 3.42%',
    line2Color: 'text-on-surface-variant',
  },
];

const ARCHETYPES: ArchetypeCard[] = [
  {
    id: 'valuation',
    companies: '34 Companies',
    companiesBg: 'bg-primary/10',
    companiesColor: 'text-primary',
    metric: 'Avg PER 7.2x',
    title: 'Attractive Valuation',
    description: 'Discounted PER & PBV trading below 5Y historical sector medians with positive FCF.',
    topStocks: 'Top: ASII, INDF, PGAS',
  },
  {
    id: 'profitability',
    companies: '28 Companies',
    companiesBg: 'bg-tertiary/10',
    companiesColor: 'text-tertiary',
    metric: 'ROE > 18%',
    title: 'Strong Profitability',
    description: 'Exceptional capital productivity. ROE consistently exceeding 18% and ROA above 8%.',
    topStocks: 'Top: BBCA, UNVR, ICBP',
  },
  {
    id: 'balance',
    companies: '52 Companies',
    companiesBg: 'bg-secondary/10',
    companiesColor: 'text-secondary',
    metric: 'DER < 0.4x',
    title: 'Healthy Balance Sheet',
    description: 'Net cash or low gearing with ICR > 8x, resilient against macro interest rate shocks.',
    topStocks: 'Top: CPIN, KLBF, MYOR',
  },
  {
    id: 'dividend',
    companies: '19 Companies',
    companiesBg: 'bg-tertiary/10',
    companiesColor: 'text-tertiary',
    metric: 'Yield > 6.5%',
    title: 'Dividend Aristocrats',
    description: 'Sustainable dividend yield over 6.5% backed by healthy payout ratio (35%–70%).',
    topStocks: 'Top: ITMG, PTBA, BJBR',
  },
];

const BLUE_CHIPS: BlueChipStock[] = [
  {
    id: 'bbca',
    abbr: 'CA',
    ticker: 'BBCA',
    sector: 'Fin',
    per: '23.4x',
    perColor: 'text-on-surface',
    pbv: '4.7x',
    price: 'Rp 10,650',
    change: '+1.19%',
    changePositive: true,
  },
  {
    id: 'bbri',
    abbr: 'RI',
    ticker: 'BBRI',
    sector: 'Fin',
    per: '11.2x',
    perColor: 'text-on-surface',
    pbv: '2.1x',
    price: 'Rp 4,820',
    change: '-0.62%',
    changePositive: false,
  },
  {
    id: 'tlkm',
    abbr: 'TL',
    ticker: 'TLKM',
    sector: 'Telco',
    per: '12.8x',
    perColor: 'text-on-surface',
    pbv: '2.3x',
    price: 'Rp 2,980',
    change: '+0.34%',
    changePositive: true,
  },
  {
    id: 'asii',
    abbr: 'AS',
    ticker: 'ASII',
    sector: 'Conglom',
    per: '6.8x',
    perColor: 'text-tertiary',
    pbv: '1.05x',
    price: 'Rp 5,175',
    change: '+1.47%',
    changePositive: true,
  },
];

const NAV_TABS: NavTab[] = [
  { id: 'overview',  label: 'Overview',  icon: '◈', active: true  },
  { id: 'screener',  label: 'Screener',  icon: '⊟', active: false },
  { id: 'stock',     label: 'Stock',     icon: '◉', active: false },
  { id: 'sector',    label: 'Sector',    icon: '◑', active: false },
  { id: 'watchlist', label: 'Watchlist', icon: '◇', active: false },
];

const INDEX_TABS: IndexKey[] = ['ihsg', 'lq45', 'idx30'];
const TIME_RANGES: TimeRange[] = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

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

export default function MarketOverviewScreen(): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState<IndexKey>('ihsg');
  const [activeRange, setActiveRange] = useState<TimeRange>('3M');
  const [searchQuery, setSearchQuery] = useState('');

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
                Session II • Overview
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
            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center overflow-hidden">
              <Image source={DUMMY_IMG} className="w-8 h-8 rounded-full" resizeMode="cover" />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{ paddingBottom: 88 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-margin gap-space-md pt-space-sm">

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
                <Text className="text-headline-sm text-on-surface">IHSG</Text>
                <Text className="text-metric-large text-on-surface font-semibold tracking-tight">
                  7,720.45
                </Text>
              </View>
              <View className="flex-row items-center gap-2 mt-0.5">
                <Text className="text-label-mono-sm text-tertiary font-semibold">
                  ▲ +0.55% (+42.18)
                </Text>
                <Text className="text-on-surface-variant/40">•</Text>
                <Text className="text-label-mono-sm text-on-surface-variant">Turnover Rp 12.4T</Text>
              </View>
            </View>

            <View className="items-end shrink-0">
              <SparklineSvg />
              <Text className="text-[9px] text-tertiary mt-1 uppercase tracking-wider font-semibold">
                Session II Active
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
                  <Text className={`text-[15px] ${card.iconColor}`}>{card.iconText}</Text>
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
                      {stock.changePositive ? '▲' : '▼'} {stock.change}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} className="bg-surface-container-lowest/90 absolute bottom-0 left-0 right-0">
        <View className="h-16 px-1 flex-row items-center justify-around">
          {NAV_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              className="flex-1 h-full min-w-11 flex-col items-center justify-center gap-0.5"
            >
              {tab.active && (
                <View className="absolute top-0 w-8 h-0.5 rounded-full bg-primary-container" />
              )}
              <Text className={`text-[22px] ${tab.active ? 'text-primary-container' : 'text-on-surface-variant'}`}>
                {tab.icon}
              </Text>
              <Text className={`text-label-badge leading-tight ${
                tab.active ? 'text-primary-container font-semibold' : 'text-on-surface-variant'
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
