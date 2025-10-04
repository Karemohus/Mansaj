import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { SiteContent, FurnitureItem, Client } from './types';
import { EditableText, EditableImage } from './components/Editable';
import { PhoneIcon, MailIcon, LocationIcon, EditIcon } from './components/icons';

const initialContent: SiteContent = {
  hero: {
    title: "منسج للأثاث",
    subtitle: "نصنع من الخشب حكايات، ومن الأثاث بيوتاً تنبض بالحياة",
    backgroundImage: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1920&auto=format&fit=crop",
  },
  about: {
    title: "فن الصناعة، برؤية عصرية",
    text: "في منسج، نؤمن بأن الأثاث هو روح المكان. منذ تأسيسنا في قلب المملكة العربية السعودية، ونحن ملتزمون بتقديم تصاميم فريدة تجمع بين الأصالة والعصرية، مستخدمين أجود أنواع الأخشاب والمواد لنصنع قطعاً فنية تدوم لأجيال.",
    imageUrl: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop",
  },
  furniture: {
    title: "إبداعاتنا",
    items: [
      { id: 1, name: "أثاث منزلي", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop" },
      { id: 2, name: "أثاث مكتبي", imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" },
      { id: 3, name: "تصميم مخصص", imageUrl: "https://images.unsplash.com/photo-1611217834579-450005423455?q=80&w=800&auto=format&fit=crop" },
      { id: 4, name: "مشاريع فندقية", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop" },
    ],
  },
  clients: {
    title: "شركاء النجاح",
    items: [
      { id: 1, name: "NEOM", logoUrl: "https://picsum.photos/200/100?grayscale&random=21" },
      { id: 2, name: "Red Sea Global", logoUrl: "https://picsum.photos/200/100?grayscale&random=22" },
      { id: 3, name: "Aramco", logoUrl: "https://picsum.photos/200/100?grayscale&random=23" },
      { id: 4, name: "Roshn", logoUrl: "https://picsum.photos/200/100?grayscale&random=24" },
      { id: 5, name: "Diriyah Gate", logoUrl: "https://picsum.photos/200/100?grayscale&random=25" },
    ],
  },
  contact: {
    phone: "+966567930000",
    email: "info@mansaj.sa",
    address: "الأحساء، المملكة العربية السعودية",
  },
};

const deepCopy = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

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


const App: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const containerRef = useIntersectionObserver({ threshold: 0.1 });

  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('mansaj-content');
      if (savedContent) setContent(JSON.parse(savedContent));
    } catch (error) {
      console.error("Failed to load content from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('mansaj-content', JSON.stringify(content));
    } catch (error) {
      console.error("Failed to save content to localStorage", error);
    }
  }, [content]);
  
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
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContentChange = useCallback(<K extends keyof SiteContent, V>(section: K, field: keyof SiteContent[K], value: V) => {
    setContent(prev => {
      const newContent = deepCopy(prev);
      (newContent[section] as any)[field] = value;
      return newContent;
    });
  }, []);
  
  const handleListItemChange = useCallback(<K extends keyof SiteContent, P extends keyof SiteContent[K]>(section: K, listName: P, index: number, field: any, value: any) => {
    setContent(prev => {
        const newContent = deepCopy(prev);
        (newContent[section][listName] as any[])[index][field] = value;
        return newContent;
    });
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
            <button onClick={() => setIsAdmin(!isAdmin)} className="px-4 py-2 text-sm bg-amber-500 text-black rounded-md hover:bg-amber-400 transition-colors hidden md:block">
                {isAdmin ? 'إنهاء التعديل' : 'تفعيل التعديل'}
            </button>
          </div>
        </nav>
      </header>
      
      {isAdmin && (
         <div className="fixed bottom-5 end-5 z-50">
            <button onClick={() => setIsAdmin(!isAdmin)} className="md:hidden px-3 py-2 text-xs bg-amber-500 text-black rounded-md hover:bg-amber-400 transition-colors mb-2 w-full">
                {isAdmin ? 'إنهاء' : 'تعديل'}
            </button>
            <button 
                onClick={() => setIsPanelOpen(!isPanelOpen)} 
                className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform hover:scale-110 focus:outline-none"
                aria-label="Open Admin Panel"
            >
                <EditIcon className="w-8 h-8"/>
            </button>
        </div>
      )}

      {isPanelOpen && isAdmin && <AdminPanel content={content} setContent={setContent} closePanel={() => setIsPanelOpen(false)} />}


      <main>
        <section id="hero" className="h-screen min-h-[600px] relative flex items-center justify-center text-center text-white">
            <div className="absolute inset-0 z-0">
                <EditableImage 
                    isAdmin={isAdmin} 
                    src={content.hero.backgroundImage} 
                    alt="Hero background" 
                    onChange={(v) => handleContentChange('hero', 'backgroundImage', v)} 
                    className="w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            </div>
            <div className="relative z-10 p-6 animate-on-scroll animate-fade-up">
                <EditableText 
                    as="h1" 
                    isAdmin={isAdmin} 
                    value={content.hero.title} 
                    onChange={(v) => handleContentChange('hero', 'title', v)} 
                    className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-amber-400 mb-4"
                />
                <EditableText 
                    as="p" 
                    isAdmin={isAdmin} 
                    value={content.hero.subtitle} 
                    onChange={(v) => handleContentChange('hero', 'subtitle', v)} 
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
              <EditableImage isAdmin={isAdmin} src={content.about.imageUrl} alt="About Mansaj" onChange={(v) => handleContentChange('about', 'imageUrl', v)} className="rounded-lg shadow-2xl aspect-square object-cover"/>
            </div>
            <div className="animate-on-scroll animate-fade-left">
              <EditableText as="h2" isAdmin={isAdmin} value={content.about.title} onChange={(v) => handleContentChange('about', 'title', v)} className="text-4xl lg:text-5xl font-bold mb-6 text-amber-400"/>
              <EditableText as="p" isAdmin={isAdmin} value={content.about.text} onChange={(v) => handleContentChange('about', 'text', v)} className="text-lg text-gray-300 leading-relaxed" textarea/>
            </div>
          </div>
        </section>

        <section id="furniture" className="py-24 bg-[#1a1a1a]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-on-scroll animate-fade-up">
                    <EditableText as="h2" isAdmin={isAdmin} value={content.furniture.title} onChange={(v) => handleContentChange('furniture', 'title', v)} className="text-4xl lg:text-5xl font-bold text-amber-400"/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {content.furniture.items.map((item, index) => (
                        <div key={item.id} className="group bg-[#242424] rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-on-scroll animate-fade-up" style={{transitionDelay: `${index * 100}ms`}}>
                            <div className="aspect-w-1 aspect-h-1">
                               <EditableImage isAdmin={isAdmin} src={item.imageUrl} alt={item.name} onChange={(v) => handleListItemChange('furniture', 'items', index, 'imageUrl', v)} className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"/>
                            </div>
                            <div className="p-6">
                               <EditableText as="h3" isAdmin={isAdmin} value={item.name} onChange={(v) => handleListItemChange('furniture', 'items', index, 'name', v)} className="text-xl font-semibold text-white text-center"/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        <section id="clients" className="py-24 bg-[#242424]">
            <div className="container mx-auto px-6 animate-on-scroll animate-fade-up">
                <div className="text-center">
                    <EditableText as="h2" isAdmin={isAdmin} value={content.clients.title} onChange={(v) => handleContentChange('clients', 'title', v)} className="text-4xl lg:text-5xl font-bold mb-4 text-amber-400"/>
                    <p className="text-lg text-gray-400 mb-12">موثوق به من قبل كبرى الشركات والمشاريع في المملكة</p>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                    {content.clients.items.map((client, index) => (
                         <div key={client.id} className="relative group animate-on-scroll animate-fade-up" style={{transitionDelay: `${index * 100}ms`}}>
                            <img src={client.logoUrl} alt={client.name} className="h-12 md:h-16 object-contain transition-all duration-300 filter grayscale group-hover:grayscale-0 group-hover:scale-110" />
                             {isAdmin && <button onClick={() => {
                                 const newUrl = prompt('أدخل رابط الشعار الجديد:', client.logoUrl);
                                 if (newUrl) handleListItemChange('clients', 'items', index, 'logoUrl', newUrl)
                             }} className="absolute -top-2 -start-2 w-5 h-5 text-white bg-blue-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center text-xs">E</button>}
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
                    <div className="flex flex-col items-center p-8 bg-[#242424] rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 animate-on-scroll animate-fade-up" style={{transitionDelay: `100ms`}}>
                        <PhoneIcon className="w-12 h-12 text-amber-400 mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">الهاتف</h3>
                        <EditableText as="p" isAdmin={isAdmin} value={content.contact.phone} onChange={(v) => handleContentChange('contact', 'phone', v)} className="text-gray-300"/>
                    </div>
                    <div className="flex flex-col items-center p-8 bg-[#242424] rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 animate-on-scroll animate-fade-up" style={{transitionDelay: `200ms`}}>
                        <MailIcon className="w-12 h-12 text-amber-400 mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">البريد الإلكتروني</h3>
                        <EditableText as="p" isAdmin={isAdmin} value={content.contact.email} onChange={(v) => handleContentChange('contact', 'email', v)} className="text-gray-300"/>
                    </div>
                    <div className="flex flex-col items-center p-8 bg-[#242424] rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 animate-on-scroll animate-fade-up" style={{transitionDelay: `300ms`}}>
                        <LocationIcon className="w-12 h-12 text-amber-400 mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">العنوان</h3>
                        <EditableText as="p" isAdmin={isAdmin} value={content.contact.address} onChange={(v) => handleContentChange('contact', 'address', v)} className="text-gray-300"/>
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


interface AdminPanelProps {
    content: SiteContent;
    setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
    closePanel: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ content, setContent, closePanel }) => {
    const [localContent, setLocalContent] = useState(() => deepCopy(content));

    const handleSave = () => {
        setContent(localContent);
        closePanel();
    };
    
    const handleAddFurnitureItem = () => {
        setLocalContent(prev => {
            const newContent = deepCopy(prev);
            newContent.furniture.items.push({ id: Date.now(), name: "منتج جديد", imageUrl: "https://source.unsplash.com/800x800/?furniture,interior&" + Date.now() });
            return newContent;
        });
    }

    const handleRemoveFurnitureItem = (id: number) => {
        setLocalContent(prev => {
            const newContent = deepCopy(prev);
            newContent.furniture.items = newContent.furniture.items.filter(item => item.id !== id);
            return newContent;
        });
    }

    const handleAddClient = () => {
         setLocalContent(prev => {
            const newContent = deepCopy(prev);
            newContent.clients.items.push({ id: Date.now(), name: "شريك جديد", logoUrl: "https://picsum.photos/200/100?grayscale&random=" + Date.now() });
            return newContent;
        });
    }

    const handleRemoveClient = (id: number) => {
        setLocalContent(prev => {
            const newContent = deepCopy(prev);
            newContent.clients.items = newContent.clients.items.filter(item => item.id !== id);
            return newContent;
        });
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-end" onClick={closePanel}>
            <div className="w-full max-w-md h-full bg-[#1a1a1a] text-white shadow-2xl p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-amber-400">لوحة التحكم</h2>
                    <button onClick={closePanel} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-4">قسم المنتجات</h3>
                        <div className="max-h-60 overflow-y-auto pr-2">
                            {localContent.furniture.items.map((item, index) => (
                                <div key={item.id} className="flex items-center gap-2 mb-2 p-2 bg-gray-800 rounded">
                                    <input 
                                        type="text" 
                                        value={item.name} 
                                        onChange={(e) => {
                                            const newContent = deepCopy(localContent);
                                            newContent.furniture.items[index].name = e.target.value;
                                            setLocalContent(newContent);
                                        }}
                                        className="flex-grow bg-gray-700 p-1 rounded border-transparent focus:ring-amber-500 focus:border-amber-500"
                                    />
                                    <button onClick={() => handleRemoveFurnitureItem(item.id)} className="text-red-500 text-xs px-2 hover:text-red-400">حذف</button>
                                </div>
                            ))}
                        </div>
                         <button onClick={handleAddFurnitureItem} className="mt-2 text-sm bg-green-600 px-3 py-1 rounded hover:bg-green-700 w-full">إضافة منتج</button>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-4">قسم العملاء</h3>
                        <div className="max-h-60 overflow-y-auto pr-2">
                            {localContent.clients.items.map((item, index) => (
                                <div key={item.id} className="flex items-center gap-2 mb-2 p-2 bg-gray-800 rounded">
                                    <input 
                                        type="text" 
                                        value={item.name} 
                                        onChange={(e) => {
                                            const newContent = deepCopy(localContent);
                                            newContent.clients.items[index].name = e.target.value;
                                            setLocalContent(newContent);
                                        }}
                                        className="flex-grow bg-gray-700 p-1 rounded border-transparent focus:ring-amber-500 focus:border-amber-500"
                                    />
                                    <button onClick={() => handleRemoveClient(item.id)} className="text-red-500 text-xs px-2 hover:text-red-400">حذف</button>
                                </div>
                            ))}
                        </div>
                         <button onClick={handleAddClient} className="mt-2 text-sm bg-green-600 px-3 py-1 rounded hover:bg-green-700 w-full">إضافة عميل</button>
                    </div>

                    <div className="pt-4">
                        <button onClick={handleSave} className="w-full bg-blue-600 py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition-colors">
                            حفظ التغييرات
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;