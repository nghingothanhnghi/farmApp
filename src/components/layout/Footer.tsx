import React from 'react';
import { useNavigate } from 'react-router';
import { IconLogout, IconUserEdit } from '@tabler/icons-react';
import { DEFAULT_AVATAR } from '../../constants/constants';
import { useAuth } from '../../contexts/authContext';
import DropdownButton from '../common/DropdownButton';
import Button from '../common/Button';


const Footer: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    return (
        <footer className="flex justify-between items-center space-x-2 border-t border-zinc-950/5 p-4 dark:border-white/5">
            {user ? (
                <DropdownButton
                    className='w-full text-left bg-transparent'
                    label={
                        <>
                            <img
                                src={DEFAULT_AVATAR}
                                alt="Avatar"
                                className="h-8 w-8 rounded-full object-cover overflow-hidden"
                            />
                            <div className="w-32 overflow-hidden">
                                <span className="font-medium block truncate text-sm/5 text-zinc-950 dark:text-white">
                                    {user?.username || 'Unknown'}
                                </span>
                                <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                                    {user?.email || 'unknown@example.com'}
                                </span>
                            </div>
                        </>
                    }
                    items={[
                        { label: 'Edit Profile', value: 'edit-profile', icon: <IconUserEdit size={18} /> },
                        { label: <> Logout</>, value: 'Logout', icon: <IconLogout size={18} /> },
                    ]}
                    onSelect={(item) => {
                        if (item.value === 'Logout') {
                            logout();
                        } else if (item.value === 'edit-profile' && user?.id) {
                            navigate(`/edit-user/${user.id}`);
                        }
                    }}
                />

            ) : (
                <Button
                    type="button"
                    label="Sign Up"
                    onClick={() => navigate('/sign-up')}
                    variant="secondary"
                    fullWidth
                />
            )}
        </footer>
    );
};

export default Footer;
