import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { SiteContent, Client, FurnitureItem, StoreProduct } from './types';
import { PhoneIcon, MailIcon, LocationIcon, WhatsAppIcon, MansajLogo } from './components/icons';
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

// --- Lazy Loading Image Component ---
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const placeholderSrc = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

const LazyImage: React.FC<LazyImageProps> = ({ src, srcSet, className, alt, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const currentRef = imageRef.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target as HTMLImageElement;
                        if (src) img.src = src;
                        if (srcSet) img.srcset = srcSet;
                        obs.unobserve(img);
                    }
                });
            },
            { rootMargin: '200px 0px' } // Start loading 200px before it enters the viewport
        );

        observer.observe(currentRef);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [src, srcSet]);
    
    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        // We check if the src is not the placeholder to set the loaded state
        // This prevents the fade-in from triggering for the placeholder
        if((e.target as HTMLImageElement).src !== placeholderSrc) {
            setIsLoaded(true);
        }
    };
    
    return (
        <img
            ref={imageRef}
            src={placeholderSrc}
            alt={alt}
            onLoad={handleLoad}
            className={`${className} bg-gray-800 transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            {...props}
        />
    );
};


const HorizontalCarousel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const checkButtons = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxScroll = scrollWidth - clientWidth;
      const currentScroll = Math.abs(Math.round(scrollLeft));
      setCanScrollPrev(currentScroll > 1);
      setCanScrollNext(currentScroll < maxScroll - 1);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkButtons();
      el.addEventListener('scroll', checkButtons, { passive: true });
      window.addEventListener('resize', checkButtons);
      
      const observer = new MutationObserver(checkButtons);
      observer.observe(el, { childList: true, subtree: true });

      return () => {
        el.removeEventListener('scroll', checkButtons);
        window.removeEventListener('resize', checkButtons);
        observer.disconnect();
      };
    }
  }, [checkButtons, children]);

  const scroll = (direction: 'next' | 'prev') => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8;
      // In RTL, "next" is scrolling left (negative) and "prev" is scrolling right (positive).
      el.scrollBy({
        left: direction === 'next' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const ArrowButton: React.FC<{
    direction: 'next' | 'prev';
    onClick: () => void;
    disabled: boolean;
  }> = ({ direction, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-amber-500/50 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-0 disabled:cursor-not-allowed ${
        direction === 'next' ? 'left-0 sm:left-4' : 'right-0 sm:right-4'
      }`}
      aria-label={direction === 'next' ? 'التالي' : 'السابق'}
    >
      {/* SVGs are for an RTL layout */}
      {direction === 'next' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      )}
    </button>
  );

  return (
    <div className="relative group -mx-6 px-0 sm:px-6">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide py-4 scroll-smooth px-6 sm:px-0"
      >
        {children}
      </div>
      <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowButton direction="next" onClick={() => scroll('next')} disabled={!canScrollNext} />
        <ArrowButton direction="prev" onClick={() => scroll('prev')} disabled={!canScrollPrev} />
      </div>
    </div>
  );
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
            <div className="flex flex-col items-center sm:items-start">
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

const FurnitureModal: React.FC<{ items: FurnitureItem[], initialItem: FurnitureItem, onClose: () => void }> = ({ items, initialItem, onClose }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const initialIndex = React.useMemo(() => items.findIndex(i => i.id === initialItem.id), [items, initialItem]);
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [imageLoading, setImageLoading] = useState(true);
  const activeThumbnailRef = React.useRef<HTMLButtonElement>(null);
  
  const currentItem = items[currentIndex];

  const goToNext = useCallback(() => {
    setImageLoading(true);
    setCurrentIndex(prevIndex => (prevIndex + 1) % items.length);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setImageLoading(true);
    setCurrentIndex(prevIndex => (prevIndex - 1 + items.length) % items.length);
  }, [items.length]);
  
  const goToIndex = (index: number) => {
    if (index === currentIndex) return;
    setImageLoading(true);
    setCurrentIndex(index);
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, goToNext, goToPrev]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (activeThumbnailRef.current) {
      activeThumbnailRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentIndex]);


  return (
    <div 
        onClick={handleBackdropClick}
        className="fixed inset-0 z-[100] bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        aria-modal="true"
        role="dialog"
    >
      <div 
        ref={modalRef}
        className="relative text-white w-full max-w-4xl mx-auto flex flex-col gap-4 transform animate-zoom-in"
      >
        <button 
          onClick={onClose} 
          className="absolute -top-10 right-0 text-gray-300 hover:text-white transition-colors z-20 bg-black/30 rounded-full p-1"
          aria-label="إغلاق"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative flex-grow flex items-center justify-center">
            <div className={`w-full h-auto max-h-[70vh] flex items-center justify-center transition-opacity duration-300 ${imageLoading ? 'opacity-50' : 'opacity-100'}`}>
                <img 
                    key={currentItem.id}
                    src={currentItem.imageUrl.replace('w=800', 'w=1200')} 
                    alt={currentItem.name} 
                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                    onLoad={() => setImageLoading(false)}
                />
            </div>

            <button 
                onClick={goToPrev}
                className="absolute left-0 sm:-left-4 z-10 bg-white/10 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-amber-500/50 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="السابق"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button 
                onClick={goToNext}
                className="absolute right-0 sm:-right-4 z-10 bg-white/10 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-amber-500/50 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="التالي"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>

        <div className="flex-shrink-0 text-center">
            <p className="text-xl font-semibold mb-4">{currentItem.name}</p>
            <div className="flex justify-center pb-2">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-4 max-w-full">
                    {items.map((item, index) => (
                        <button
                            key={item.id}
                            ref={index === currentIndex ? activeThumbnailRef : null}
                            onClick={() => goToIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden transition-all duration-300 focus:outline-none ring-offset-2 ring-offset-black ${currentIndex === index ? 'ring-2 ring-amber-400 scale-105' : 'opacity-60 hover:opacity-100'}`}
                            aria-label={`عرض ${item.name}`}
                        >
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const SeoStructuredData: React.FC<{ content: SiteContent }> = ({ content }) => {
  useEffect(() => {
    const scripts: HTMLScriptElement[] = [];
    const siteUrl = window.location.origin;

    // Organization Schema
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "FurnitureStore",
      "name": "منسج للأثاث",
      "url": siteUrl,
      "logo": `${siteUrl}/favicon.svg`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "الأحساء",
        "addressCountry": "SA",
        "streetAddress": content.contact.address
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": content.contact.phone,
        "contactType": "customer service",
        "email": content.contact.email
      }
    };
    const orgScript = document.createElement('script');
    orgScript.type = 'application/ld+json';
    orgScript.innerHTML = JSON.stringify(orgSchema);
    document.head.appendChild(orgScript);
    scripts.push(orgScript);

    // Products Schema
    if (content.furniture.items.length > 0) {
        const productSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "منتجات أثاث منسج",
        "description": "استكشف تشكيلتنا من الأثاث المنزلي والمكتبي والمشاريع الفندقية المصممة خصيصًا.",
        "itemListElement": content.furniture.items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
            "@type": "Product",
            "name": item.name,
            "image": item.imageUrl,
            "description": `أثاث ${item.name} عالي الجودة ومصمم بعناية من منسج.`,
            "brand": {
                "@type": "Brand",
                "name": "منسج للأثاث"
            }
            }
        }))
        };
        const productScript = document.createElement('script');
        productScript.type = 'application/ld+json';
        productScript.innerHTML = JSON.stringify(productSchema);
        document.head.appendChild(productScript);
        scripts.push(productScript);
    }
    
    // Store Products Schema
    if (content.store.items.length > 0) {
        const storeProductSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "منتجات من متجر منسج",
        "description": "منتجات مختارة من متجر منسج متاحة للشراء.",
        "itemListElement": content.store.items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Product",
              "name": item.name,
              "image": item.imageUrl,
              "description": `منتج ${item.name} متوفر في متجر منسج.`,
              "brand": {
                  "@type": "Brand",
                  "name": "منسج للأثاث"
              },
              "offers": {
                "@type": "Offer",
                "priceCurrency": "SAR",
                "price": item.price.replace(/[^0-9.]/g, ''),
                "url": item.productUrl,
                "availability": "https://schema.org/InStock"
              }
            }
        }))
        };
        const storeProductScript = document.createElement('script');
        storeProductScript.type = 'application/ld+json';
        storeProductScript.innerHTML = JSON.stringify(storeProductSchema);
        document.head.appendChild(storeProductScript);
        scripts.push(storeProductScript);
    }

    return () => {
      scripts.forEach(s => document.head.removeChild(s));
    };
  }, [content]);

  return null; // This component does not render anything to the DOM
};

const generateSrcSet = (url: string) => {
  if (!url || !url.includes('unsplash.com')) return { src: url };
  const baseUrl = url.split('?')[0];
  const params = new URLSearchParams(url.split('?')[1]);
  const width = params.get('w') || '1200';

  return {
    src: `${baseUrl}?q=80&w=${width}&auto=format&fit=crop`,
    srcSet: [400, 800, 1200, 1920]
      .map(w => `${baseUrl}?q=80&w=${w}&auto=format&fit=crop ${w}w`)
      .join(', '),
  };
};

const PublicSite: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureItem | null>(null);
  
  const containerRef = useIntersectionObserver({ threshold: 0.1 });

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
      <SeoStructuredData content={content} />
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-800 z-[60]">
        <div 
          className="h-1.5 bg-amber-400" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#1a1a1a] bg-opacity-80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#hero" onClick={handleNavClick} aria-label="الصفحة الرئيسية لمنسج">
            <MansajLogo className="h-8 text-white transition-transform duration-300 hover:scale-105" />
          </a>
          <div className="flex items-center gap-8">
            <ul className="hidden md:flex items-center space-x-8 space-x-reverse">
              <li><a href="#about" onClick={handleNavClick} className={navLinkClasses('about')}>عن الشركة</a></li>
              <li><a href="#furniture" onClick={handleNavClick} className={navLinkClasses('furniture')}>إبداعاتنا</a></li>
              <li><a href="#store" onClick={handleNavClick} className={navLinkClasses('store')}>من متجرنا</a></li>
              <li><a href="#clients" onClick={handleNavClick} className={navLinkClasses('clients')}>شركاؤنا</a></li>
              <li><a href="#contact" onClick={handleNavClick} className={navLinkClasses('contact')}>تواصل معنا</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <main>
        <section id="hero" className="h-screen min-h-[600px] relative flex items-center justify-center text-center text-white">
            <div className="absolute inset-0 z-0">
                <img 
                    {...generateSrcSet(content.hero.backgroundImage)}
                    sizes="100vw"
                    alt="خلفية لغرفة معيشة أنيقة وفاخرة" 
                    className="w-full h-full object-cover"
                    loading="eager"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            </div>
            <div className="relative z-10 p-6 animate-on-scroll animate-fade-up">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-amber-400 mb-4">
                    {content.hero.title}
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-200 mb-8">
                    {content.hero.subtitle}
                </p>
                <a href="#furniture" onClick={handleNavClick} className="bg-amber-500 text-black font-bold py-3 px-8 rounded-md hover:bg-amber-400 transition-all duration-300 transform hover:scale-105">
                    اكتشف إبداعاتنا
                </a>
            </div>
        </section>

        <section id="about" className="py-24 bg-[#242424] overflow-hidden">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative animate-on-scroll animate-fade-right">
              <div className="rounded-lg shadow-2xl aspect-square overflow-hidden">
                <img {...generateSrcSet(content.about.imageUrl)} sizes="(max-width: 768px) 100vw, 50vw" alt="صورة مقربة لأريكة عصرية" className="w-full h-full object-cover"/>
              </div>
            </div>
            <div className="animate-on-scroll animate-fade-left">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-amber-400">{content.about.title}</h2>
              <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">{content.about.text}</p>
            </div>
          </div>
        </section>
        
        <section id="furniture" className="py-24 bg-[#1a1a1a] overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-on-scroll animate-fade-up">
                    <h2 className="text-4xl lg:text-5xl font-bold text-amber-400">{content.furniture.title}</h2>
                </div>
                <div className="max-w-7xl mx-auto animate-on-scroll animate-fade-up">
                    <HorizontalCarousel>
                        {content.furniture.items.map((item) => (
                           <div key={item.id} className="w-64 sm:w-72 md:w-80 flex-shrink-0">
                                <button 
                                    onClick={() => setSelectedFurniture(item)}
                                    className="group relative block w-full bg-[#242424] rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-amber-500/20 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
                                    aria-label={`عرض ${item.name}`}
                                >
                                    <div className="aspect-[3/4] w-full overflow-hidden">
                                        <LazyImage {...generateSrcSet(item.imageUrl)} sizes="320px" alt={item.name} className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-lg font-bold text-white text-right">{item.name}</h3>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </HorizontalCarousel>
                </div>
            </div>
        </section>
        
        <section id="store" className="py-24 bg-[#242424] overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-on-scroll animate-fade-up">
                    <h2 className="text-4xl lg:text-5xl font-bold text-amber-400">{content.store.title}</h2>
                    <p className="text-lg text-gray-400 mt-2">{content.store.subtitle}</p>
                </div>
                <div className="max-w-7xl mx-auto animate-on-scroll animate-fade-up">
                     <HorizontalCarousel>
                        {content.store.items.map((item) => (
                           <div key={item.id} className="w-72 sm:w-80 flex-shrink-0">
                                <div className="group w-full h-full flex flex-col bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-amber-500/20 hover:-translate-y-1 hover:scale-105">
                                   <div className="w-full overflow-hidden aspect-square">
                                      <LazyImage {...generateSrcSet(item.imageUrl)} sizes="320px" alt={item.name} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"/>
                                   </div>
                                   <div className="p-6 text-right flex flex-col flex-grow">
                                       <h3 className="text-xl font-bold text-white mb-2 h-14 overflow-hidden">{item.name}</h3>
                                       <p className="text-lg font-semibold text-amber-400 mb-4">{item.price}</p>
                                       <a 
                                            href={item.productUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block w-full text-center bg-amber-500 text-black font-bold py-2 px-6 rounded-md hover:bg-amber-400 transition-all duration-300 mt-auto"
                                        >
                                            عرض المنتج
                                       </a>
                                   </div>
                                </div>
                            </div>
                        ))}
                    </HorizontalCarousel>
                </div>
            </div>
        </section>

        <section id="clients" className="py-24 bg-[#1a1a1a]">
            <div className="container mx-auto px-6 animate-on-scroll animate-fade-up">
                <div className="text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-amber-400">{content.clients.title}</h2>
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
                                 className="relative group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#1a1a1a] rounded-md" 
                                 aria-label={`عرض تفاصيل ${client.name}`}
                             >
                                <img src={client.logoUrl} alt={client.name} className="h-12 md:h-16 object-contain transition-all duration-300 filter grayscale group-hover:grayscale-0 group-hover:scale-110" />
                             </div>
                         </div>
                    ))}
                </div>
            </div>
        </section>

        <section id="contact" className="py-24 bg-[#242424]">
            <div className="container mx-auto px-6 text-center">
                <div className="animate-on-scroll animate-fade-up">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-amber-400">تواصل معنا</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div 
                        className="group flex flex-col items-center p-8 bg-[#1a1a1a] rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 animate-on-scroll animate-fade-up" 
                        style={{transitionDelay: `100ms`}}
                    >
                        <PhoneIcon className="w-12 h-12 text-amber-400 mb-4 transition-transform duration-300 group-hover:scale-110"/>
                        <h3 className="text-xl font-semibold mb-2">الهاتف</h3>
                        <div className="flex items-center gap-4">
                            <a href={`tel:${content.contact.phone.replace(/\s/g, '')}`} className="text-gray-300 hover:text-amber-400 transition-colors">
                                <span>{content.contact.phone}</span>
                            </a>
                            <a
                                href={`https://wa.me/${content.contact.phone.replace(/[\s+]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`مراسلة ${content.contact.phone} على واتساب`}
                                className="text-green-500 hover:text-green-400 transition-transform hover:scale-110"
                            >
                                <WhatsAppIcon className="w-7 h-7"/>
                            </a>
                        </div>
                    </div>
                    <a href={`mailto:${content.contact.email}`} className="group flex flex-col items-center p-8 bg-[#1a1a1a] rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 animate-on-scroll animate-fade-up" style={{transitionDelay: `200ms`}}>
                        <MailIcon className="w-12 h-12 text-amber-400 mb-4 transition-transform duration-300 group-hover:scale-110"/>
                        <h3 className="text-xl font-semibold mb-2">البريد الإلكتروني</h3>
                        <p className="text-gray-300">{content.contact.email}</p>
                    </a>
                    <div className="group flex flex-col items-center p-8 bg-[#1a1a1a] rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 animate-on-scroll animate-fade-up" style={{transitionDelay: `300ms`}}>
                        <LocationIcon className="w-12 h-12 text-amber-400 mb-4 transition-transform duration-300 group-hover:scale-110"/>
                        <h3 className="text-xl font-semibold mb-2">العنوان</h3>
                        <a 
                            href="https://maps.app.goo.gl/GJR8QAKzja6ZHURQ9" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-300 hover:text-amber-400 transition-colors"
                        >
                           <span>{content.contact.address}</span>
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
      
      <a
        href={`https://wa.me/${content.contact.phone.replace(/[\s+]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر واتساب"
        className={`fixed bottom-8 right-8 z-40 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-green-600 ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <WhatsAppIcon className="w-8 h-8" />
      </a>

      {selectedClient && <ClientModal client={selectedClient} onClose={() => setSelectedClient(null)} />}
      {selectedFurniture && <FurnitureModal items={content.furniture.items} initialItem={selectedFurniture} onClose={() => setSelectedFurniture(null)} />}
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
