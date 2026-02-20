import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const Terms = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="container py-10 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{t('terms.title', 'Terms of Service')}</h1>
                <div className="flex items-center gap-4">
                    <div className="border rounded-lg bg-white/50 backdrop-blur-sm shadow-sm hidden sm:block">
                        <LanguageSwitcher isDark={true} />
                    </div>
                    <Button variant="outline" onClick={() => navigate('/')}>{t('terms.back', 'Back to Home')}</Button>
                </div>
            </div>

            <div className="sm:hidden mb-6 border rounded-lg bg-white/50 backdrop-blur-sm shadow-sm inline-block">
                <LanguageSwitcher isDark={true} />
            </div>

            <div className="prose max-w-none">
                <p>{t('terms.lastUpdated', 'Last updated:')} {new Date().toLocaleDateString()}</p>

                <h2>{t('terms.section1Title', '1. Acceptance of Terms')}</h2>
                <p>{t('terms.section1Desc', 'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.')}</p>

                <h2>{t('terms.section2Title', '2. Use License')}</h2>
                <p>{t('terms.section2Desc', "Permission is granted to temporarily download one copy of the materials (information or software) on Global Media Sports' website for personal, non-commercial transitory viewing only.")}</p>

                <h2>{t('terms.section3Title', '3. Disclaimer')}</h2>
                <p>{t('terms.section3Desc', "The materials on Global Media Sports' website are provided on an 'as is' basis. Global Media Sports makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.")}</p>

                <h2>{t('terms.section4Title', '4. Limitations')}</h2>
                <p>{t('terms.section4Desc', "In no event shall Global Media Sports or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Global Media Sports' website.")}</p>
            </div>
        </div>
    );
};

export default Terms;

