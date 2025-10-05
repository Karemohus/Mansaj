
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
      { id: 3, name: "تصميم مخصص", imageUrl: "https://images.unsplash.com/photo-1572377323861-c46372d892a0?q=80&w=800&auto=format&fit=crop" },
      { id: 4, name: "مشاريع فندقية", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop" },
    ],
  },
  store: {
    title: "من متجرنا",
    subtitle: "منتجات مختارة بعناية يمكنك شراؤها الآن",
    items: [
      { id: 1, name: "كرسي استرخاء 'هدوء'", imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800&auto=format&fit=crop", price: "1,850 ر.س", productUrl: "https://example.com/store/product1" },
      { id: 2, name: "طاولة قهوة 'تلاقي' الرخامية", imageUrl: "https://images.unsplash.com/photo-1613203425412-894ac0c0836e?q=80&w=800&auto=format&fit=crop", price: "2,300 ر.س", productUrl: "https://example.com/store/product2" },
      { id: 3, name: "مصباح أرضي 'شعاع' المعدني", imageUrl: "https://images.unsplash.com/photo-1594213280092-6072385a7b6a?q=80&w=800&auto=format&fit=crop", price: "950 ر.س", productUrl: "https://example.com/store/product3" },
      { id: 4, name: "أريكة 'واحة' من الكتان الفاخر", imageUrl: "https://images.unsplash.com/photo-1558211583-d26f610c1a01?q=80&w=800&auto=format&fit=crop", price: "6,200 ر.س", productUrl: "https://example.com/store/product4" },
      { id: 5, name: "مكتب 'إلهام' من خشب الجوز", imageUrl: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=800&auto=format&fit=crop", price: "3,100 ر.س", productUrl: "https://example.com/store/product5" },
      { id: 6, name: "خزانة كتب 'أرفف الحكمة'", imageUrl: "https://images.unsplash.com/photo-1594224457494-0125557884bf?q=80&w=800&auto=format&fit=crop", price: "2,750 ر.س", productUrl: "https://example.com/store/product6" },
      { id: 7, name: "سرير 'أحلام' المنجد", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop", price: "5,400 ر.س", productUrl: "https://example.com/store/product7" },
      { id: 8, name: "طاولة طعام 'ملتقى العائلة'", imageUrl: "https://images.unsplash.com/photo-1551215717-8bc7995a9742?q=80&w=800&auto=format&fit=crop", price: "7,800 ر.س", productUrl: "https://example.com/store/product8" },
      { id: 9, name: "سجادة 'الكثبان' الصوفية", imageUrl: "https://images.unsplash.com/photo-1617462205522-8257d383b334?q=80&w=800&auto=format&fit=crop", price: "1,500 ر.س", productUrl: "https://example.com/store/product9" },
      { id: 10, name: "مرآة 'أصداء' بإطار نحاسي", imageUrl: "https://images.unsplash.com/photo-1616627561859-48b434316135?q=80&w=800&auto=format&fit=crop", price: "650 ر.س", productUrl: "https://example.com/store/product10" },
      { id: 11, name: "وحدة تلفاز 'سينما' العصرية", imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop", price: "2,950 ر.س", productUrl: "https://example.com/store/product11" },
      { id: 12, name: "مقعد 'همسة' بجانب السرير", imageUrl: "https://images.unsplash.com/photo-1543464264-8c0e4a74212a?q=80&w=800&auto=format&fit=crop", price: "1,100 ر.س", productUrl: "https://example.com/store/product12" },
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
