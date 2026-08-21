import LegalLayout from './LegalLayout.jsx';
import { CONFIG } from '../config.js';
import { FileText, CheckCircle2, AlertCircle, RefreshCw, Scale, ShieldAlert } from 'lucide-react';

export default function TermsConditions() {
  return (
    <LegalLayout
      title="Syarat & Ketentuan Layanan"
      subtitle={`Ketentuan Penggunaan Lisensi Digital SmartFeed (${CONFIG.companyName})`}
      activeTab="terms"
    >
      <div className="space-y-8">
        {/* Intro */}
        <section className="space-y-3">
          <p className="text-text-mut leading-relaxed">
            Selamat datang di <strong className="text-text">{CONFIG.brandName}</strong>. Syarat dan Ketentuan berikut mengatur hak dan kewajiban antara Anda sebagai pengguna/pembeli dan <strong className="text-text">{CONFIG.companyName}</strong> sebagai pengelola dan pemilik sah platform <span className="font-semibold text-text">https://smartfeed.berandadigital.net</span>.
          </p>
          <p className="text-text-mut leading-relaxed">
            Dengan melakukan pembelian lisensi, mendaftar, atau mengakses aplikasi web SmartFeed Studio, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan di bawah ini.
          </p>
        </section>

        {/* Section 1: Definisi & Hak Lisensi */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-accent font-bold text-base">
            <FileText className="w-5 h-5" />
            <h2>1. Definisi Layanan & Lisensi Penggunaan</h2>
          </div>
          <ul className="list-disc list-inside text-text-mut space-y-1.5 pl-1">
            <li><strong>SmartFeed:</strong> Layanan aplikasi berbasis web (SaaS) untuk pembuatan materi desain visual promosi, banner iklan, carousel, copywriting, dan generator naskah berbasis AI.</li>
            <li><strong>Lisensi Pengguna:</strong> Pembelian memberikan hak akses digital nontransferable (kecuali paket lisensi reseller resmi) untuk menggunakan alat generator dalam studio web.</li>
            <li><strong>Kepemilikan Karya:</strong> Seluruh materi konten, gambar, dan naskah yang dihasilkan oleh pengguna menggunakan SmartFeed adalah hak milik penuh pengguna dan bebas digunakan untuk kebutuhan promosi komersial maupun pribadi.</li>
          </ul>
        </section>

        {/* Section 2: Mekanisme Transaksi & Pembayaran */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-accent font-bold text-base">
            <CheckCircle2 className="w-5 h-5" />
            <h2>2. Mekanisme Pembayaran & Pengiriman Akses Digital</h2>
          </div>
          <p className="text-text-mut leading-relaxed">
            Seluruh transaksi pembayaran dilakukan dalam mata uang Rupiah (IDR) melalui gerbang pembayaran resmi mitra kami (<strong>TriPay Payment Gateway</strong>) dengan metode pembayaran yang tersedia (QRIS, Virtual Account Bank, E-Wallet, dan Gerai Retail).
          </p>
          <div className="p-4 rounded-xl bg-bg border border-border/80 text-text-mut space-y-2 text-xs">
            <p>
              <strong>Penyerahan Produk (Instant Delivery):</strong> Karena SmartFeed merupakan produk perangkat lunak digital (intangible digital product), akses aplikasi langsung diaktifkan seketika setelah notifikasi pembayaran terkonfirmasi otomatis oleh sistem gateway pembayaran.
            </p>
          </div>
        </section>

        {/* Section 3: Kebijakan Pengembalian Dana (Refund Policy) */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-accent font-bold text-base">
            <RefreshCw className="w-5 h-5" />
            <h2>3. Kebijakan Pengembalian Dana (Refund Policy)</h2>
          </div>
          <p className="text-text-mut leading-relaxed">
            Kami berkomitmen memberikan kualitas layanan terbaik. Mengingat sifat produk adalah akses perangkat lunak digital instan:
          </p>
          <ul className="list-disc list-inside text-text-mut space-y-1.5 pl-1">
            <li><strong>Klaim Refund Valid:</strong> Pengembalian dana penuh akan diproses apabila terjadi pembayaran ganda (duplicate payment) yang tidak disengaja oleh pengguna untuk invoice yang sama, atau apabila sistem web app mengalami gangguan server total yang tidak dapat diselesaikan oleh tim teknis kami dalam waktu lebih dari 3 x 24 jam.</li>
            <li><strong>Prosedur Klaim:</strong> Permintaan refund harus diajukan melalui email resmi <a href={`mailto:${CONFIG.contactEmail}`} className="text-accent underline">{CONFIG.contactEmail}</a> atau WhatsApp CS <a href={`https://wa.me/62${CONFIG.contactPhone.replace(/^0/, '')}`} className="text-accent underline">{CONFIG.contactPhoneDisplay}</a> dengan melampirkan bukti transaksi resmi dari TriPay.</li>
          </ul>
        </section>

        {/* Section 4: Larangan Penggunaan */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-accent font-bold text-base">
            <ShieldAlert className="w-5 h-5" />
            <h2>4. Larangan Penggunaan (Acceptable Use)</h2>
          </div>
          <p className="text-text-mut leading-relaxed">
            Pengguna dilarang keras menggunakan layanan SmartFeed untuk:
          </p>
          <ul className="list-disc list-inside text-text-mut space-y-1.5 pl-1">
            <li>Membuat materi visual atau naskah promosi yang melanggar hukum Republik Indonesia (seperti pornografi, judi online, ujaran kebencian, penipuan, atau pelanggaran SARA).</li>
            <li>Melakukan tindakan peretasan (hacking), reverse engineering kode program, atau serangan DDoS terhadap server SmartFeed.</li>
          </ul>
        </section>

        {/* Section 5: Hukum yang Berlaku */}
        <section className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-accent font-bold text-base">
            <Scale className="w-5 h-5" />
            <h2>5. Hukum yang Berlaku & Kontak Penyelesaian</h2>
          </div>
          <p className="text-text-mut leading-relaxed">
            Syarat dan ketentuan ini tunduk dan ditafsirkan berdasarkan hukum Negara Kesatuan Republik Indonesia. Segala perselisihan akan diupayakan untuk diselesaikan secara musyawarah untuk mufakat terlebih dahulu.
          </p>
          <div className="p-4 rounded-xl bg-bg border border-border text-xs space-y-1">
            <div><strong>Pengelola Resmi:</strong> {CONFIG.companyName}</div>
            <div><strong>Alamat:</strong> {CONFIG.contactAddress}</div>
            <div><strong>Email Bantuan:</strong> {CONFIG.contactEmail}</div>
            <div><strong>Hotline WhatsApp:</strong> {CONFIG.contactPhoneDisplay}</div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
