import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Legal = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const identifyingData = [
        { label: t('legal.owner'), value: t('legal.ownerValue') },
        { label: t('legal.taxId'), value: t('legal.taxIdValue') },
        { label: t('legal.address'), value: t('legal.addressValue') },
        { label: t('legal.emailLabel'), value: t('legal.emailValue'), isEmail: true },
        { label: t('legal.registry'), value: t('legal.registryValue') },
    ];

    const sections = [
        {
            title: t('legal.section2Title'),
            content: t('legal.section2Desc'),
        },
        {
            title: t('legal.section3Title'),
            content: t('legal.section3Desc'),
        },
        {
            title: t('legal.section4Title'),
            content: t('legal.section4Desc'),
        },
        {
            title: t('legal.section5Title'),
            content: t('legal.section5Desc'),
        },
        {
            title: t('legal.section6Title'),
            content: t('legal.section6Desc'),
        },
        {
            title: t('legal.section7Title'),
            content: t('legal.section7Desc'),
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
                            {t('legal.back')}
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
                        <h1 className="text-5xl font-black mb-3">{t('legal.title')}</h1>
                        <div className="w-16 h-1 bg-red-600" />
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                        {/* Section 1: Identifying Data */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.08 }}
                        >
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-white mb-2">{t('legal.section1Title')}</h2>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">{t('legal.section1Desc')}</p>
                                <div className="space-y-3">
                                    {identifyingData.map((item, i) => (
                                        <div key={i}>
                                            <div className="flex items-center gap-4">
                                                <span className="text-gray-500 text-sm w-32 flex-shrink-0">{item.label}</span>
                                                {item.isEmail && item.value.includes('@') ? (
                                                    <a href={`mailto:${item.value}`} className="text-red-500 hover:text-red-400 text-sm transition-colors">
                                                        {item.value}
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-300 text-sm font-semibold">{item.value}</span>
                                                )}
                                            </div>
                                            {i < identifyingData.length - 1 && <div className="h-px bg-zinc-800 mt-3" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Other Sections */}
                        {sections.map((section, i) => (
                            <motion.div
                                key={i}
                                className="relative group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: (i + 1) * 0.08 }}
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

export default Legal;
