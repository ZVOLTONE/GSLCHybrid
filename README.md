# Market Intelligence App

![Alt Text](<assets/Home.jpeg>)

Otrum adalah platform market intelligence yang membantu investor memahami kondisi fundamental perusahaan, membandingkan valuasi emiten dalam kelompok industri yang relevan, dan menyusun kriteria analisis berdasarkan preferensi investasi mereka sendiri.
### Masalah
setiap investor memiliki preferensi analisis yang berbeda. Sebagian investor lebih mengutamakan valuasi, sedangkan investor lainnya lebih memperhatikan profitabilitas, pertumbuhan bisnis, atau kesehatan keuangan perusahaan.

### Target Pengguna
Target utama aplikasi Otrum adalah investor ritel yang menggunakan analisis fundamental sebagai salah satu dasar pengambilan keputusan investasi.

Beberapa kebutuhan:

Memahami indikator fundamental dasar seperti P/E, P/B, dan ROE.

Membandingkan beberapa perusahaan sebelum mengambil keputusan investasi.

Membutuhkan informasi fundamental yang terstruktur.

Menginginkan proses analisis yang lebih cepat dan sistematis.

Membandingkan perusahaan dalam sektor atau industri yang sama.

### Pemetaan Kebutuhan ke Layar dan Komponen
## Pemetaan Kebutuhan ke Layar dan Komponen

Note: ini beberapa masih berupa konsep pak nanti kita lihat apakah ada yang saya buang wkwkwk

| Kebutuhan Pengguna | Layar | Komponen |
|---|---|---|
| Melihat ringkasan kondisi pasar saham | Home | Market Summary, Market Index, Market Overview |
| Mengakses saham yang menjadi perhatian | Home | Favorite Stocks, Stock Watchlist |
| Mencari saham berdasarkan nama atau kode saham | Screener | Search Bar, Stock List |
| Menyaring saham berdasarkan sektor dan industri | Screener | Sector Filter, Industry Filter |
| Melihat data fundamental perusahaan | Stock Detail | Fundamental Metrics, Financial Overview |
| Membandingkan beberapa perusahaan | Comparison | Company Selector, Comparison Table, Comparison Chart |
| Membuat strategi analisis berdasarkan preferensi | Strategy Builder | Strategy Form, Metric Selector, Weight Configuration |
| Menentukan bobot setiap metrik penilaian | Strategy Builder | Weight Input, Weight Distribution |
| Melihat hasil penilaian saham berdasarkan strategi | Strategy Builder / Comparison | Scoring Result, Ranking List, Score Breakdown |
| Memahami sumber dan periode data yang digunakan | Stock Detail / Comparison | Data Source, Reporting Period, Data Status |
| Melihat informasi perusahaan dan anak usahanya | Company Detail | Company Overview, Subsidiary List |
| Melihat pemegang saham perusahaan | Company Detail | Shareholder List, Ownership Structure |

### Struktur Navigasi

Navigasi utama aplikasi terdiri dari:

- **Home:** Menampilkan ringkasan pasar dan saham favorit.
- **Screener:** Memungkinkan pengguna mencari dan menyaring saham berdasarkan kriteria tertentu.
- **Stock:** Menampilkan daftar saham dan akses menuju detail perusahaan.

Sementara itu, fitur **Strategy Builder** dan **Comparison** diakses melalui halaman fitur, bukan sebagai bagian dari navigasi utama.

Halaman detail perusahaan memiliki beberapa tab:

- **Overview:** Ringkasan informasi perusahaan.
- **Fundamentals:** Informasi kinerja dan kondisi keuangan.
- **Valuation:** Informasi valuasi saham.
- **Company Structure:** Struktur perusahaan dan anak usaha.
- **Shareholders:** Informasi kepemilikan saham.
### Rencana pengembangan
Integrasi Yahoo Finance melalui yfinance, pencarian perusahaan, pengambilan data fundamental, dan validasi data.
Implementasi pemilihan dimensi, pengaturan bobot, kustomisasi metrik, dan preset strategi.

Link Video + Pelengkap=
https://drive.google.com/drive/folders/19wEaYxOag1Qwnm51ZxInoeA976zjEIZL?usp=sharing
### Cara setup
- npm ci
- npx expo start
- Note pastikan node js sudah terisntall
### 1. Cara Kerja React Native
Cara kerja utama React Native adalah dengan menjembatani kode JavaScript yang ditulis dengan komponen UI asli dari platform (Android atau iOS). Jadi React seperti penerjemah dari TS atau JS ke bahasa nativenya Android atau IOS dan developer tidak perlu mengubah TS untuk tiap device.

### 2. Keunggulan React Native untuk Aplikasi Hybrid
1. **Efisiensi Basis Kode Tunggal (Single Codebase):** Pengembang dapat membagikan mayoritas kode logika, antarmuka, dan manajemen data untuk platform Android dan iOS sekaligus. Hal ini memangkas waktu pengembangan, menyederhanakan siklus rilis, serta menekan biaya pemeliharaan aplikasi secara drastis.
2. **Performa Nyata Mendekati Native:** Karena merender widget asli sistem operasi dan tidak bergantung pada rendering DOM browser, aplikasi memiliki performa tinggi, animasi yang mulus, serta integrasi mendalam ke perangkat keras atau driver seperti kamera, biometrik, dan sensor lokal.
3. **Ekosistemnya Matang dari komunitas:** Perlu berterima kasih juga dari komunitas yang menyediakan library siap pakai sehingga memudahkan development, fitur Fast Refresh memungkinkan pengembang melihat hasil perubahan kode secara langsung dalam hitungan detik tanpa harus mengompilasi ulang proyek dari awal.

### 3. Konsep Inti: Komponen, Props, State, dan Navigasi
1. **Komponen (Component):** Blok pembangun modular yang independen dan dapat digunakan kembali (reusable) untuk menyusun tampilan antarmuka dan menangani perilaku UI.
2. **Props (Properties):** Argumen atau parameter yang dikirimkan dari komponen induk (parent) ke komponen anak (child). Props bersifat *ead-only (immutable) sehingga komponen anak tidak dapat mengubah nilai props tersebut secara sepihak.
3. **State:** Penyimpanan data lokal dan dinamis di dalam komponen yang dapat dimodifikasi (misalnya melalui useState). Setiap kali nilai state diperbarui, komponen terkait akan melakukan proses render ulang (re-render) secara otomatis untuk memperbarui tampilan.
4. **Navigasi (Navigation):** Mekanisme yang mengatur transisi, perpindahan layar, serta riwayat penjelajahan pengguna di dalam aplikasi (dapat berupa stack, tab, maupun conditional routing berbasis state).

---

### 4. Contoh Kode Sendiri (Implementasi Komponen, Props, State, & Navigasi)

Berikut adalah contoh kode mandiri yang menggabungkan keempat konsep di atas:

```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';

// KOMPONEN&PROPS(dilihat dari komponen child)
// Menerima data melalui PROPS 
interface StockCardProps {
  ticker: string;
  price: string;
  onSelect: (ticker: string) => void; 
}

function StockCard({ ticker, price, onSelect }: StockCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{ticker}</Text>
      <Text style={styles.cardSubtitle}>{price}</Text>
      <TouchableOpacity 
        style={styles.detailButton} 
        onPress={() => onSelect(ticker)}
      >
        <Text style={styles.buttonText}>Lihat Detail</Text>
      </TouchableOpacity>
    </View>
  );
}

// STATE & NAVIGASI (Komponen Induk/Parent)
export default function App() {
  //State: Menyimpan layar aktif untuk navigasi & saham yang dipilih
  const [currentScreen, setCurrentScreen] = useState<'list' | 'detail'>('list');
  const [selectedStock, setSelectedStock] = useState<string>('');

  //Navigasi: Fungsi transisi antar layar
  const handleNavigateToDetail = (ticker: string) => {
    setSelectedStock(ticker);
    setCurrentScreen('detail'); 
  };

  const handleNavigateBack = () => {
    setCurrentScreen('list'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentScreen === 'list' ? (
        <View>
          <Text style={styles.header}>Daftar Saham Pilihan</Text>
          
          <StockCard 
            ticker="BBCA" 
            price="Rp 10.150" 
            onSelect={handleNavigateToDetail} 
          />
          <StockCard 
            ticker="BBRI" 
            price="Rp 4.780" 
            onSelect={handleNavigateToDetail} 
          />
        </View>
      ) : (
        <View>
          <Text style={styles.header}>Detail Saham: {selectedStock}</Text>
          <Text style={styles.infoText}>Analisis valuasi dan tren harga untuk {selectedStock}.</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleNavigateBack}>
            <Text style={styles.buttonText}>← Kembali ke Daftar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}


```
