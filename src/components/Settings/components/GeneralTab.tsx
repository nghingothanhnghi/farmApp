// src/components/Settings/components/GeneralTab.tsx

import React, { useState, useEffect } from 'react';
import { FormGroup, FormLabel, FormSelect } from '../../common/Form';


const GeneralTab: React.FC = () => {
    const [language, setLanguage] = useState('en');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const applyTheme = (value: string) => {
        const root = document.documentElement;
        if (value === 'dark') {
            root.classList.add('dark');
        } else if (value === 'light') {
            root.classList.remove('dark');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.toggle('dark', prefersDark);
        }
        localStorage.setItem('theme', value);
    };
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-7">General Settings</h3>
            <FormGroup className='grid gap-x-8 gap-y-6 sm:grid-cols-2'>
                <div className='space-y-1'>
                    <FormLabel htmlFor="language">Language</FormLabel>
                    <p className="text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400"></p>
                </div>
                <div>
                    <FormSelect
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="en">English</option>
                        <option value="vi">Vietnamese</option>
                    </FormSelect>
                </div>
            </FormGroup>
            <hr role="presentation" className="my-5 w-full border-t border-zinc-950/5 dark:border-white/5"></hr>
            <FormGroup className='grid gap-x-8 gap-y-6 sm:grid-cols-2'>
                <div className='space-y-1'>
                    <FormLabel htmlFor="theme">Theme</FormLabel>
                    <p className="text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400"></p>
                </div>
                <div>
                    <FormSelect
                        id="theme"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                       
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
                    </FormSelect>
                </div>
            </FormGroup>
        </div>
    );
};

export default GeneralTab;
