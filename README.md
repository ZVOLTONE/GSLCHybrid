# Market Intelligence App

Aplikasi analitik pasar modal dan intelijen saham berbasis React Native dan Expo.

---

## f. [LO 1 – 5 Points] Penjelasan Konsep React Native

### 1. Cara Kerja React Native
React Native bekerja dengan memisahkan arsitektur aplikasi ke dalam dua thread utama, yaitu **JavaScript Thread** dan **Native Thread (UI Thread)**. Logika bisnis serta kode antarmuka yang ditulis dalam JavaScript atau TypeScript dieksekusi oleh mesin runtime (seperti Hermes). Komunikasi antara kode JavaScript dengan API dan komponen asli sistem operasi dilakukan melalui jembatan komunikasi (*Bridge*) atau antarmuka langsung berbasis *JavaScript Interface* (JSI) pada arsitektur modern. Berbeda dengan pendekatan hybrid konvensional yang membungkus kode HTML/CSS di dalam WebView, React Native memetakan elemen JSX secara langsung ke komponen antarmuka asli platform target, seperti `UIView` pada iOS dan `android.view.View` pada Android. Hasilnya, aplikasi memiliki tampilan, sentuhan interaksi, dan responsivitas layaknya aplikasi native murni.

### 2. Keunggulan React Native untuk Aplikasi Hybrid
1. **Efisiensi Basis Kode Tunggal (Single Codebase):** Pengembang dapat membagikan mayoritas kode logika, antarmuka, dan manajemen data untuk platform Android dan iOS sekaligus. Hal ini memangkas waktu pengembangan, menyederhanakan siklus rilis, serta menekan biaya pemeliharaan aplikasi secara drastis.
2. **Performa Nyata Mendekati Native:** Karena merender widget asli sistem operasi dan tidak bergantung pada rendering DOM browser, aplikasi memiliki performa tinggi, animasi yang mulus, serta integrasi mendalam ke perangkat keras seperti kamera, biometrik, dan sensor lokal.
3. **Ekosistem Matang dan Produktivitas Tinggi:** Dukungan komunitas yang masif menyediakan pustaka siap pakai untuk beragam kebutuhan. Selain itu, fitur *Fast Refresh* memungkinkan pengembang melihat hasil perubahan kode secara langsung dalam hitungan detik tanpa harus mengompilasi ulang proyek dari awal.

### 3. Konsep Inti: Komponen, Props, State, dan Navigasi
1. **Komponen (Component):** Blok pembangun modular yang independen dan dapat digunakan kembali (*reusable*) untuk menyusun tampilan antarmuka dan menangani perilaku UI.
2. **Props (Properties):** Argumen atau parameter yang dikirimkan dari komponen induk (*parent*) ke komponen anak (*child*). Props bersifat *read-only* (*immutable*) sehingga komponen anak tidak dapat mengubah nilai props tersebut secara sepihak.
3. **State:** Penyimpanan data lokal dan dinamis di dalam komponen yang dapat dimodifikasi (misalnya melalui `useState`). Setiap kali nilai state diperbarui, komponen terkait akan melakukan proses render ulang (*re-render*) secara otomatis untuk memperbarui tampilan.
4. **Navigasi (Navigation):** Mekanisme yang mengatur transisi, perpindahan layar, serta riwayat penjelajahan pengguna di dalam aplikasi (dapat berupa stack, tab, maupun *conditional routing* berbasis state).

---

### 4. Contoh Kode Sendiri (Implementasi Komponen, Props, State, & Navigasi)

Berikut adalah contoh kode mandiri yang menggabungkan keempat konsep di atas:

```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';

// ==========================================
// 1. KOMPONEN & PROPS (Komponen Anak / Child)
// Menerima data melalui PROPS (read-only)
// ==========================================
interface StockCardProps {
  ticker: string;
  price: string;
  onSelect: (ticker: string) => void; // Fungsi callback via props
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

// ==========================================
// 2. STATE & NAVIGASI (Komponen Induk / Parent)
// Mengelola data dinamis (STATE) dan alur layar (NAVIGASI)
// ==========================================
export default function App() {
  // STATE: Menyimpan layar aktif untuk navigasi & saham yang dipilih
  const [currentScreen, setCurrentScreen] = useState<'list' | 'detail'>('list');
  const [selectedStock, setSelectedStock] = useState<string>('');

  // NAVIGASI: Fungsi transisi antar layar
  const handleNavigateToDetail = (ticker: string) => {
    setSelectedStock(ticker);
    setCurrentScreen('detail'); // Mengubah state memicu navigasi ke Detail
  };

  const handleNavigateBack = () => {
    setCurrentScreen('list'); // Navigasi kembali ke Daftar
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* NAVIGASI BERSYARAT (Conditional Rendering Navigation) */}
      {currentScreen === 'list' ? (
        <View>
          <Text style={styles.header}>Daftar Saham Pilihan</Text>
          
          {/* Melewatkan data ke Komponen Anak melalui PROPS */}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#121212' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 16 },
  card: { backgroundColor: '#1E1E1E', padding: 16, borderRadius: 8, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#4EDEA3' },
  cardSubtitle: { fontSize: 14, color: '#A0A0A0', marginVertical: 6 },
  detailButton: { backgroundColor: '#2E7D32', padding: 8, borderRadius: 4, alignItems: 'center' },
  backButton: { backgroundColor: '#424242', padding: 10, borderRadius: 6, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold' },
  infoText: { fontSize: 14, color: '#CCCCCC', marginTop: 8 }
});
```
