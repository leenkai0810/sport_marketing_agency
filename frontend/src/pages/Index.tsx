import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
// Luxury icons from react-icons
import { RiInstagramFill, RiTiktokFill, RiMailSendLine, RiPhoneFill, RiMapPin2Fill, RiCheckboxCircleFill, RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { HiOutlineTrendingUp, HiOutlineFilm, HiOutlineUserGroup, HiOutlineSparkles, HiOutlineCreditCard } from 'react-icons/hi';
import { HiTrophy } from 'react-icons/hi2';
import { BsTwitterX } from 'react-icons/bs';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaStripe } from 'react-icons/fa';
// Animation library
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInDown = {
  hidden: { opacity: 0, y: -60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Index() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showInfoRequest, setShowInfoRequest] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    sport_type: '',
    instagram_handle: '',
    tiktok_handle: '',
  });

  const [infoRequestData, setInfoRequestData] = useState({
    message: '',
  });

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Registration Successful!', {
      description: 'Your athlete profile has been created. Now request pricing information.',
    });

    setShowInfoRequest(true);
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      sport_type: '',
      instagram_handle: '',
      tiktok_handle: '',
    });
    setIsRegistering(false);
  };

  const handleInfoRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    toast.success('Request Submitted!', {
      description: "We'll send you detailed pricing information. Ready to subscribe?",
    });

    setInfoRequestData({ message: '' });
    setShowInfoRequest(false);
    setShowPayment(true);
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Payment Feature', {
      description: 'Payment integration requires backend setup. Contact us for more info.',
    });

    setIsProcessingPayment(false);
  };

  const scrollToRegistration = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <HiOutlineTrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight">ELITE</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest -mt-1">Sports Agency</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('about')}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => scrollToSection('registration')}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
              </button>
            </div>

            {/* CTA Button & Mobile Menu */}
            <div className="flex items-center gap-4">
              <Button 
                onClick={scrollToRegistration}
                className="hidden md:flex bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-2 rounded-lg transition-all duration-300"
              >
                Get Started
              </Button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <RiCloseLine className="w-6 h-6" /> : <RiMenu3Line className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-zinc-800/50">
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors text-left py-2"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors text-left py-2"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors text-left py-2"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => scrollToSection('registration')}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors text-left py-2"
                >
                  Contact
                </button>
                <Button 
                  onClick={scrollToRegistration}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-2 rounded-lg mt-2"
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{ backgroundImage: "url('/landing page.png')" }}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 z-0 bg-black/60" />
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.h1 
            className="text-6xl md:text-7xl font-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            ELEVATE YOUR <span className="text-red-600">ATHLETIC CAREER</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-gray-300 font-light max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Professional social media management and video editing that transforms talented athletes into recognized sports stars
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            <Button 
              onClick={scrollToRegistration}
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-12 py-6 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              START YOUR JOURNEY
            </Button>
          </motion.div>
          
          {/* Social Media Follow Section */}
          <motion.div 
            className="mt-8 flex items-center justify-center gap-4 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="text-sm font-medium">Follow Us:</span>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-red-600 transition-colors"
            >
              <RiInstagramFill className="w-5 h-5" />
              <span className="text-sm">Instagram</span>
            </a>
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-red-600 transition-colors"
            >
              <RiTiktokFill className="w-5 h-5" />
              <span className="text-sm">TikTok</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-zinc-950 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-black mb-6">WHO WE ARE</h2>
            <motion.div 
              className="w-24 h-1 bg-red-600 mx-auto mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Established in 2025, we're a cutting-edge sports marketing agency with an impeccable team of professionals dedicated to one mission: <span className="text-red-600 font-bold">making talented athletes visible to the world</span>.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="rounded-2xl h-80 overflow-hidden"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInLeft}
            >
              <img 
                src="/Who we are.png" 
                alt="Professional team working on sports content" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </motion.div>
            <motion.div 
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div className="flex items-start gap-4" variants={staggerItem}>
                <HiOutlineSparkles className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
                  <p className="text-gray-400">
                    We connect talented athletes with professional teams and sports brands by creating compelling social media presence that showcases their true potential.
                  </p>
                </div>
              </motion.div>
              <motion.div className="flex items-start gap-4" variants={staggerItem}>
                <HiOutlineUserGroup className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">Expert Team</h3>
                  <p className="text-gray-400">
                    Our professional video editors and social media managers have years of experience in sports marketing and athlete branding.
                  </p>
                </div>
              </motion.div>
              <motion.div className="flex items-start gap-4" variants={staggerItem}>
                <HiTrophy className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">All Sports Welcome</h3>
                  <p className="text-gray-400">
                    From soccer to swimming, basketball to boxing - we specialize in promoting athletes across every sport, with a special focus on soccer.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-black mb-6">OUR SERVICES</h2>
            <motion.div 
              className="w-24 h-1 bg-red-600 mx-auto mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Complete social media management package designed to maximize your athletic visibility
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 items-stretch" 
            style={{ perspective: '1000px' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Social Media Management Card */}
            <motion.div className="group relative h-full" style={{ transformStyle: 'preserve-3d' }} variants={staggerItem}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-900 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
              <Card className="relative h-full bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-700/50 rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-red-500/50 group-hover:shadow-2xl group-hover:shadow-red-600/20"
                style={{ transform: 'translateZ(0)', transition: 'transform 0.5s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateZ(20px) rotateX(5deg)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateZ(0) rotateX(0deg)'}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 p-8 h-full flex flex-col">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-red-600/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <RiInstagramFill className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-3 group-hover:text-red-50 transition-colors duration-300">Social Media Management</CardTitle>
                  <CardDescription className="text-gray-400 text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300 flex-grow">
                    Professional management of your Instagram and TikTok accounts with strategic content planning and posting schedules
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Professional Video Editing Card */}
            <motion.div className="group relative h-full" style={{ transformStyle: 'preserve-3d' }} variants={staggerItem}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-900 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
              <Card className="relative h-full bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-700/50 rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-red-500/50 group-hover:shadow-2xl group-hover:shadow-red-600/20"
                style={{ transform: 'translateZ(0)', transition: 'transform 0.5s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateZ(20px) rotateX(5deg)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateZ(0) rotateX(0deg)'}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 p-8 h-full flex flex-col">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-red-600/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <HiOutlineFilm className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-3 group-hover:text-red-50 transition-colors duration-300">Professional Video Editing</CardTitle>
                  <CardDescription className="text-gray-400 text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300 flex-grow">
                    Expert editing team transforms your raw footage into compelling highlight reels that capture your athletic excellence
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Brand Exposure Card */}
            <motion.div className="group relative h-full" style={{ transformStyle: 'preserve-3d' }} variants={staggerItem}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-900 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
              <Card className="relative h-full bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-700/50 rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-red-500/50 group-hover:shadow-2xl group-hover:shadow-red-600/20"
                style={{ transform: 'translateZ(0)', transition: 'transform 0.5s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateZ(20px) rotateX(5deg)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateZ(0) rotateX(0deg)'}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 p-8 h-full flex flex-col">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-red-600/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <HiOutlineTrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-3 group-hover:text-red-50 transition-colors duration-300">Brand Exposure</CardTitle>
                  <CardDescription className="text-gray-400 text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300 flex-grow">
                    Strategic connections with professional teams and sports brands looking for talented athletes like you
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div 
            className="mt-16 bg-zinc-900 rounded-2xl p-8 border border-zinc-800"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <img 
              src="/how it works.png" 
              alt="Social media growth visualization" 
              className="w-full rounded-lg mb-6"
            />
            <h3 className="text-3xl font-bold mb-4 text-center">How It Works</h3>
            <motion.div 
              className="grid md:grid-cols-3 gap-6 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={staggerItem}>
                <div className="text-4xl font-black text-red-600 mb-2">01</div>
                <p className="text-lg">Create your TikTok and Instagram accounts with your athletic content</p>
              </motion.div>
              <motion.div variants={staggerItem}>
                <div className="text-4xl font-black text-red-600 mb-2">02</div>
                <p className="text-lg">Our team manages, edits, and optimizes your content professionally</p>
              </motion.div>
              <motion.div variants={staggerItem}>
                <div className="text-4xl font-black text-red-600 mb-2">03</div>
                <p className="text-lg">Watch your visibility grow as teams and brands discover your talent</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 px-6 bg-zinc-950 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-black mb-6">ATHLETES IN ACTION</h2>
            <motion.div 
              className="w-24 h-1 bg-red-600 mx-auto mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <p className="text-xl text-gray-300">
              We work with talented athletes across all sports disciplines
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Soccer Card */}
            <motion.div 
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              variants={staggerItem}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl opacity-0 group-hover:opacity-75 blur-md transition-all duration-500 z-0"></div>
              <div className="relative overflow-hidden rounded-2xl z-10">
                {/* Border frame */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500/50 rounded-2xl z-20 transition-all duration-500"></div>
                <img 
                  src="/1.png" 
                  alt="Soccer athlete" 
                  className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Gradient overlay with animation */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
                {/* Red accent overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Content */}
                <div className="absolute inset-0 flex items-end p-6 z-10">
                  <div className="transform group-hover:translate-y-0 translate-y-2 transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white group-hover:text-red-50 transition-colors duration-300">Soccer Excellence</h3>
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Professional football talent</p>
                    <div className="h-0.5 w-0 bg-red-500 group-hover:w-full transition-all duration-500 mt-2"></div>
                  </div>
                </div>
                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-red-500 transition-all duration-500 rounded-tr-lg"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-transparent group-hover:border-red-500 transition-all duration-500 rounded-bl-lg"></div>
              </div>
            </motion.div>

            {/* Basketball Card */}
            <motion.div 
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              variants={staggerItem}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl opacity-0 group-hover:opacity-75 blur-md transition-all duration-500 z-0"></div>
              <div className="relative overflow-hidden rounded-2xl z-10">
                {/* Border frame */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500/50 rounded-2xl z-20 transition-all duration-500"></div>
                <img 
                  src="/2.png" 
                  alt="Basketball athlete" 
                  className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Gradient overlay with animation */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
                {/* Red accent overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Content */}
                <div className="absolute inset-0 flex items-end p-6 z-10">
                  <div className="transform group-hover:translate-y-0 translate-y-2 transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white group-hover:text-red-50 transition-colors duration-300">Basketball Power</h3>
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Elite court performance</p>
                    <div className="h-0.5 w-0 bg-red-500 group-hover:w-full transition-all duration-500 mt-2"></div>
                  </div>
                </div>
                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-red-500 transition-all duration-500 rounded-tr-lg"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-transparent group-hover:border-red-500 transition-all duration-500 rounded-bl-lg"></div>
              </div>
            </motion.div>

            {/* All Sports Card */}
            <motion.div 
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              variants={staggerItem}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl opacity-0 group-hover:opacity-75 blur-md transition-all duration-500 z-0"></div>
              <div className="relative overflow-hidden rounded-2xl z-10">
                {/* Border frame */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500/50 rounded-2xl z-20 transition-all duration-500"></div>
                <img 
                  src="/3.png" 
                  alt="Multi-sport athletes" 
                  className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Gradient overlay with animation */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
                {/* Red accent overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Content */}
                <div className="absolute inset-0 flex items-end p-6 z-10">
                  <div className="transform group-hover:translate-y-0 translate-y-2 transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white group-hover:text-red-50 transition-colors duration-300">All Sports</h3>
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Every discipline welcome</p>
                    <div className="h-0.5 w-0 bg-red-500 group-hover:w-full transition-all duration-500 mt-2"></div>
                  </div>
                </div>
                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-red-500 transition-all duration-500 rounded-tr-lg"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-transparent group-hover:border-red-500 transition-all duration-500 rounded-bl-lg"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-zinc-950 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-black mb-4">
              Choose Your <span className="text-red-600">Success Plan</span>
            </h2>
            <p className="text-gray-400 text-base max-w-2xl mx-auto mt-6">
              Flexible monthly plans designed to fit every athlete's needs and budget. Cancel anytime, no long-term commitments.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            style={{ perspective: '1000px' }}
          >
            {/* Starter Plan - Silver Theme */}
            <motion.div 
              className="group relative"
              variants={staggerItem}
              whileHover={{ 
                y: -12,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
            >
              {/* Glow effect - Silver/Blue */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-400/0 via-slate-400/0 to-slate-400/0 group-hover:from-slate-400/40 group-hover:via-slate-300/40 group-hover:to-slate-400/40 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/30 group-hover:border-slate-400/50 transition-all duration-500 overflow-hidden">
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                {/* Top gradient line - Silver */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/0 to-transparent group-hover:via-slate-400/80 transition-all duration-500"></div>
                {/* Corner accents */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-slate-600/50 group-hover:border-slate-400/80 transition-all duration-500 rounded-tl-lg"></div>
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-slate-600/50 group-hover:border-slate-400/80 transition-all duration-500 rounded-br-lg"></div>
                
              <div className="relative text-center mb-8">
                <div className="inline-block px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300 mb-4">STARTER</div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-slate-100 transition-colors duration-300">Starter</h3>
                <p className="text-sm text-gray-400 mb-6">Perfect for emerging athletes</p>
                <div className="mb-8">
                  <span className="text-4xl font-black text-white">$99</span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8 min-h-[280px]">
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">TikTok & Instagram account setup</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">2 professional edited videos/month</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Basic content strategy</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Monthly performance report</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Email support</span>
                </li>
              </ul>

              <Button 
                onClick={scrollToRegistration}
                variant="outline"
                className="w-full border-slate-600 text-white hover:bg-slate-600 hover:border-slate-500 py-5 text-sm font-semibold transition-all duration-300 group-hover:shadow-lg group-hover:shadow-slate-400/20"
              >
                Get Started
              </Button>
              </div>
            </motion.div>

            {/* Pro Plan - Featured Red Theme */}
            <motion.div 
              className="group relative scale-105 z-10"
              variants={staggerItem}
              whileHover={{ 
                y: -8,
                scale: 1.07,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              {/* Badge - positioned outside overflow container */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <span className="bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-5 py-2 rounded-full shadow-md shadow-red-600/30 whitespace-nowrap">
                  MOST POPULAR
                </span>
              </div>
              {/* Subtle border glow effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-b from-red-500 via-red-600/50 to-red-500 rounded-2xl opacity-100"></div>
              <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 backdrop-blur-sm rounded-2xl p-8 pt-10 overflow-hidden">
                {/* Subtle top highlight */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-400/60 to-transparent"></div>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                {/* Subtle inner glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-red-500/20 to-transparent rounded-br-full"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-red-500/20 to-transparent rounded-tl-full"></div>
              
              <div className="relative text-center mb-8">
                <h3 className="text-xl font-bold mb-2 text-white">Pro</h3>
                <p className="text-sm text-gray-400 mb-6">For athletes ready to go pro</p>
                <div className="mb-8">
                  <span className="text-4xl font-black text-red-500">$249</span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8 min-h-[280px] relative">
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Everything in Starter</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">5 professional edited videos/month</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Advanced content strategy</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Brand partnership outreach</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Weekly performance reports</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Priority support</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Custom thumbnails & graphics</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Trend analysis & recommendations</span>
                </li>
              </ul>

              <Button 
                onClick={scrollToRegistration}
                className="relative w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white py-5 text-sm font-bold shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/50 transition-all duration-300 overflow-hidden group/btn"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500"></div>
              </Button>
              </div>
            </motion.div>

            {/* Elite Plan - Gold/Premium Theme */}
            <motion.div 
              className="group relative"
              variants={staggerItem}
              whileHover={{ 
                y: -12,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
            >
              {/* Glow effect - Gold/Amber */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/0 via-yellow-500/0 to-amber-500/0 group-hover:from-amber-500/50 group-hover:via-yellow-400/50 group-hover:to-amber-500/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-zinc-900 via-amber-950/20 to-zinc-900 backdrop-blur-sm rounded-2xl p-8 border border-amber-600/30 group-hover:border-amber-400/60 transition-all duration-500 overflow-hidden">
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                {/* Top gradient line - Gold */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/0 to-transparent group-hover:via-amber-400/80 transition-all duration-500"></div>
                {/* Premium crown decoration */}
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 text-amber-500/50 group-hover:text-amber-400 transition-colors duration-500">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L9 9H2L7 14L5 22L12 17L19 22L17 14L22 9H15L12 1Z"/>
                    </svg>
                  </div>
                </div>
                {/* Corner accents - Gold */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-amber-600/50 group-hover:border-amber-400/80 transition-all duration-500 rounded-tl-lg"></div>
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-amber-600/50 group-hover:border-amber-400/80 transition-all duration-500 rounded-br-lg"></div>
                
              <div className="relative text-center mb-8">
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-amber-600/30 to-yellow-600/30 rounded-full text-xs text-amber-300 mb-4 border border-amber-500/30">PREMIUM</div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-amber-50 transition-colors duration-300">Elite</h3>
                <p className="text-sm text-gray-400 mb-6">Maximum reach and visibility</p>
                <div className="mb-8">
                  <span className="text-4xl font-black bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">$499</span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8 min-h-[280px]">
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Unlimited video edits</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Direct team/brand connections</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Daily content posting</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">24/7 priority support</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Sponsorship negotiation</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Media training sessions</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <RiCheckboxCircleFill className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Press release distribution</span>
                </li>
              </ul>

              <Button 
                onClick={scrollToRegistration}
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-bold py-5 text-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-500/30"
              >
                Get Started
              </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Payment Methods & Trust */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-gray-500 text-sm mb-6">Trusted payment processing</p>
            <div className="flex items-center justify-center gap-8">
              <motion.div 
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <FaStripe className="w-10 h-10" />
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <FaCcVisa className="w-12 h-12" />
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <FaCcMastercard className="w-12 h-12" />
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <FaCcPaypal className="w-12 h-12" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="registration" className="py-24 px-6 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-black mb-6">JOIN OUR ROSTER</h2>
            <motion.div 
              className="w-24 h-1 bg-red-600 mx-auto mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <p className="text-xl text-gray-300">
              Register now to start your journey to athletic recognition
            </p>
          </motion.div>

          {!showInfoRequest && !showPayment ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Registration Form */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Athlete Registration</CardTitle>
                  <CardDescription className="text-sm text-gray-400">
                    Fill out your information to get started with our professional services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegistration} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-sm font-medium text-gray-200">Full Name *</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          required
                          className="bg-zinc-800 border-zinc-700 text-white h-10"
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-200">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="bg-zinc-800 border-zinc-700 text-white h-10"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-200">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white h-10"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sport_type" className="text-sm font-medium text-gray-200">Primary Sport *</Label>
                        <Select
                          value={formData.sport_type}
                          onValueChange={(value) => setFormData({ ...formData, sport_type: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-10">
                            <SelectValue placeholder="Select your sport" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="soccer">Soccer</SelectItem>
                            <SelectItem value="basketball">Basketball</SelectItem>
                            <SelectItem value="tennis">Tennis</SelectItem>
                            <SelectItem value="swimming">Swimming</SelectItem>
                            <SelectItem value="track">Track & Field</SelectItem>
                            <SelectItem value="boxing">Boxing</SelectItem>
                            <SelectItem value="volleyball">Volleyball</SelectItem>
                            <SelectItem value="baseball">Baseball</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="instagram_handle" className="text-sm font-medium text-gray-200">Instagram Handle</Label>
                        <Input
                          id="instagram_handle"
                          value={formData.instagram_handle}
                          onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white h-10"
                          placeholder="@yourhandle"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tiktok_handle" className="text-sm font-medium text-gray-200">TikTok Handle</Label>
                        <Input
                          id="tiktok_handle"
                          value={formData.tiktok_handle}
                          onChange={(e) => setFormData({ ...formData, tiktok_handle: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white h-10"
                          placeholder="@yourhandle"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isRegistering}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-base py-5 mt-2"
                    >
                      {isRegistering ? 'Registering...' : 'REGISTER NOW'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Contact Information</h3>
                  <p className="text-sm text-gray-400">
                    Reach out to us through any of these channels. We're here to help you take your athletic career to the next level.
                  </p>
                </div>

                <div className="space-y-6 pt-4">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <RiMailSendLine className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Email Us</h4>
                      <a href="mailto:info@elitesports.agency" className="text-gray-400 hover:text-red-600 transition-colors text-sm">
                        info@elitesports.agency
                      </a>
                      <p className="text-xs text-gray-500 mt-1">We reply within 24 hours</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <RiPhoneFill className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Call Us</h4>
                      <a href="tel:+18005554567" className="text-gray-400 hover:text-red-600 transition-colors text-sm">
                        +1 (800) 555-4567
                      </a>
                      <p className="text-xs text-gray-500 mt-1">Mon-Fri, 9am-6pm EST</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <RiMapPin2Fill className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Location</h4>
                      <p className="text-gray-400 text-sm">Los Angeles, California</p>
                      <p className="text-xs text-gray-500 mt-1">United States</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-zinc-800 pt-6">
                    <h4 className="font-semibold text-white mb-4">Follow Us</h4>
                    <div className="flex items-center gap-3">
                      <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors group"
                      >
                        <RiInstagramFill className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      </a>
                      <a 
                        href="https://tiktok.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors group"
                      >
                        <RiTiktokFill className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : showInfoRequest ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white">Request Pricing Information</CardTitle>
                <CardDescription className="text-base text-gray-400">
                  Tell us about your needs and we'll send you detailed pricing and service information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInfoRequest} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-base font-medium text-gray-200">Your Message *</Label>
                    <Textarea
                      id="message"
                      value={infoRequestData.message}
                      onChange={(e) => setInfoRequestData({ message: e.target.value })}
                      required
                      className="bg-zinc-800 border-zinc-700 text-white min-h-32"
                      placeholder="Tell us about your goals, current social media presence, and what you're looking for..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-6"
                  >
                    REQUEST INFORMATION
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowInfoRequest(false)}
                    className="w-full border-zinc-700 text-white hover:bg-zinc-800"
                  >
                    Back to Registration
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white">Subscribe Now</CardTitle>
                <CardDescription className="text-base text-gray-400">
                  Start your professional athlete journey with our monthly subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-zinc-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">Monthly Subscription</h3>
                    <div className="text-right">
                      <div className="text-3xl font-black text-red-600">$299</div>
                      <div className="text-sm text-gray-400">per month</div>
                    </div>
                  </div>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">✓</span>
                      <span>Professional Instagram & TikTok management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">✓</span>
                      <span>Expert video editing and content creation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">✓</span>
                      <span>Strategic brand and team connections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">✓</span>
                      <span>Monthly performance reports</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">✓</span>
                      <span>Dedicated account manager</span>
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-6"
                >
                  {isProcessingPayment ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <HiOutlineCreditCard className="w-5 h-5 mr-2" />
                      PROCEED TO PAYMENT
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPayment(false)}
                  className="w-full border-zinc-700 text-white hover:bg-zinc-800"
                >
                  Back
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6">READY TO GO PRO?</h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join the elite athletes who trust us to manage their social media presence and connect them with professional opportunities
          </p>
          <Button 
            onClick={scrollToRegistration}
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-12 py-6 rounded-lg transform hover:scale-105 transition-all duration-300"
          >
            GET STARTED TODAY
          </Button>
          <p className="mt-8 text-gray-400">
            Questions? Contact us at <a href="mailto:info@elitesportsagency.com" className="text-red-600 hover:underline">info@elitesportsagency.com</a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <HiOutlineTrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ESPORTS</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Elevating athletic careers through professional social media management. We help talented athletes get discovered by teams and brands worldwide.
              </p>
              <div className="flex items-center gap-3">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors group"
                >
                  <RiInstagramFill className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </a>
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors group"
                >
                  <RiTiktokFill className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors group"
                >
                  <BsTwitterX className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 text-sm hover:text-red-600 transition-colors">About Us</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 text-sm hover:text-red-600 transition-colors">Our Services</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 text-sm hover:text-red-600 transition-colors">Pricing Plans</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 text-sm hover:text-red-600 transition-colors">Success Stories</a>
                </li>
                <li>
                  <a href="#registration" className="text-gray-400 text-sm hover:text-red-600 transition-colors">Contact Us</a>
                </li>
              </ul>
            </div>

            {/* Sports We Cover */}
            <div>
              <h4 className="text-white font-semibold mb-6">Sports We Cover</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 text-sm hover:text-red-600 transition-colors">Soccer (Primary Focus)</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 text-sm hover:text-red-600 transition-colors">Basketball</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 text-sm hover:text-red-600 transition-colors">Tennis</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 text-sm hover:text-red-600 transition-colors">Swimming</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 text-sm hover:text-red-600 transition-colors">Track & Field</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 text-sm hover:text-red-600 transition-colors">All Other Sports</a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-semibold mb-6">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <RiMailSendLine className="w-4 h-4 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <a href="mailto:contact@esports.agency" className="text-gray-400 text-sm hover:text-red-600 transition-colors">
                      contact@esports.agency
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <RiPhoneFill className="w-4 h-4 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <a href="tel:+18005554567" className="text-gray-400 text-sm hover:text-red-600 transition-colors">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <RiMapPin2Fill className="w-4 h-4 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Los Angeles, CA</p>
                    <p className="text-gray-500 text-xs">United States</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-zinc-900">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © 2025 ESPORTS Agency. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-gray-500 text-sm hover:text-red-600 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-500 text-sm hover:text-red-600 transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
