import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Privacy = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const sections = [
        {
            title: t('privacy.section1Title'),
            content: t('privacy.section1Desc'),
        },
        {
            title: t('privacy.section2Title'),
            content: t('privacy.section2Desc'),
        },
        {
            title: t('privacy.section3Title'),
            content: t('privacy.section3Desc'),
        },
        {
            title: t('privacy.section4Title'),
            content: t('privacy.section4Desc'),
        },
        {
            title: t('privacy.section5Title'),
            content: t('privacy.section5Desc'),
        },
        {
            title: t('privacy.section6Title'),
            content: t('privacy.section6Desc'),
        },
        {
            title: t('privacy.section7Title'),
            content: t('privacy.section7Desc'),
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/LOGO.png" alt="Global Media Sports" className="w-9 h-9 object-contain" />
                        <div className="flex flex-col leading-tight">
                            <span className="text-base font-bold">Global</span>
                            <span className="text-[8px] uppercase tracking-[0.2em] text-gray-400">Media Sports</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher isDark={false} />
                        <button
                            onClick={() => navigate('/')}
                            className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all"
                        >
                            {t('privacy.back')}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-zinc-950 to-black" />

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-28 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    {/* Heading */}
                    <div className="mb-12">
                        <h1 className="text-5xl font-black mb-3">{t('privacy.title')}</h1>
                        <div className="w-16 h-1 bg-red-600 mb-4" />
                        <p className="text-gray-500 text-sm">{t('privacy.lastUpdated')}</p>
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                        {sections.map((section, i) => (
                            <motion.div
                                key={i}
                                className="relative group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                            >
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-red-600/20 to-zinc-700/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                    <h2 className="text-lg font-bold text-white mb-2">{section.title}</h2>
                                    <p className="text-gray-400 text-sm leading-relaxed">{section.content}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Privacy;
