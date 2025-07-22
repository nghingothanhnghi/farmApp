// src/components/Settings/components/AccountTab.tsx

import React, { useState } from 'react';
import { FormGroup, FormLabel, FormInput } from '../../common/Form';

const AccountTab: React.FC = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
    });

    const [password, setPassword] = useState('');

    const handleUserChange = (field: 'username' | 'email', value: string) => {
        setUser((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-7">Account Settings</h3>
            <FormGroup className='grid gap-x-8 gap-y-6 sm:grid-cols-2'>
                <div className='space-y-1'>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <p className="text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400"></p>
                </div>
                <div>
                    <FormInput
                        type="text"
                        id="username"
                        value={user.username}
                        onChange={(e) => handleUserChange('username', e.target.value)}
                        required
                        disabled
                    />
                </div>
            </FormGroup>
            <hr role="presentation" className="my-5 w-full border-t border-zinc-950/5 dark:border-white/5"></hr>
            <FormGroup className='grid gap-x-8 gap-y-6 sm:grid-cols-2'>
                <div className='space-y-1'>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <p className="text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400"></p>
                </div>
                <div>
                    <FormInput
                        type="text"
                        id="email"
                        value={user.email}
                        onChange={(e) => handleUserChange('email', e.target.value)}
                        required
                        disabled
                    />
                </div>
            </FormGroup>
            <hr role="presentation" className="my-5 w-full border-t border-zinc-950/5 dark:border-white/5"></hr>
            <FormGroup className='grid gap-x-8 gap-y-6 sm:grid-cols-2'>
                <div className='space-y-1'>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <p className="text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400"></p>
                </div>
                <div>
                    <FormInput
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled
                    />
                </div>
            </FormGroup>
        </div>
    );
};

export default AccountTab;
