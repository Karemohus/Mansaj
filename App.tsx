
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { SiteContent, Client, FurnitureItem } from './types';
import { EditableText, EditableImage } from './components/Editable';
import { PhoneIcon, MailIcon, LocationIcon, WhatsAppIcon } from './components/icons';
import { initialContent } from './content';
import { AdminPage } from './components/Admin';


const useIntersectionObserver = (options: IntersectionObserverInit) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, options);

    const elements = containerRef.current?.querySelectorAll('.animate-on-scroll');
    if (elements) {
      elements.forEach(el => observer.observe(el));
    }

    return () => {
      if (elements) {
        elements.forEach(el => observer.unobserve(el));
      }
    };
  }, [options]);

  return containerRef;
};

const ClientModal: React.FC<{ client: Client, onClose: () => void }> = ({ client, onClose }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div 
        onClick={handleBackdropClick}
        className="fixed inset-0 z-[100] bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        aria-modal="true"
        role="dialog"
    >
      <div 
        ref={modalRef}
        className="bg-[#242424] text-white rounded-lg shadow-2xl max-w-2xl w-full mx-auto overflow-hidden transform animate-zoom-in"
      >
        <div className="p-6 sm:p-8 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            aria-label="إغلاق"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-right">
            <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-white p-2 rounded-md flex items-center justify-center">
              <img src={client.logoUrl} alt={client.name} className="max-w-full max-h-full object-contain" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-2">{client.name}</h2>
              <p className="text-base text-gray-300 leading-relaxed mb-4">{client.description}</p>
              {client.websiteUrl && (
                <a 
                  href={client.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center sm:justify-start gap-2 text-amber-400 hover:text-amber-300 transition-colors font-semibold"
                >
                  <span>زيارة الموقع الإلكتروني</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes zoom-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-zoom-in { animation: zoom-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

const FurnitureModal: React.FC<{ item: FurnitureItem, onClose: () => void }> = ({ item, onClose }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div 
        onClick={handleBackdropClick}
        className="fixed inset-0 z-[100] bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        aria-modal="true"
        role="dialog"
    >
      <div 
        ref={modalRef}
        className="relative bg-transparent text-white rounded-lg shadow-2xl max-w-4xl w-full mx-auto transform animate-zoom-in"
      >
        <button 
          onClick={onClose} 
          className="absolute -top-10 right-0 text-gray-300 hover:text-white transition-colors z-10 bg-black/30 rounded-full p-1"
          aria-label="إغلاق"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <figure>
            <img src={item.imageUrl.replace('w=800', 'w=1200')} alt={item.name} className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
            <figcaption className="text-center mt-4 text-xl font-semibold">{item.name}</figcaption>
        </figure>
      </div>
    </div>
  );
};


const PublicSite: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showPhoneOptions, setShowPhoneOptions] = useState(false);
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureItem | null>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: true });


  const containerRef = useIntersectionObserver({ threshold: 0.1 });
  const phoneOptionsRef = useRef<HTMLDivElement>(null);
  const furnitureScrollRef = useRef<HTMLDivElement>(null);

  const handleFurnitureScroll = (direction: 'left' | 'right') => {
    const container = furnitureScrollRef.current;
    if (container && container.children.length > 1) {
        const firstItem = container.children[0] as HTMLElement;
        const secondItem = container.children[1] as HTMLElement;

        // Calculate the scroll distance by measuring the offset between the start of the first and second items.
        // This is more robust as it includes the item's width and the gap between items.
        const scrollAmount = secondItem.offsetLeft - firstItem.offsetLeft;

        container.scrollBy({
            left: direction === 'right' ? scrollAmount : -scrollAmount,
            behavior: 'smooth',
        });
    }
  };

  const handleScrollCheck = useCallback(() => {
    const container = furnitureScrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const isRtl = getComputedStyle(container).direction === 'rtl';
    const scrollEndTolerance = 5;

    let atStart: boolean;
    let atEnd: boolean;
    
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll < scrollEndTolerance) {
        atStart = true;
        atEnd = true;
    } else if (isRtl) {
        // Heuristic to detect Firefox-style RTL (scrollLeft is 0 or negative)
        if (scrollLeft <= 0) { 
            atStart = Math.abs(scrollLeft) < scrollEndTolerance;
            atEnd = Math.abs(scrollLeft) >= maxScroll - scrollEndTolerance;
        } else { // Chrome-style RTL (scrollLeft is positive and decreases from max to 0)
            atStart = scrollLeft >= maxScroll - scrollEndTolerance;
            atEnd = scrollLeft < scrollEndTolerance;
        }
    } else { // LTR
        atStart = scrollLeft < scrollEndTolerance;
        atEnd = scrollLeft >= maxScroll - scrollEndTolerance;
    }
    
    // The 'left' button corresponds to "Previous", and 'right' to "Next".
    // Disable "Previous" when at the start.
    // Disable "Next" when at the end.
    setCanScroll({
        left: !atStart,
        right: !atEnd,
    });
  }, [content.furniture.items]);

  useEffect(() => {
    const scroller = furnitureScrollRef.current;
    if (scroller) {
        // A small delay to ensure the DOM is fully painted and scroll properties are accurate.
        const timer = setTimeout(handleScrollCheck, 100);
        
        scroller.addEventListener('scroll', handleScrollCheck, { passive: true });
        window.addEventListener('resize', handleScrollCheck);

        return () => {
            clearTimeout(timer);
            scroller.removeEventListener('scroll', handleScrollCheck);
            window.removeEventListener('resize', handleScrollCheck);
        };
    }
  }, [handleScrollCheck, content.furniture.items]);


  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('mansaj-content');
      if (savedContent) setContent(JSON.parse(savedContent));
    } catch (error) {
      console.error("Failed to load content from localStorage", error);
    }
    
    const handleStorageChange = () => {
       try {
        const savedContent = localStorage.getItem('mansaj-content');
        if (savedContent) setContent(JSON.parse(savedContent));
       } catch (error) {
         console.error("Failed to reload content from localStorage", error);
       }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);

  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = document.querySelectorAll('section[id]');
      let current = 'hero';
      const headerOffset = 80; 
      sections.forEach(section => {
          const sectionEl = section as HTMLElement;
          const sectionTop = sectionEl.offsetTop - headerOffset;
          if (window.scrollY >= sectionTop) {
              current = section.id;
          }
      });
      setActiveSection(current);

      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalScroll > 0) {
        const currentScroll = window.scrollY;
        const scrolledPercent = (currentScroll / totalScroll) * 100;
        setScrollProgress(scrolledPercent);
      } else {
        setScrollProgress(0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (phoneOptionsRef.current && !phoneOptionsRef.current.contains(event.target as Node)) {
            setShowPhoneOptions(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const navLinkClasses = (sectionId: string) => 
    `relative transition-colors duration-300 ${activeSection === sectionId ? 'text-amber-400 font-bold' : 'hover:text-amber-400'} after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-amber-400 after:transition-all after:duration-300 ${activeSection === sectionId ? 'after:w-full' : 'hover:after:w-full'}`;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href')?.slice(1);
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={containerRef} className="bg-[#1a1a1a] text-white selection:bg-amber-500 selection:text-black">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes pop-up {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-pop-up { 
          animation: pop-up 0.2s ease-out forwards; 
          transform-origin: bottom center;
        }
      `}</style>
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-800 z-[60]">
        <div 
          className="h-1.5 bg-amber-400" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#1a1a1a] bg-opacity-80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#hero" onClick={handleNavClick} className="text-3xl font-bold tracking-wider text-amber-400">منسج</a>
          <div className="flex items-center gap-8">
            <ul className="hidden md:flex items-center space-x-8 space-x-reverse">
              <li><a href="#about" onClick={handleNavClick} className={navLinkClasses('about')}>عن الشركة</a></li>
              <li><a href="#furniture" onClick={handleNavClick} className={navLinkClasses('furniture')}>منتجاتنا</a></li>
              <li><a href="#clients" onClick={handleNavClick} className={navLinkClasses('clients')}>شركاؤنا</a></li>
              <li><a href="#contact" onClick={handleNavClick} className={navLinkClasses('contact')}>تواصل معنا</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <main>
        <section id="hero" className="h-screen min-h-[600px] relative flex items-center justify-center text-center text-white">
            <div className="absolute inset-0 z-0">
                <EditableImage 
                    isAdmin={false} 
                    src={content.hero.backgroundImage} 
                    alt="Hero background" 
                    onChange={()=>{}} 
                    className="w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            </div>
            <div className="relative z-10 p-6 animate-on-scroll animate-fade-up">
                <EditableText 
                    as="h1" 
                    isAdmin={false} 
                    value={content.hero.title} 
                    onChange={()=>{}} 
                    className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-amber-400 mb-4"
                />
                <EditableText 
                    as="p" 
                    isAdmin={false} 
                    value={content.hero.subtitle} 
                    onChange={()=>{}} 
                    className="text-lg md:text-xl max-w-2xl mx-auto text-gray-200 mb-8"
                />
                <a href="#furniture" onClick={handleNavClick} className="bg-amber-500 text-black font-bold py-3 px-8 rounded-md hover:bg-amber-400 transition-all duration-300 transform hover:scale-105">
                    اكتشف إبداعاتنا
                </a>
            </div>
        </section>

        <section id="about" className="py-24 bg-[#242424] overflow-hidden">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative animate-on-scroll animate-fade-right">
              <EditableImage isAdmin={false} src={content.about.imageUrl} alt="About Mansaj" onChange={()=>{}} className="rounded-lg shadow-2xl aspect-square object-cover"/>
            </div>
            <div className="animate-on-scroll animate-fade-left">
              <EditableText as="h2" isAdmin={false} value={content.about.title} onChange={()=>{}} className="text-4xl lg:text-5xl font-bold mb-6 text-amber-400"/>
              <EditableText as="p" isAdmin={false} value={content.about.text} onChange={()=>{}} className="text-lg text-gray-300 leading-relaxed" textarea/>
            </div>
          </div>
        </section>
        
        <section id="furniture" className="py-24 bg-[#1a1a1a] overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-on-scroll animate-fade-up">
                    <EditableText as="h2" isAdmin={false} value={content.furniture.title} onChange={()=>{}} className="text-4xl lg:text-5xl font-bold text-amber-400"/>
                </div>
                
                <div className="relative max-w-7xl mx-auto animate-on-scroll animate-fade-up">
                    <div 
                        ref={furnitureScrollRef}
                        className="flex items-stretch gap-6 pb-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
                    >
                        {content.furniture.items.map((item) => (
                            <button 
                                key={item.id}
                                onClick={() => setSelectedFurniture(item)}
                                className="group relative flex-shrink-0 w-3/4 sm:w-1/3 snap-start bg-[#242424] rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-amber-500/20 hover:-translate-y-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
                                aria-label={`عرض ${item.name}`}
                            >
                                <EditableImage isAdmin={false} src={item.imageUrl} alt={item.name} onChange={()=>{}} className="w-full h-64 object-cover"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <EditableText as="h3" isAdmin={false} value={item.name} onChange={()=>{}} className="text-lg font-bold text-white text-right"/>
                                </div>
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={() => handleFurnitureScroll('left')}
                        disabled={!canScroll.left}
                        className="absolute top-1/2 -translate-y-1/2 -left-4 z-10 bg-white/10 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-amber-500/50 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
                        aria-label="السابق"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button 
                        onClick={() => handleFurnitureScroll('right')}
                        disabled={!canScroll.right}
                        className="absolute top-1/2 -translate-y-1/2 -right-4 z-10 bg-white/10 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-amber-500/50 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
                        aria-label="التالي"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
        
        <section id="clients" className="py-24 bg-[#242424]">
            <div className="container mx-auto px-6 animate-on-scroll animate-fade-up">
                <div className="text-center">
                    <EditableText as="h2" isAdmin={false} value={content.clients.title} onChange={()=>{}} className="text-4xl lg:text-5xl font-bold mb-4 text-amber-400"/>
                    <p className="text-lg text-gray-400 mb-12">موثوق به من قبل كبرى الشركات والمشاريع في المملكة</p>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                    {content.clients.items.map((client, index) => (
                         <div 
                            key={client.id}
                            className="animate-on-scroll animate-fade-up"
                            style={{transitionDelay: `${index * 100}ms`}}
                         >
                            <div 
                                 role="button"
                                 tabIndex={0}
                                 onClick={() => setSelectedClient(client)}
                                 onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedClient(client); }}}
                                 className="relative group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#242424] rounded-md" 
                                 aria-label={`عرض تفاصيل ${client.name}`}
                             >
                                <img src={client.logoUrl} alt={client.name} className="h-12 md:h-16 object-contain transition-all duration-300 filter grayscale group-hover:grayscale-0 group-hover:scale-110" />
                             </div>
                         </div>
                    ))}
                </div>
            </div>
        </section>

        <section id="contact" className="py-24 bg-[#1a1a1a]">
            <div className="container mx-auto px-6 text-center">
                <div className="animate-on-scroll animate-fade-up">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-amber-400">تواصل معنا</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div 
                        ref={phoneOptionsRef}
                        className="relative group flex flex-col items-center p-8 bg-[#242424] rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 animate-on-scroll animate-fade-up" 
                        style={{transitionDelay: `100ms`}}
                    >
                        <div onClick={() => setShowPhoneOptions(prev => !prev)} className="cursor-pointer flex flex-col items-center w-full">
                            <PhoneIcon className="w-12 h-12 text-amber-400 mb-4 transition-transform duration-300 group-hover:scale-110"/>
                            <h3 className="text-xl font-semibold mb-2">الهاتف</h3>
                            <EditableText as="p" isAdmin={false} value={content.contact.phone} onChange={()=>{}} className="text-gray-300"/>
                        </div>
                        {showPhoneOptions && (
                            <div className="absolute bottom-full mb-3 w-[calc(100%-2rem)] bg-[#333] rounded-lg shadow-xl p-2 z-20 animate-pop-up">
                                <a 
                                    href={`tel:${content.contact.phone.replace(/\s/g, '')}`} 
                                    className="flex items-center justify-start gap-3 w-full text-right px-3 py-2 text-sm text-white rounded-md hover:bg-amber-500 hover:text-black transition-colors"
                                >
                                    <PhoneIcon className="w-5 h-5"/>
                                    <span>اتصال</span>
                                </a>
                                <a 
                                    href={`https://wa.me/${content.contact.phone.replace(/[\s+]/g, '')}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-start gap-3 w-full text-right px-3 py-2 text-sm text-white rounded-md hover:bg-green-500 hover:text-white transition-colors"
                                >
                                    <WhatsAppIcon className="w-5 h-5"/>
                                    <span>واتساب</span>
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="group flex flex-col items-center p-8 bg-[#242424] rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 animate-on-scroll animate-fade-up" style={{transitionDelay: `200ms`}}>
                        <MailIcon className="w-12 h-12 text-amber-400 mb-4 transition-transform duration-300 group-hover:scale-110"/>
                        <h3 className="text-xl font-semibold mb-2">البريد الإلكتروني</h3>
                        <EditableText as="p" isAdmin={false} value={content.contact.email} onChange={()=>{}} className="text-gray-300"/>
                    </div>
                    <div className="group flex flex-col items-center p-8 bg-[#242424] rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 animate-on-scroll animate-fade-up" style={{transitionDelay: `300ms`}}>
                        <LocationIcon className="w-12 h-12 text-amber-400 mb-4 transition-transform duration-300 group-hover:scale-110"/>
                        <h3 className="text-xl font-semibold mb-2">العنوان</h3>
                        <a 
                            href="https://maps.app.goo.gl/GJR8QAKzja6ZHURQ9" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-300 hover:text-amber-400 transition-colors"
                        >
                            <EditableText as="span" isAdmin={false} value={content.contact.address} onChange={()=>{}} className=""/>
                        </a>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-black py-8">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} شركة منسج للأثاث. جميع الحقوق محفوظة.</p>
        </div>
      </footer>

      {selectedClient && <ClientModal client={selectedClient} onClose={() => setSelectedClient(null)} />}
      {selectedFurniture && <FurnitureModal item={selectedFurniture} onClose={() => setSelectedFurniture(null)} />}
    </div>
  );
};


const App: React.FC = () => {
    const [pathname] = useState(window.location.pathname);

    if (pathname.startsWith('/admin')) {
        return <AdminPage />;
    }
    
    return <PublicSite />;
};

export default App;