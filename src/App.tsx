import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useParams, 
  useNavigate,
  useLocation
} from 'react-router-dom';
import { 
  Camera, 
  Palette, 
  Clock, 
  Info, 
  MessageSquare, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  X, 
  Send,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  Menu,
  ChevronLeft,
  Heart,
  Instagram,
  Mail,
  MapPin
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// --- Types ---
interface Message {
  role: 'user' | 'model';
  text: string;
}

// --- Data ---
const CREATIVE_STUDIO_IMAGES = [
  "https://i.ibb.co/mr0kTkdh/tove-studios-1773169363-3849945792451268895-77802515388.jpg",
  "https://i.ibb.co/Nnk5kwqb/tove-studios-1773169363-3849945732648872129-77802515388.jpg",
  "https://i.ibb.co/ycFJ6PH2/tove-studios-1773169363-3849945674264159879-77802515388.jpg",
  "https://i.ibb.co/Kz5hWKhw/tove-studios-1773169363-3849945613044145873-77802515388.jpg"
];

const KORSIWA_GALLERY_IMAGES = [
  "https://i.ibb.co/Ps8G3t5M/tove-studios-1776193202-3875276191351828991-77802515388.jpg",
  "https://i.ibb.co/yn9zDX6W/tove-studios-1776193202-3875276191335001298-77802515388.jpg",
  "https://i.ibb.co/rRmLmFjM/tove-studios-1776193202-3875276191427307469-77802515388.jpg"
];

const BTS_IMAGES = [
  "https://i.ibb.co/0jbP3XgT/Project-Mar-17-02-18-PM-1.png",
  "https://i.ibb.co/qYR9BrFz/Project-Mar-17-02-18-PM-2.png",
  "https://i.ibb.co/HTnRTyn2/Project-Mar-17-02-18-PM-3.png",
  "https://i.ibb.co/QFJ8RP6K/Project-Mar-17-02-18-PM-4.png",
  "https://i.ibb.co/gFcBsHYh/Project-Mar-17-02-18-PM-5.png",
  "https://i.ibb.co/3332dMq/tove-studios-1776791085-3880327010774178840-77802515388.jpg",
  "https://i.ibb.co/BVbhdxsS/tove-studios-1776791085-3880326833992678652-77802515388.jpg",
  "https://i.ibb.co/PZwWRZtB/Project-Mar-17-02-18-PM-6.png",
  "https://i.ibb.co/5x1P4389/Project-Mar-17-02-18-PM-7.png",
  "https://i.ibb.co/nx8yqZh/Project-Mar-17-02-18-PM-8.png",
  "https://i.ibb.co/kgr9PJBC/Project-Mar-17-02-18-PM-9.png",
  "https://i.ibb.co/XrPTnTPx/Project-Mar-17-02-18-PM-10.png",
  "https://i.ibb.co/QWfvg8G/Project-Mar-17-02-18-PM-11.png",
  "https://i.ibb.co/mF0D8nsX/Project-Mar-17-02-18-PM-12.png",
  "https://i.ibb.co/1JGFkGzm/Project-Mar-17-02-18-PM-13.png",
  "https://i.ibb.co/29N414v/Project-Mar-17-02-18-PM-14.png",
  "https://i.ibb.co/kgKgHbt1/Project-Mar-17-02-18-PM-15.png",
  "https://i.ibb.co/PGtjzVT7/Project-Mar-17-02-18-PM-16.png",
  "https://i.ibb.co/Mxn9BXSQ/Project-Mar-17-02-18-PM-17.png"
];

const STUDIOS = [
  {
    id: 'creative-studio',
    name: 'The Creative Studio',
    price: 45000,
    description: 'A minimalist haven designed for perfection. Natural light meets professional grade equipment.',
    images: [
      "https://i.ibb.co/Nnk5kwqb/tove-studios-1773169363-3849945732648872129-77802515388.jpg",
      "https://i.ibb.co/mr0kTkdh/tove-studios-1773169363-3849945792451268895-77802515388.jpg",
      "https://i.ibb.co/ycFJ6PH2/tove-studios-1773169363-3849945674264159879-77802515388.jpg",
      "https://i.ibb.co/Kz5hWKhw/tove-studios-1773169363-3849945613044145873-77802515388.jpg"
    ],
    tag: 'Content Production'
  },
  {
    id: 'korsiwa-gallery',
    name: 'Korsiwa Gallery',
    price: 45000,
    description: 'A serene studio nestled in art. The perfect backdrop for soulful creations and artistic dialogue.',
    images: KORSIWA_GALLERY_IMAGES,
    tag: 'Art & Exhibition'
  }
];

// --- Utilities ---
const shuffleArray = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// --- Components ---

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-[60] px-6 py-4 md:px-12 flex items-center justify-between">
            <Link to="/" className="z-[70]">
                <h1 className="font-serif text-2xl md:text-3xl tracking-tighter text-studio-ebony italic font-semibold">Tove Studios.</h1>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 backdrop-blur-md bg-white/30 px-8 py-3 rounded-full border border-ebony-10 shadow-sm">
                <Link to="/" className="font-sans text-[10px] uppercase tracking-[0.2em] text-studio-ebony hover:opacity-50 transition-all font-bold">Home</Link>
                <a href="#studios" className="font-sans text-[10px] uppercase tracking-[0.2em] text-studio-ebony hover:opacity-50 transition-all font-bold">Spaces</a>
                <a href="#gallery" className="font-sans text-[10px] uppercase tracking-[0.2em] text-studio-ebony hover:opacity-50 transition-all font-bold">The Archive</a>
                <a href="#faq" className="font-sans text-[10px] uppercase tracking-[0.2em] text-studio-ebony hover:opacity-50 transition-all font-bold">FAQ</a>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden z-[70] w-12 h-12 flex items-center justify-center rounded-full bg-studio-ebony text-white"
            >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 bg-studio-cream z-[65] flex flex-col items-center justify-center gap-10"
                    >
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-serif italic text-5xl text-studio-ebony">Home</Link>
                        <a href="#studios" onClick={() => setIsMenuOpen(false)} className="font-serif italic text-5xl text-studio-ebony">Spaces</a>
                        <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="font-serif italic text-5xl text-studio-ebony">Archive</a>
                        <a href="#faq" onClick={() => setIsMenuOpen(false)} className="font-serif italic text-5xl text-studio-ebony">FAQ</a>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const questions = [
        { 
            q: "What is your booking & payment policy?", 
            a: "Full payment is required to confirm all bookings. No slot is reserved without complete payment. Bookings are processed on a first-come, first-served basis and are strictly non-refundable." 
        },
        { 
            q: "Can I reschedule my session?", 
            a: "Yes, clients may reschedule to a later available date with a minimum of 48 hours' notice. Failure to show up without prior notice forfeits the booking." 
        },
        { 
            q: "What is the guest capacity?", 
            a: "Each session allows a maximum of 7 persons (including photographers, stylists, and assistants). If your team exceeds this, kindly inform the Studio before booking." 
        },
        { 
            q: "When does my booked time start?", 
            a: "Your session begins at the exact time reserved, not at arrival time. This includes setup, hair/makeup, and pack down. Late arrival does not extend your booking time." 
        },
        { 
            q: "Are there prohibited items?", 
            a: "The following are strictly prohibited: Pets, smoking (including vaping), alcohol without prior approval, food/drinks that may stain, glitter, confetti, oils, or any staining substances." 
        }
    ];

    return (
        <section id="faq" className="section-spacing px-6 md:px-12 max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-studio-stone mb-4 block underline underline-offset-8">GUIDELINES</span>
                <h3 className="font-serif italic text-4xl md:text-6xl tracking-tighter">Terms of Experience.</h3>
            </div>
            <div className="space-y-4">
                {questions.map((item, i) => (
                    <div key={i} className="border-b border-ebony-10 pb-4">
                        <button 
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full py-6 flex items-center justify-between text-left group"
                        >
                            <span className="font-serif italic text-2xl md:text-3xl text-studio-ebony group-hover:opacity-60 transition-opacity">{item.q}</span>
                            <div className={`w-10 h-10 rounded-full border border-ebony-10 flex items-center justify-center transition-transform duration-500 ${openIndex === i ? 'rotate-45 bg-studio-ebony text-white' : ''}`}>
                                <Zap className="w-4 h-4" />
                            </div>
                        </button>
                        <AnimatePresence>
                            {openIndex === i && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <p className="font-sans text-studio-stone text-lg leading-relaxed pb-6 max-w-2xl">
                                        {item.a}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    );
};

const LandingPage = () => {
    const [shuffledBTS, setShuffledBTS] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setShuffledBTS(shuffleArray(BTS_IMAGES));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
                // If we're near the end, reset to middle to maintain the infinite loop illusion
                if (scrollLeft + clientWidth >= scrollWidth - 50) {
                    scrollRef.current.scrollTo({ left: 1, behavior: 'auto' });
                } else {
                    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                }
            }
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="pt-16 md:pt-32">
            {/* Hero */}
            <section className="px-6 md:px-12 mb-24 md:mb-48">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                    <div className="relative w-full md:w-1/2 aspect-[4/5] md:order-2 overflow-hidden rounded-[2.5rem] shadow-2xl">
                        <motion.img 
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.5 }}
                            src={CREATIVE_STUDIO_IMAGES[0]} 
                            alt="Main Studio" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2 }}
                        className="w-full md:w-1/2 md:order-1"
                    >
                        <span className="font-sans text-[11px] uppercase tracking-[0.4em] text-studio-stone mb-6 block">DESIGNED BY @KORSIWA.CO</span>
                        <h2 className="font-serif italic text-5xl md:text-[8rem] leading-[0.85] tracking-tighter mb-10">
                            One Space, <br />Endless <br />Possibilities.
                        </h2>
                        <p className="font-sans text-studio-stone text-lg max-w-md leading-relaxed mb-12">
                            Step into Tove Content Studio, a warm, serene space nestled in an art gallery and studio. More than a space—an encounter with light and art.
                        </p>
                        <div className="flex gap-4">
                            <motion.a 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="#studios" 
                                className="btn-ebony px-10 py-5 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-xl"
                            >
                                Explore Spaces
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Studios Selection */}
            <section id="studios" className="px-6 md:px-12 section-spacing bg-white/30 backdrop-blur-3xl rounded-[3rem] mx-4 md:mx-12">
                <div className="text-center mb-16 md:mb-24">
                    <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-studio-stone mb-4 block underline underline-offset-8">THE ENVIRONMENTS</span>
                    <h3 className="font-serif italic text-5xl md:text-7xl tracking-tighter">Your vision, our architecture.</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {STUDIOS.map((studio, i) => (
                        <motion.div
                            key={studio.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                        >
                            <Link 
                                to={`/studio/${studio.id}`} 
                                className="group block relative overflow-hidden rounded-[2.5rem] bg-white shadow-xl hover:shadow-2xl transition-all"
                            >
                                <div className="aspect-[4/5] md:aspect-[16/11] overflow-hidden">
                                    <img 
                                        src={studio.images[0]} 
                                        alt={studio.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                                <div className="p-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-studio-stone mb-3 block">{studio.tag}</span>
                                            <h4 className="font-serif italic text-4xl mb-4 group-hover:text-studio-stone transition-colors">{studio.name}</h4>
                                        </div>
                                        <div className="w-14 h-14 rounded-full border border-ebony-10 flex items-center justify-center group-hover:bg-studio-ebony group-hover:text-white transition-all transform group-hover:-rotate-45">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 pt-6 border-t border-ebony-10">
                                        <p className="text-studio-stone text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">₦{studio.price.toLocaleString()} / HOUR</p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Gallery BTS - Randomized & Auto-sliding */}
            <section id="gallery" className="section-spacing overflow-hidden">
                <div className="px-6 md:px-12 flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-studio-stone mb-4 block underline underline-offset-8">THE ARCHIVE</span>
                        <h3 className="font-serif italic text-5xl md:text-7xl tracking-tighter shrink-0">Captured Moments.</h3>
                    </div>
                    <div className="flex flex-col items-end gap-6">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-studio-stone max-w-[200px] text-right leading-relaxed">
                            A curated collection of creation & BTS glimpses from our studio.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-ebony-10 flex items-center justify-center hover:bg-studio-ebony hover:text-white transition-all">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-ebony-10 flex items-center justify-center hover:bg-studio-ebony hover:text-white transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div 
                    ref={scrollRef}
                    className="horizontal-scroll px-6 md:px-12 gap-6 pb-12"
                >
                    {/* Infinite loop effect with double mapping */}
                    {[...shuffledBTS, ...shuffledBTS].map((img, i) => (
                        <div key={i} className="w-[300px] md:w-[450px] aspect-[3/4] rounded-3xl overflow-hidden shadow-lg group">
                            <img 
                                src={img} 
                                alt={`Archive ${i}`} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    ))}
                </div>
            </section>

            <FAQ />
        </div>
    );
};

const StudioDetails = () => {
    const { id } = useParams();
    const studio = STUDIOS.find(s => s.id === id);
    const [selectedDate, setSelectedDate] = useState('');
    const [bookingStep, setBookingStep] = useState(1);
    
    if (!studio) return <div>Studio not found</div>;

    return (
        <div className="pt-24 pb-32">
            {/* Header & Back */}
            <div className="px-6 md:px-12 flex items-center justify-between mb-12">
                <Link to="/" className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest text-studio-stone hover:text-black">
                    <ChevronLeft className="w-4 h-4" /> Back to Essence
                </Link>
                <div className="flex gap-4">
                    <span className="font-serif italic text-xl">₦{studio.price.toLocaleString()}/HR</span>
                </div>
            </div>

            {/* Visuals Showcase */}
            <section className="px-6 md:px-12 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2 md:row-span-2 aspect-square md:aspect-auto rounded-[2.5rem] overflow-hidden shadow-2xl">
                         <img src={studio.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    {studio.images.slice(1).map((img, i) => (
                        <div key={i} className={`aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl ${i === 2 ? 'md:hidden' : ''}`}>
                             <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Core Info & Booking */}
            <section className="px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="md:col-span-2">
                        <span className="font-sans text-[11px] uppercase tracking-[0.4em] text-studio-stone mb-6 block">{studio.tag}</span>
                        <h2 className="font-serif italic text-5xl md:text-8xl tracking-tighter mb-8">{studio.name}</h2>
                        <p className="font-sans text-studio-stone text-xl leading-relaxed mb-12 max-w-2xl">
                            {studio.description} Nestled in our serene art gallery, this space is designed by @korsiwa.co to foster unparalleled creative flow. Every corner tells a story, and every shadow is curated.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-8 py-12 border-t border-ebony-10">
                            <div>
                                <h5 className="font-sans text-[10px] uppercase tracking-widest font-bold mb-4">Capacity</h5>
                                <p className="text-studio-stone">Up to 8 creators comfortably.</p>
                            </div>
                            <div>
                                <h5 className="font-sans text-[10px] uppercase tracking-widest font-bold mb-4">Lighting</h5>
                                <p className="text-studio-stone">Full Profoto ecosystem included.</p>
                            </div>
                            <div>
                                <h5 className="font-sans text-[10px] uppercase tracking-widest font-bold mb-4">Internet</h5>
                                <p className="text-studio-stone">Dedicated Fiber 100Mbps.</p>
                            </div>
                            <div>
                                <h5 className="font-sans text-[10px] uppercase tracking-widest font-bold mb-4">Location</h5>
                                <p className="text-studio-stone">Inside Korsiwa Art Gallery.</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form / Side Panel */}
                    <div className="relative">
                        <div className="sticky top-32 p-10 bg-white shadow-2xl rounded-[3rem] border border-ebony-10">
                            <AnimatePresence mode="wait">
                                {bookingStep === 1 ? (
                                    <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <h4 className="font-serif italic text-3xl mb-8">Secure your slot.</h4>
                                        <div className="space-y-6 mb-10">
                                            <div>
                                                <label className="font-sans text-[9px] uppercase tracking-widest text-studio-stone mb-2 block">Date Selection</label>
                                                <input 
                                                    type="date" 
                                                    onChange={(e) => setSelectedDate(e.target.value)}
                                                    className="w-full p-4 rounded-xl bg-studio-cream border border-ebony-10 focus:outline-none font-sans text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="font-sans text-[9px] uppercase tracking-widest text-studio-stone mb-2 block">Project Nature</label>
                                                <select className="w-full p-4 rounded-xl bg-studio-cream border border-ebony-10 focus:outline-none font-sans text-sm appearance-none bg-white">
                                                    <option>Fashion Editorial</option>
                                                    <option>Fine Art Production</option>
                                                    <option>Brand Campaign</option>
                                                    <option>Personal Expression</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setBookingStep(2)}
                                            disabled={!selectedDate}
                                            className="w-full btn-ebony p-5 rounded-full text-[10px] uppercase tracking-widest font-bold disabled:opacity-30 flex items-center justify-center gap-3"
                                        >
                                            Continue to Details <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <div className="flex items-center gap-2 mb-6 cursor-pointer text-studio-stone hover:text-black" onClick={() => setBookingStep(1)}>
                                            <ChevronLeft className="w-4 h-4" /> <span className="text-[9px] uppercase tracking-widest">Back</span>
                                        </div>
                                        <h4 className="font-serif italic text-3xl mb-8">Who are you?</h4>
                                        <div className="space-y-4 mb-8">
                                            <input type="text" placeholder="Full Name" className="w-full p-4 rounded-xl bg-studio-cream border border-ebony-10 font-sans text-sm" />
                                            <input type="email" placeholder="Email Address" className="w-full p-4 rounded-xl bg-studio-cream border border-ebony-10 font-sans text-sm" />
                                            <input type="tel" placeholder="Phone Number" className="w-full p-4 rounded-xl bg-studio-cream border border-ebony-10 font-sans text-sm" />
                                            <textarea placeholder="Tell us about the magic you're planning..." className="w-full p-4 rounded-xl bg-studio-cream border border-ebony-10 font-sans text-sm h-24" />
                                        </div>
                                        <button className="w-full btn-ebony p-5 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-xl">Request Access</button>
                                        <p className="mt-4 text-[9px] text-studio-stone text-center uppercase tracking-widest">A curator will reach out within 24h.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Peace be with you. I am the Tove Studio curator. How can I facilitate your creative journey?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: userMsg }]}],
                config: {
                    systemInstruction: `You are the Curator AI for "Tove Studios", a warm, serene creative studio designed by @korsiwa.co.
                    Spaces:
                    - The Creative Studio: ₦45,000/hr. Minimalist, natural light, Profoto gear.
                    - Korsiwa Gallery: ₦45,000/hr. Nestled in art, serene, artistic dialog.
                    Policy: Nestled in an art gallery. It's an EXPERIENCE. 
                    Tone: Poetic, serene, professional, and slightly artistic. Use words like "essence", "journey", "curate", "light".`,
                }
            });

            setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm lost in thought. Could you speak again?" }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'model', text: "The connection to the studio is currently quiet. Try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-20 right-0 w-[380px] max-w-[calc(100vw-2rem)] h-[550px] bg-white rounded-[2.5rem] shadow-2xl border border-ebony-10 flex flex-col overflow-hidden"
                    >
                        <div className="p-8 border-b border-ebony-10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-studio-cream flex items-center justify-center text-studio-ebony">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <span className="font-serif italic text-xl">The Curator</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:opacity-60 transition-opacity"><X className="w-5 h-5" /></button>
                        </div>
                        
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-studio-cream/30">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${m.role === 'user' ? 'bg-studio-ebony text-white' : 'bg-white border border-ebony-10 text-studio-ebony'}`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                     <div className="flex gap-1 p-2 bg-white rounded-full">
                                        <div className="w-1.5 h-1.5 bg-studio-ebony rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-studio-ebony rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-studio-ebony rounded-full animate-bounce [animation-delay:0.4s]" />
                                     </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-ebony-10 flex gap-2">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Speak your mind..."
                                className="flex-1 px-5 py-4 rounded-full border border-ebony-10 focus:outline-none text-sm bg-studio-cream/50"
                            />
                            <button 
                                onClick={handleSend}
                                className="bg-studio-ebony text-white w-12 h-12 rounded-full flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all font-bold"
                                disabled={!input.trim() || loading}
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-studio-ebony text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </button>
        </div>
    );
};

const Footer = () => (
    <footer className="bg-studio-ebony text-studio-cream pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                <div className="md:col-span-2">
                    <h2 className="font-serif italic text-4xl md:text-5xl mb-8 tracking-tighter shrink-0">Tove Studios.</h2>
                    <p className="text-studio-warm-gray text-lg max-w-sm leading-relaxed mb-8">
                        The ultimate high-fidelity creative studio in Lagos. A curated environment where light meets artistic expression, designed to facilitate your most ambitious visions.
                    </p>
                    <div className="flex flex-col gap-6">
                        <a href="mailto:hello@tovestudios.com" className="group text-studio-cream hover:opacity-60 transition-opacity flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-studio-cream group-hover:text-studio-ebony transition-all">
                                <Mail className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] font-sans tracking-[0.2em] uppercase">hello@tovestudios.com</span>
                        </a>
                        <a href="https://instagram.com" className="group text-studio-cream hover:opacity-60 transition-opacity flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-studio-cream group-hover:text-studio-ebony transition-all">
                                <Instagram className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] font-sans tracking-[0.2em] uppercase">@tovestudios</span>
                        </a>
                    </div>
                </div>
                <div>
                    <h5 className="font-sans text-[10px] uppercase tracking-[0.3em] text-studio-stone mb-10">THE ARCHIVE</h5>
                    <ul className="space-y-4 font-sans text-xs uppercase tracking-widest font-medium">
                        <li><a href="#gallery" className="hover:opacity-50 transition-opacity">Gallery</a></li>
                        <li><Link to="/studio/creative-studio" className="hover:opacity-50 transition-opacity">Content Studio</Link></li>
                        <li><Link to="/studio/korsiwa-gallery" className="hover:opacity-50 transition-opacity">Art Gallery</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-sans text-[10px] uppercase tracking-[0.3em] text-studio-stone mb-10">THE ESSENCE</h5>
                    <ul className="space-y-4 font-sans text-xs uppercase tracking-widest font-medium text-studio-warm-gray">
                        <li>VI Annex, Lagos</li>
                        <li>@korsiwa.co</li>
                        <li>Private Access</li>
                    </ul>
                </div>
            </div>
            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-studio-stone">© 2026 TOVE STUDIOS. ALL RIGHTS RESERVED.</span>
                <div className="flex gap-4">
                    <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-studio-stone">Privacy</span>
                    <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-studio-stone">Terms</span>
                </div>
            </div>
        </div>
    </footer>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-studio-cream selection:bg-studio-ebony selection:text-studio-cream">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/studio/:id" element={<StudioDetails />} />
        </Routes>
        <Footer />
        <ChatWidget />
      </div>
    </Router>
  );
}
