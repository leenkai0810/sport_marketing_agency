import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const Privacy = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="container py-10 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{t('privacy.title', 'Privacy Policy')}</h1>
                <div className="flex items-center gap-4">
                    <div className="border rounded-lg bg-white/50 backdrop-blur-sm shadow-sm hidden sm:block">
                        <LanguageSwitcher isDark={true} />
                    </div>
                    <Button variant="outline" onClick={() => navigate('/')}>{t('privacy.back', 'Back to Home')}</Button>
                </div>
            </div>

            <div className="sm:hidden mb-6 border rounded-lg bg-white/50 backdrop-blur-sm shadow-sm inline-block">
                <LanguageSwitcher isDark={true} />
            </div>

            <div className="prose max-w-none">
                <p>{t('privacy.lastUpdated', 'Last updated:')} {new Date().toLocaleDateString()}</p>

                <h2>{t('privacy.section1Title', '1. Information We Collect')}</h2>
                <p>{t('privacy.section1Desc', 'We collect information you provide directly to us, such as when you create an account, subscribe, or upload content.')}</p>

                <h2>{t('privacy.section2Title', '2. How We Use Your Information')}</h2>
                <p>{t('privacy.section2Desc', 'We use the information we collect to operate, maintain, and improve our services, and to communicate with you.')}</p>

                <h2>{t('privacy.section3Title', '3. Sharing of Information')}</h2>
                <p>{t('privacy.section3Desc', 'We do not share your personal information with third parties except as described in this policy or with your consent.')}</p>

                <h2>{t('privacy.section4Title', '4. Data Security')}</h2>
                <p>{t('privacy.section4Desc', 'We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.')}</p>
            </div>
        </div>
    );
};

export default Privacy;
