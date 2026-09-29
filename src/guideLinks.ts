import type { Locale } from './i18n';

export type GuideKey = 'survey' | 'progress';

export const guidePaths: Record<GuideKey, Record<Locale, string>> = {
  survey: {
    id: '/panduan/alur-survei-sampai-instalasi/',
    en: '/en/guides/from-survey-to-installation/',
  },
  progress: {
    id: '/panduan/melacak-progres-order-workshop/',
    en: '/en/guides/track-workshop-order-progress/',
  },
};

export const guideSummaries: Record<GuideKey, Record<Locale, { title: string; description: string }>> = {
  survey: {
    id: { title: 'Alur Survei sampai Instalasi untuk Workshop Kaca dan Aluminium', description: 'Langkah dan checklist serah terima dari hasil ukur sampai pemasangan.' },
    en: { title: 'From Site Survey to Installation', description: 'Steps and handoff checks from measurements to installation.' },
  },
  progress: {
    id: { title: 'Cara Melacak Progres Order Workshop Kaca dan Aluminium', description: 'Contoh status, hambatan, dan update yang membantu tim serta pelanggan.' },
    en: { title: 'How to Track Glass and Aluminium Workshop Orders', description: 'Statuses, blockers, and updates that help the team and customers.' },
  },
};

export function findGuide(path: string): { key: GuideKey; locale: Locale } | null {
  for (const key of Object.keys(guidePaths) as GuideKey[]) {
    for (const locale of ['id', 'en'] as Locale[]) {
      if (guidePaths[key][locale] === path) return { key, locale };
    }
  }
  return null;
}
