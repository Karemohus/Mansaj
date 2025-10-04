import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { SiteContent } from './types';
import { EditableText, EditableImage } from './components/Editable';
import { PhoneIcon, MailIcon, LocationIcon } from './components/icons';
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


const PublicSite: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useIntersectionObserver({ threshold: 0.1 });

  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('mansaj-content');
      if (savedContent) setContent(JSON.parse(savedContent));
    } catch (error) {
      console.error("Failed to load content from localStorage", error);
    }
    
    // Listen for storage changes to update UI in real-time if admin saves
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

        <section id="furniture" className="py-24 bg-[#1a1a1a]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-on-scroll animate-fade-up">
                    <EditableText as="h2" isAdmin={false} value={content.furniture.title} onChange={()=>{}} className="text-4xl lg:text-5xl font-bold text-amber-400"/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {content.furniture.items.map((item, index) => (
                        <div key={item.id} className="group bg-[#242424] rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-on-scroll animate-fade-up" style={{transitionDelay: `${index * 100}ms`}}>
                            <div className="aspect-w-1 aspect-h-1">
                               <EditableImage isAdmin={false} src={item.imageUrl} alt={item.name} onChange={()=>{}} className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"/>
                            </div>
                            <div className="p-6">
                               <EditableText as="h3" isAdmin={false} value={item.name} onChange={()=>{}} className="text-xl font-semibold text-white text-center"/>
                            </div>
                        </div>
                    ))}
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
                         <div key={client.id} className="relative group animate-on-scroll animate-fade-up" style={{transitionDelay: `${index * 100}ms`}}>
                            <img src={client.logoUrl} alt={client.name} className="h-12 md:h-16 object-contain transition-all duration-300 filter grayscale group-hover:grayscale-0 group-hover:scale-110" />
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
                    <div className="group flex flex-col items-center p-8 bg-[#242424] rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 animate-on-scroll animate-fade-up" style={{transitionDelay: `100ms`}}>
                        <PhoneIcon className="w-12 h-12 text-amber-400 mb-4 transition-transform duration-300 group-hover:scale-110"/>
                        <h3 className="text-xl font-semibold mb-2">الهاتف</h3>
                        <EditableText as="p" isAdmin={false} value={content.contact.phone} onChange={()=>{}} className="text-gray-300"/>
                    </div>
                    <div className="group flex flex-col items-center p-8 bg-[#242424] rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 animate-on-scroll animate-fade-up" style={{transitionDelay: `200ms`}}>
                        <MailIcon className="w-12 h-12 text-amber-400 mb-4 transition-transform duration-300 group-hover:scale-110"/>
                        <h3 className="text-xl font-semibold mb-2">البريد الإلكتروني</h3>
                        <EditableText as="p" isAdmin={false} value={content.contact.email} onChange={()=>{}} className="text-gray-300"/>
                    </div>
                    <div className="group flex flex-col items-center p-8 bg-[#242424] rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 animate-on-scroll animate-fade-up" style={{transitionDelay: `300ms`}}>
                        <LocationIcon className="w-12 h-12 text-amber-400 mb-4 transition-transform duration-300 group-hover:scale-110"/>
                        <h3 className="text-xl font-semibold mb-2">العنوان</h3>
                        <EditableText as="p" isAdmin={false} value={content.contact.address} onChange={()=>{}} className="text-gray-300"/>
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
