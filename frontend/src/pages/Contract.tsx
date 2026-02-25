import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { userApi } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import jsPDF from 'jspdf';

const Contract = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [accepted, setAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const clauses = [
        { title: t('contract.clause1Title'), desc: t('contract.clause1Desc') },
        { title: t('contract.clause2Title'), desc: t('contract.clause2Desc') },
        { title: t('contract.clause3Title'), desc: t('contract.clause3Desc') },
        { title: t('contract.clause4Title'), desc: t('contract.clause4Desc') },
        { title: t('contract.clause5Title'), desc: t('contract.clause5Desc') },
        { title: t('contract.clause6Title'), desc: t('contract.clause6Desc') },
        { title: t('contract.clause7Title'), desc: t('contract.clause7Desc') },
        { title: t('contract.clause8Title'), desc: t('contract.clause8Desc') },
    ];

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxWidth = pageWidth - margin * 2;
        let y = 20;

        // Title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Global Media Sports', pageWidth / 2, y, { align: 'center' });
        y += 10;

        doc.setFontSize(16);
        doc.text(t('contract.title'), pageWidth / 2, y, { align: 'center' });
        y += 8;

        // Separator line
        doc.setDrawColor(220, 38, 38); // red-600
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 12;

        // Subtitle
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text(t('contract.subtitle'), pageWidth / 2, y, { align: 'center' });
        y += 14;

        // Clauses
        doc.setTextColor(0);
        clauses.forEach((clause) => {
            // Check if we need a new page
            if (y > 260) {
                doc.addPage();
                y = 20;
            }

            // Clause title
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(clause.title, margin, y);
            y += 7;

            // Clause description
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(clause.desc, maxWidth);
            doc.text(lines, margin, y);
            y += lines.length * 5 + 8;
        });

        // Footer: Date
        if (y > 250) {
            doc.addPage();
            y = 20;
        }
        y += 10;
        doc.setDrawColor(200);
        doc.setLineWidth(0.2);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;

        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(`${new Date().toLocaleDateString()}`, margin, y);
        doc.text('Global Media Sports © ' + new Date().getFullYear(), pageWidth - margin, y, { align: 'right' });

        // Signature lines
        y += 20;
        doc.setTextColor(0);
        doc.setFontSize(10);

        // Athlete signature
        doc.setLineWidth(0.3);
        doc.setDrawColor(0);
        doc.line(margin, y + 15, margin + 60, y + 15);
        doc.text(t('contract.clause1Title').replace('1. ', ''), margin, y + 22); // "Parties" label area
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text('____________________________', margin, y + 15);

        // Agency signature
        doc.text('____________________________', pageWidth - margin - 60, y + 15);

        doc.save('Global_Media_Sports_Contract.pdf');
        toast.success(t('contract.downloadSuccess', 'Contract downloaded successfully!'));
    };

    const handleAccept = async () => {
        if (!accepted) {
            toast.error(t('contract.acceptRequired'));
            return;
        }

        setIsLoading(true);
        try {
            await userApi.acceptContract();
            toast.success(t('contract.accepted'));
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error(t('contract.acceptFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
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
                    <LanguageSwitcher isDark={false} />
                </div>
            </nav>

            {/* Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-zinc-950 to-black" />

            {/* Content */}
            <div className="relative z-10 flex flex-1 items-center justify-center px-6 pt-24 pb-12">
                <motion.div
                    className="w-full max-w-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black mb-2">{t('contract.title')}</h1>
                        <div className="w-16 h-0.5 bg-red-600 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">{t('contract.subtitle')}</p>
                    </div>

                    {/* Card */}
                    <div className="relative">
                        <div className="absolute -inset-[1px] bg-gradient-to-b from-red-600/40 via-zinc-700/20 to-zinc-700/20 rounded-2xl" />
                        <div className="relative bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-zinc-800 overflow-hidden">
                            {/* Contract text */}
                            <div className="h-80 overflow-y-auto p-8 border-b border-zinc-800 text-sm text-gray-300 space-y-4 scrollbar-thin">
                                {clauses.map((clause, i) => (
                                    <div key={i}>
                                        <h3 className="font-bold text-white mb-1">{clause.title}</h3>
                                        <p className="text-gray-400 whitespace-pre-wrap">{clause.desc}</p>
                                    </div>
                                ))}
                                <p className="text-xs text-zinc-600 pt-4">Last Updated: {new Date().toLocaleDateString()}</p>
                            </div>

                            {/* Footer */}
                            <div className="p-8 space-y-4">
                                {/* Download PDF Button */}
                                <Button
                                    variant="outline"
                                    className="w-full border-zinc-700 text-gray-200 hover:bg-zinc-800 hover:text-white py-4 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                                    onClick={handleDownloadPDF}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    {t('contract.downloadPdf', 'Download Contract (PDF)')}
                                </Button>

                                {/* Checkbox */}
                                <div className="flex items-center space-x-3 bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
                                    <Checkbox
                                        id="accept"
                                        checked={accepted}
                                        onCheckedChange={(checked) => setAccepted(checked as boolean)}
                                        className="border-zinc-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                                    />
                                    <Label htmlFor="accept" className="text-sm text-gray-200 cursor-pointer">
                                        {t('contract.acceptLabel')}
                                    </Label>
                                </div>

                                {/* Accept Button */}
                                <Button
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 disabled:opacity-50"
                                    onClick={handleAccept}
                                    disabled={!accepted || isLoading}
                                >
                                    {isLoading ? t('contract.processing') : t('contract.acceptBtn')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contract;
