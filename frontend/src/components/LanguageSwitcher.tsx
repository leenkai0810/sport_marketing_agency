import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiGlobalLine } from 'react-icons/ri';

const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export const LanguageSwitcher = ({ isDark = false }: { isDark?: boolean }) => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

    const changeLanguage = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    const textColorClass = isDark ? 'text-gray-700 hover:text-black' : 'text-gray-300 hover:text-white';
    const dropdownBgClass = isDark ? 'bg-white border-gray-200' : 'bg-zinc-900 border-zinc-700';
    const dropdownItemClass = isDark ? 'text-gray-700 hover:bg-gray-100 hover:text-black' : 'text-gray-300 hover:bg-zinc-800 hover:text-white';

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-black/5 ${textColorClass}`}
            >
                <RiGlobalLine className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
                <span className="sm:hidden">{currentLanguage.flag}</span>
            </button>

            {isOpen && (
                <div className={`absolute right-0 top-full mt-2 border rounded-lg shadow-xl overflow-hidden z-50 min-w-[150px] ${dropdownBgClass}`}>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${i18n.language === lang.code
                                    ? 'bg-red-600 text-white'
                                    : dropdownItemClass
                                }`}
                        >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
