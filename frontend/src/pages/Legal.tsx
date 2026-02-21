import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Legal = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: 'Company Information',
            items: [
                { label: 'Company', value: 'Global Media Sports' },
                { label: 'Address', value: 'Barcelona, España' },
                { label: 'Email', value: 'contacto@globalmediasports.es' },
            ],
        },
        {
            title: 'Copyright',
            content: 'All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Global Media Sports or its content suppliers and protected by international copyright laws.',
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
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all"
                    >
                        Back to Home
                    </button>
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
                        <h1 className="text-5xl font-black mb-3">Legal Notice</h1>
                        <div className="w-16 h-1 bg-red-600" />
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                        {/* Company Info */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.08 }}
                        >
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-white mb-4">Company Information</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-500 text-sm w-20 flex-shrink-0">Company</span>
                                        <span className="text-white font-semibold text-sm">Global Media Sports</span>
                                    </div>
                                    <div className="h-px bg-zinc-800" />
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-500 text-sm w-20 flex-shrink-0">Address</span>
                                        <span className="text-gray-300 text-sm">Barcelona, España</span>
                                    </div>
                                    <div className="h-px bg-zinc-800" />
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-500 text-sm w-20 flex-shrink-0">Email</span>
                                        <a href="mailto:contacto@globalmediasports.es" className="text-red-500 hover:text-red-400 text-sm transition-colors">
                                            contacto@globalmediasports.es
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Copyright */}
                        <motion.div
                            className="relative group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.16 }}
                        >
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-red-600/20 to-zinc-700/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-white mb-2">Copyright</h2>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Global Media Sports or its content suppliers and protected by international copyright laws.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Legal;
