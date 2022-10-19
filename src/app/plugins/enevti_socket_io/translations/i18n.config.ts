import { I18n } from 'i18n';
import * as path from 'path';

export const DEFAULT_LOCALE = 'en';

const i18n = new I18n({
  locales: ['en'],
  defaultLocale: DEFAULT_LOCALE,
  directory: path.join(__dirname, './locales'),
});

export default i18n;
