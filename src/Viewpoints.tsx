import { useState } from 'react';
import { useLanguage } from './i18n';

const views = {
  owner: {
    eyebrow: 'UNTUK OWNER & TIM KANTOR',
    title: 'Lihat pekerjaan tanpa harus menebak-nebak.',
    body: 'Dari permintaan pelanggan sampai tagihan, informasi penting punya tempatnya. Kamu bisa mengikuti progres dan menentukan langkah berikutnya dengan konteks yang lebih jelas.',
    cards: [
      ['01', 'Prioritas terlihat', 'Tahu pekerjaan mana yang menunggu tindakan.'],
      ['02', 'Konteks tersambung', 'Survei, penawaran, dan job berada dalam alur yang sama.'],
      ['03', 'Penutupan rapi', 'Instalasi, invoice, dan pembayaran dapat diikuti.'],
    ],
  },
  field: {
    eyebrow: 'UNTUK SURVEYOR & INSTALLER',
    title: 'Berangkat dengan tugas yang lebih jelas.',
    body: 'AlumiFlow Field membawa detail pekerjaan ke lapangan. Tim dapat melihat tugas, mencatat ukuran, foto, kendala, dan hasil kerja; aktivitas tertentu tetap bisa dicatat saat koneksi terbatas.',
    cards: [
      ['01', 'Tugas di tangan', 'Lokasi, jadwal, dan konteks pekerjaan mudah diakses.'],
      ['02', 'Bukti tertata', 'Catatan, foto, dan hasil lapangan mengikuti pekerjaan.'],
      ['03', 'Kembali ke kantor', 'Perubahan yang menunggu dapat disinkronkan saat online.'],
    ],
  },
} as const;

type View = keyof typeof views;

export default function Viewpoints() {
  const { t } = useLanguage();
  const [view, setView] = useState<View>('owner');
  const data = views[view];

  return <section id="untuk-tim" className="view-section section-space" aria-labelledby="view-title">
    <div className="wrap">
      <div className="view-heading">
        <div><span className="view-eyebrow">{t('BAB 04 · DARI DUA SISI')}</span><h2 id="view-title" className="section-title">{t('Satu flow.')}<br />{t('Dua cara mengalaminya.')}</h2></div>
        <div className="view-switch" role="group" aria-label={t('Pilih sudut pandang')}>
          <button type="button" aria-pressed={view === 'owner'} className={view === 'owner' ? 'active' : ''} onClick={() => setView('owner')}>{t('Owner & kantor')}</button>
          <button type="button" aria-pressed={view === 'field'} className={view === 'field' ? 'active' : ''} onClick={() => setView('field')}>{t('Tim lapangan')}</button>
        </div>
      </div>
      <div key={view} className="view-panel">
        <div className="view-message"><span>{t(data.eyebrow)}</span><h3>{t(data.title)}</h3><p>{t(data.body)}</p><a href="#demo">{t('Bahas alur workshopmu')} <span aria-hidden="true">↗</span></a></div>
        <div className="view-cards">{data.cards.map(([number, title, body]) => <div className="view-card" key={number}><span>{number}</span><div><h4>{t(title)}</h4><p>{t(body)}</p></div><span className="view-arrow" aria-hidden="true">↗</span></div>)}</div>
      </div>
    </div>
  </section>;
}
