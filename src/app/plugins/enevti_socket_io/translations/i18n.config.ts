import { I18n } from 'i18n';
import * as path from 'path';

const i18n = new I18n({
  locales: ['en'],
  defaultLocale: 'en',
  directory: path.join(__dirname, './translations/locales'),
});

export default i18n;
