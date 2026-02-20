import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import Backend from 'i18next-fs-backend';
import path from 'path';

i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
        fallbackLng: 'es', // Default to Spanish as requested
        supportedLngs: ['en', 'es', 'fr', 'de', 'pt'],
        backend: {
            loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
        },
        detection: {
            order: ['header'],
            caches: false, // Don't cache in backend
        },
    });

export { i18next, middleware };
