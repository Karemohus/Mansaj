
import type { SiteContent } from './types';

export const initialContent: SiteContent = {
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
      { id: 3, name: "تصميم مخصص", imageUrl: "https://images.unsplash.com/photo-1624720114704-351d5d3a5043?q=80&w=800&auto=format&fit=crop" },
      { id: 4, name: "مشاريع فندقية", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop" },
    ],
  },
  store: {
    title: "من متجرنا",
    subtitle: "منتجات مختارة بعناية يمكنك شراؤها الآن",
    items: [
      { id: 1, name: "كرسي خشبي أنيق", imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800&auto=format&fit=crop", price: "750 ر.س", productUrl: "https://example.com/store/product1" },
      { id: 2, name: "طاولة قهوة عصرية", imageUrl: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?q=80&w=800&auto=format&fit=crop", price: "1,200 ر.س", productUrl: "https://example.com/store/product2" },
      { id: 3, name: "وحدة إضاءة سقفية", imageUrl: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800&auto=format&fit=crop", price: "450 ر.س", productUrl: "https://example.com/store/product3" },
      { id: 4, name: "أريكة جلدية فاخرة", imageUrl: "https://images.unsplash.com/photo-1540574163024-588462b3b7c3?q=80&w=800&auto=format&fit=crop", price: "4,500 ر.س", productUrl: "https://example.com/store/product4" },
      { id: 5, name: "مكتب بتصميم بسيط", imageUrl: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=800&auto=format&fit=crop", price: "2,100 ر.س", productUrl: "https://example.com/store/product5" },
      { id: 6, name: "خزانة كتب خشبية", imageUrl: "https://images.unsplash.com/photo-1594224457494-0125557884bf?q=80&w=800&auto=format&fit=crop", price: "1,850 ر.س", productUrl: "https://example.com/store/product6" },
    ]
  },
  clients: {
    title: "شركاء النجاح",
    items: [
      { 
        id: 1, 
        name: "NEOM", 
        logoUrl: "https://picsum.photos/200/200?grayscale&random=21",
        description: "مشروع مدينة المستقبل الطموح في المملكة العربية السعودية، تشرفنا بتوريد أثاث لمكاتبهم الإدارية ومرافق الضيافة.",
        websiteUrl: "https://www.neom.com/"
      },
      { 
        id: 2, 
        name: "Red Sea Global", 
        logoUrl: "https://picsum.photos/200/200?grayscale&random=22",
        description: "أحد أكثر المشاريع السياحية المتجددة طموحًا في العالم، ساهمنا في تأثيث الفلل الفاخرة والمناطق المشتركة.",
        websiteUrl: "https://www.redseaglobal.com/"
      },
      { 
        id: 3, 
        name: "Aramco", 
        logoUrl: "https://picsum.photos/200/200?grayscale&random=23",
        description: "شركة الطاقة والكيميائيات الرائدة عالميًا، قمنا بتنفيذ مشاريع تأثيث مكتبي مخصصة تلبي أعلى معايير الجودة.",
        websiteUrl: "https://www.aramco.com/"
      },
      { 
        id: 4, 
        name: "Roshn", 
        logoUrl: "https://picsum.photos/200/200?grayscale&random=24",
        description: "مطور عقاري وطني يهدف لرفع جودة الحياة، ونفخر بكوننا أحد الموردين المعتمدين للأثاث في مشاريعهم السكنية.",
        websiteUrl: "https://www.roshn.sa/"
      },
      { 
        id: 5, 
        name: "Diriyah Gate", 
        logoUrl: "https://picsum.photos/200/200?grayscale&random=25",
        description: "مشروع تطوير بوابة الدرعية التاريخية، شاركنا في تصميم وتصنيع قطع أثاث تراثية بلمسة عصرية للمناطق الثقافية.",
        websiteUrl: "https://www.diriyah.sa/"
      },
      { 
        id: 6, 
        name: "مجموعة الكفاح القابضة", 
        logoUrl: "https://picsum.photos/200/200?grayscale&random=26",
        description: "نفخر بشراكتنا مع مجموعة الكفاح، إحدى أبرز المجموعات الاستثمارية في المملكة، حيث قمنا بتأثيث مقرهم الرئيسي الجديد بتصاميم مكتبية عصرية تعكس هويتهم الرائدة.",
        websiteUrl: "https://www.kifah.com/"
      },
    ],
  },
  contact: {
    phone: "+966567930000",
    email: "info@mansaj.sa",
    address: "الأحساء، المملكة العربية السعودية",
  },
};

export const deepCopy = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));
