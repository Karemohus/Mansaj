
import React from 'react';
import { EditIcon } from './icons';

interface EditableTextProps {
  isAdmin: boolean;
  value: string;
  onChange: (newValue: string) => void;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  textarea?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({ isAdmin, value, onChange, as = 'p', className = '', textarea = false }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState(value);

  React.useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(currentValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !textarea) {
      handleBlur();
    }
  };

  const commonClasses = "relative group transition-all";
  const editIconClasses = "absolute -top-2 -start-2 w-5 h-5 text-white bg-blue-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer";

  if (isAdmin) {
    if (isEditing) {
      if (textarea) {
        return (
          <textarea
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={handleBlur}
            className={`${className} bg-white bg-opacity-20 border border-blue-400 rounded-md p-2 w-full min-h-[120px]`}
            autoFocus
          />
        );
      }
      return (
        <input
          type="text"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`${className} bg-white bg-opacity-20 border border-blue-400 rounded-md`}
          autoFocus
        />
      );
    }
    
    const Tag = as;
    return (
      <Tag className={`${className} ${commonClasses}`} onClick={() => setIsEditing(true)}>
        {value}
        <EditIcon className={editIconClasses} />
      </Tag>
    );
  }

  const Tag = as;
  return <Tag className={className}>{value}</Tag>;
};


interface EditableImageProps {
  isAdmin: boolean;
  src: string;
  alt: string;
  onChange: (newSrc: string) => void;
  className?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({ isAdmin, src, alt, onChange, className = '' }) => {
    const handleClick = () => {
        if (!isAdmin) return;
        const newUrl = prompt("أدخل رابط الصورة الجديد:", src);
        if (newUrl && newUrl.trim() !== '') {
            onChange(newUrl);
        }
    };

    return (
        <div className={`relative group ${className} overflow-hidden`}>
            <img src={src} alt={alt} className="w-full h-full object-cover" />
            {isAdmin && (
                <div onClick={handleClick} className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all cursor-pointer">
                    <EditIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}
        </div>
    );
};
