import React, { useState } from 'react';
import type { SiteContent } from '../types';
import { initialContent, deepCopy } from '../content';

const ADMIN_PASSWORD = "mansajadmin";

const LoginPage: React.FC<{ onLogin: (password: string) => void }> = ({ onLogin }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(password);
    };

    return (
        <div className="bg-[#1a1a1a] text-white min-h-screen flex items-center justify-center font-['Cairo']">
            <div className="w-full max-w-sm p-8 space-y-6 bg-[#242424] rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-amber-400">تسجيل دخول المسؤول</h1>
                    <p className="text-gray-400 mt-2">الرجاء إدخال كلمة المرور للوصول إلى لوحة التحكم.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="كلمة المرور"
                            className="w-full px-4 py-2 text-right bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-black bg-amber-500 rounded-md hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-500 transition-colors"
                    >
                        دخول
                    </button>
                </form>
            </div>
        </div>
    );
};

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [content, setContent] = useState<SiteContent>(() => {
        const saved = localStorage.getItem('mansaj-content');
        try {
            return saved ? JSON.parse(saved) : initialContent;
        } catch {
            return initialContent;
        }
    });

    const handleSave = () => {
        localStorage.setItem('mansaj-content', JSON.stringify(content));
        // Dispatch storage event so the public page can update if open in another tab
        window.dispatchEvent(new Event('storage'));
        alert('تم حفظ التغييرات بنجاح!');
    };
    
    const handleFieldChange = (section: keyof SiteContent, field: any, value: any) => {
        setContent(prev => {
            const newContent = deepCopy(prev);
            (newContent[section] as any)[field] = value;
            return newContent;
        });
    };

    const handleListItemChange = (section: keyof SiteContent, listName: any, index: number, field: any, value: any) => {
        setContent(prev => {
            const newContent = deepCopy(prev);
            (newContent[section] as any)[listName][index][field] = value;
            return newContent;
        });
    };

    const handleAddItem = (section: keyof SiteContent, listName: 'items') => {
        setContent(prev => {
            const newContent = deepCopy(prev);
            const list = (newContent[section] as any)[listName];
            if(section === 'furniture'){
                list.push({ id: Date.now(), name: "منتج جديد", imageUrl: "https://source.unsplash.com/800x800/?furniture&" + Date.now() });
            } else if (section === 'clients') {
                list.push({ id: Date.now(), name: "عميل جديد", logoUrl: "https://picsum.photos/200/100?grayscale&random=" + Date.now() });
            }
            return newContent;
        });
    };

    const handleRemoveItem = (section: keyof SiteContent, listName: 'items', id: number) => {
        setContent(prev => {
            const newContent = deepCopy(prev);
            (newContent[section] as any)[listName] = (newContent[section] as any)[listName].filter((item: any) => item.id !== id);
            return newContent;
        });
    };

    return (
        <div className="bg-[#1a1a1a] text-white min-h-screen p-4 sm:p-8 font-['Cairo']">
            <div className="max-w-4xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-700">
                    <h1 className="text-3xl font-bold text-amber-400 mb-4 sm:mb-0">لوحة التحكم</h1>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <a href="/" target="_blank" rel="noopener noreferrer" className="flex-1 text-center px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors">عرض الموقع</a>
                        <button onClick={onLogout} className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">تسجيل الخروج</button>
                    </div>
                </header>

                <div className="space-y-10">
                    {/* Hero Section */}
                    <AdminSection title="القسم الرئيسي (Hero)">
                        <InputField label="العنوان الرئيسي" value={content.hero.title} onChange={e => handleFieldChange('hero', 'title', e.target.value)} />
                        <InputField label="العنوان الفرعي" value={content.hero.subtitle} onChange={e => handleFieldChange('hero', 'subtitle', e.target.value)} />
                        <InputField label="رابط صورة الخلفية" value={content.hero.backgroundImage} onChange={e => handleFieldChange('hero', 'backgroundImage', e.target.value)} />
                    </AdminSection>

                    {/* About Section */}
                    <AdminSection title="عن الشركة">
                        <InputField label="العنوان" value={content.about.title} onChange={e => handleFieldChange('about', 'title', e.target.value)} />
                        <TextareaField label="النص" value={content.about.text} onChange={e => handleFieldChange('about', 'text', e.target.value)} />
                        <InputField label="رابط الصورة" value={content.about.imageUrl} onChange={e => handleFieldChange('about', 'imageUrl', e.target.value)} />
                    </AdminSection>

                    {/* Furniture Section */}
                    <AdminSection title="المنتجات">
                        <InputField label="عنوان القسم" value={content.furniture.title} onChange={e => handleFieldChange('furniture', 'title', e.target.value)} />
                        <div className="space-y-4 mt-4">
                            {content.furniture.items.map((item, index) => (
                                <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                                    <input type="text" value={item.name} onChange={e => handleListItemChange('furniture', 'items', index, 'name', e.target.value)} className="flex-grow bg-gray-700 p-1 rounded border-transparent focus:ring-amber-500 focus:border-amber-500" placeholder="اسم المنتج"/>
                                    <input type="text" value={item.imageUrl} onChange={e => handleListItemChange('furniture', 'items', index, 'imageUrl', e.target.value)} className="flex-grow bg-gray-700 p-1 rounded border-transparent focus:ring-amber-500 focus:border-amber-500" placeholder="رابط الصورة"/>
                                    <button onClick={() => handleRemoveItem('furniture', 'items', item.id)} className="text-red-500 text-xs px-2 hover:text-red-400">حذف</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleAddItem('furniture', 'items')} className="mt-4 w-full text-sm bg-green-600 px-3 py-2 rounded hover:bg-green-700">إضافة منتج</button>
                    </AdminSection>

                    {/* Clients Section */}
                    <AdminSection title="شركاء النجاح">
                        <InputField label="عنوان القسم" value={content.clients.title} onChange={e => handleFieldChange('clients', 'title', e.target.value)} />
                         <div className="space-y-4 mt-4">
                            {content.clients.items.map((item, index) => (
                                <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                                    <input type="text" value={item.name} onChange={e => handleListItemChange('clients', 'items', index, 'name', e.target.value)} className="flex-grow bg-gray-700 p-1 rounded border-transparent focus:ring-amber-500 focus:border-amber-500" placeholder="اسم العميل"/>
                                    <input type="text" value={item.logoUrl} onChange={e => handleListItemChange('clients', 'items', index, 'logoUrl', e.target.value)} className="flex-grow bg-gray-700 p-1 rounded border-transparent focus:ring-amber-500 focus:border-amber-500" placeholder="رابط الشعار"/>
                                    <button onClick={() => handleRemoveItem('clients', 'items', item.id)} className="text-red-500 text-xs px-2 hover:text-red-400">حذف</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleAddItem('clients', 'items')} className="mt-4 w-full text-sm bg-green-600 px-3 py-2 rounded hover:bg-green-700">إضافة عميل</button>
                    </AdminSection>

                    {/* Contact Section */}
                    <AdminSection title="بيانات التواصل">
                        <InputField label="الهاتف" value={content.contact.phone} onChange={e => handleFieldChange('contact', 'phone', e.target.value)} />
                        <InputField label="البريد الإلكتروني" value={content.contact.email} onChange={e => handleFieldChange('contact', 'email', e.target.value)} />
                        <InputField label="العنوان" value={content.contact.address} onChange={e => handleFieldChange('contact', 'address', e.target.value)} />
                    </AdminSection>
                </div>

                <footer className="mt-10 pt-6 border-t border-gray-700">
                    <button onClick={handleSave} className="w-full bg-blue-600 py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition-colors">
                        حفظ جميع التغييرات
                    </button>
                </footer>
            </div>
        </div>
    );
};

// Helper components for dashboard UI
const AdminSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <section className="bg-[#242424] p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold border-b border-gray-600 pb-3 mb-6 text-amber-400">{title}</h2>
        <div className="space-y-4">{children}</div>
    </section>
);

const InputField: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input type="text" value={value} onChange={onChange} className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
    </div>
);
const TextareaField: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <textarea value={value} onChange={onChange} rows={4} className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
    </div>
);


export const AdminPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('isAdmin'));

    const handleLogin = (password: string) => {
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('isAdmin', 'true');
            setIsAuthenticated(true);
        } else {
            alert('كلمة المرور غير صحيحة');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isAdmin');
        setIsAuthenticated(false);
    };

    if (isAuthenticated) {
        return <AdminDashboard onLogout={handleLogout} />;
    }
    return <LoginPage onLogin={handleLogin} />;
};
