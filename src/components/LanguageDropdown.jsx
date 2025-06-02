import React, { useState, useRef, useEffect } from 'react';
import 'flag-icon-css/css/flag-icon.min.css';

const LanguageDropdown = ({ currentLang, onChange }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const languages = [
        { code: 'en', label: 'EN', flagClass: 'flag-icon-gb' },
        { code: 'fr', label: 'FR', flagClass: 'flag-icon-fr' },
    ];

    const currentLanguage = languages.find((l) => l.code === currentLang) || languages[0];

    return (
        <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block', marginLeft: '15px' }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    background: '#fff',
                    border: '1px solid #75529e',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    padding: '8px 16px',
                    height: '40px',
                    boxSizing: 'border-box',
                    color: '#6d33a7',
                    transition: 'all 0.3s ease',
                    ':hover': {
                        backgroundColor: '#6d33a7',
                        color: 'white',
                    }
                }}
            >
                <span className={`flag-icon ${currentLanguage.flagClass}`} />
                <span>{currentLanguage.label}</span>
                <span style={{ fontSize: '12px', marginLeft: '4px' }}>{open ? '▲' : '▼'}</span>
            </button>

            {open && (
                <ul
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        margin: '4px 0 0 0',
                        padding: 0,
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        listStyle: 'none',
                        zIndex: 1000,
                        minWidth: '100%',
                        overflow: 'hidden',
                    }}
                    role="listbox"
                >
                    {languages.map(({ code, label, flagClass }) => (
                        <li
                            key={code}
                            onClick={() => {
                                onChange(code);
                                setOpen(false);
                            }}
                            style={{
                                padding: '8px 16px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: code === currentLang ? '#f5f5f5' : 'transparent',
                                color: code === currentLang ? '#6d33a7' : '#333',
                                ':hover': {
                                    backgroundColor: '#f0f0f0',
                                    color: '#6d33a7',
                                }
                            }}
                            tabIndex={0}
                            role="option"
                            aria-selected={code === currentLang}
                        >
                            <span className={`flag-icon ${flagClass}`} />
                            {label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LanguageDropdown;