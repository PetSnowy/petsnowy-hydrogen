import { RemixI18n } from 'remix-i18n';
import zh from 'public/locales/zh/common.json';
import en from 'public/locales/en/common.json';
import fr from 'public/locales/fr/common.json';
import ja from 'public/locales/ja/common.json';

export const i18n = new RemixI18n({
  supportedLanguages: ['en', 'zh', 'fr', 'ja'],
  fallbackLng: 'en',
});

const locales = {
  zh,
  en,
  fr,
  ja
};

export function getLocale(pathname: string): string {
  const [, locale = ''] = pathname.split('/');
  if (i18n.supportedLanguages.includes(locale.split('-')[0])) {
    return locale.split('-')[0];
  }
  return i18n.fallbackLng;
}

Object.entries(locales).forEach(([key, value]) => i18n.set(key, value));
