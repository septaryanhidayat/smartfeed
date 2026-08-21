import LegalLayout from './LegalLayout.jsx';
import { CONFIG } from '../config.js';
import { ShieldCheck, Lock, Eye, Database, Server, UserCheck, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Kebijakan Privasi"
      subtitle={`Ketentuan Perlindungan Data Pengguna di SmartFeed (${CONFIG.companyName})`}
      activeTab="privacy"
    >
      <div className="space-y-8">
        {/* Intro */}
        <section className="space-y-3">
          <p className="text-text-mut leading-relaxed">
            Selamat datang di <strong className="text-text">{CONFIG.brandName}</strong> (<a href="https://smartfeed.berandadigital.net" className="text-accent underline">https://smartfeed.berandadigital.net</a>), layanan perangkat lunak dan generator konten visual berbasis web yang dikembangkan, dimiliki, dan dioperasikan oleh <strong className="text-text">{CONFIG.companyName}</strong>.
          </p>
          <p className="text-text-mut leading-relaxed">
            Kami sangat menghormati dan berkomitmen untuk melindungi privasi serta keamanan data pribadi Anda sesuai dengan peraturan perundang-undangan perlindungan data pribadi yang berlaku di Republik Indonesia (Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi).
          </p>
        </section>

        {/* Section 1: Informasi yang Dikumpulkan */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-accent font-bold text-base">
            <Database className="w-5 h-5" />
            <h2>1. Data dan Informasi yang Kami Kumpulkan</h2>
          </div>
          <p className="text-text-mut leading-relaxed">
            Saat Anda mendaftar, membeli lisensi, atau menggunakan layanan SmartFeed, kami mengumpulkan data yang diperlukan untuk pemrosesan transaksi dan penyediaan layanan:
          </p>
          <ul className="list-disc list-inside text-text-mut space-y-1.5 pl-1">
            <li><strong>Data Identitas Kontak:</strong> Nama lengkap, alamat email aktif, dan nomor telepon/WhatsApp.</li>
            <li><strong>Data Transaksi:</strong> Nomor invoice, nominal pembayaran, tanggal transaksi, metode pembayaran yang dipilih (QRIS, Virtual Account, E-Wallet, Retail), dan status transaksi.</li>
            <li><strong>Data Log Teknis:</strong> Alamat IP, jenis peramban (browser), sistem operasi, serta data analitik aktivitas penggunaan untuk keamanan sistem.</li>
          </ul>
        </section>

        {/* Section 2: Tujuan Penggunaan Data */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-accent font-bold text-base">
            <Eye className="w-5 h-5" />
            <h2>2. Tujuan Penggunaan Informasi</h2>
          </div>
          <p className="text-text-mut leading-relaxed">
            Informasi yang kami peroleh digunakan untuk:
          </p>
          <ul className="list-disc list-inside text-text-mut space-y-1.5 pl-1">
            <li>Memproses verifikasi transaksi dan aktivasi lisensi digital secara otomatis.</li>
            <li>Mengirimkan tanda terima pembayaran (invoice), kredensial akses akun, serta notifikasi penting terkait layanan.</li>
            <li>Memberikan dukungan teknis (Customer Support) saat Anda mengalami kendala pada aplikasi studio.</li>
            <li>Mencegah tindakan penipuan, penyalahgunaan sistem, atau pelanggaran ketentuan hukum.</li>
          </ul>
        </section>

        {/* Section 3: Keamanan Pembayaran & Pihak Ketiga */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-accent font-bold text-base">
            <Lock className="w-5 h-5" />
            <h2>3. Keamanan Transaksi & Payment Gateway Pihak Ketiga</h2>
          </div>
          <p className="text-text-mut leading-relaxed">
            Seluruh transaksi pembayaran diproses melalui gerbang pembayaran resmi mitra kami yaitu <strong>TriPay Payment Gateway</strong> (dan mitra berlisensi Bank Indonesia lainnya).
          </p>
          <div className="p-4 rounded-xl bg-bg border border-border/80 text-text-mut space-y-2">
            <div className="font-semibold text-text flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Jaminan Keamanan Data Finansial
            </div>
            <p className="text-xs leading-relaxed">
              <strong className="text-text">{CONFIG.companyName}</strong> <strong>TIDAK PERNAH</strong> menyimpan data sensitif seperti nomor kartu debit/kredit, kode CVV/CVC, maupun PIN perbankan Anda. Seluruh proses pembayaran dienkripsi menggunakan protokol industri standar perbankan (SSL/TLS 256-bit).
            </p>
          </div>
        </section>

        {/* Section 4: Penyimpanan & Perlindungan Data */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-accent font-bold text-base">
            <Server className="w-5 h-5" />
            <h2>4. Penyimpanan dan Perlindungan Data</h2>
          </div>
          <p className="text-text-mut leading-relaxed">
            Data Anda disimpan pada server cloud yang aman dengan firewall berlapis dan kontrol akses yang ketat. Kami tidak akan pernah menjual, menyewakan, atau memindahtangankan data pribadi Anda kepada pihak ketiga manapun untuk tujuan pemasaran tanpa persetujuan eksplisit dari Anda.
          </p>
        </section>

        {/* Section 5: Hak Pengguna & Kontak */}
        <section className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-accent font-bold text-base">
            <UserCheck className="w-5 h-5" />
            <h2>5. Hak Pengguna dan Hubungi Kami</h2>
          </div>
          <p className="text-text-mut leading-relaxed">
            Anda berhak meminta pembaruan, koreksi, atau penghapusan data kontak Anda dari basis data kami sewaktu-waktu dengan menghubungi Tim Dukungan Privasi kami melalui:
          </p>
          <div className="p-4 rounded-xl bg-bg border border-border text-xs space-y-1.5">
            <div><strong>Entitas Pengelola:</strong> {CONFIG.companyName}</div>
            <div><strong>Alamat:</strong> {CONFIG.contactAddress}</div>
            <div><strong>Email Resmi:</strong> <a href={`mailto:${CONFIG.contactEmail}`} className="text-accent underline">{CONFIG.contactEmail}</a></div>
            <div><strong>WhatsApp:</strong> <a href={`https://wa.me/62${CONFIG.contactPhone.replace(/^0/, '')}`} className="text-accent underline">{CONFIG.contactPhoneDisplay}</a></div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
