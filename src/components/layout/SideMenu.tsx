// src/components/layout/SideMenu.tsx
import { IconDeviceMobileCheck, IconCamera, IconBrain, IconPlant, IconUserShield } from '@tabler/icons-react';
import ListLink from '../common/ListLink';
import { APP_NAME } from '../../config/constants';
import Header from './Header';
import Footer from './Footer';

interface SideMenuProps {
    open?: boolean;
    onClose?: () => void;
}
export default function SideMenu({ open = false, onClose }: SideMenuProps) {
    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 lg:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            <aside
                className={`
                    fixed inset-y-0 left-0 z-30 w-64
                    bg-white dark:bg-zinc-900 lg:bg-transparent lg:dark:bg-transparent
                    transition-transform duration-300
                    lg:translate-x-0
                    max-lg:transform max-lg:transition-transform
                    ${open ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className='flex h-full min-h-0 flex-col'>
                    <Header appName={APP_NAME} onClose={onClose}/>
                    <div className="flex flex-1 flex-col overflow-y-auto p-4">
                        <ListLink to="/" onClick={onClose} icon={<IconDeviceMobileCheck size={16} />} label="Device Controller" />
                        <ListLink to="/ar-detection" onClick={onClose} icon={<IconCamera size={16} />} label="AR Object Detection" />
                        <ListLink to="/model-training" onClick={onClose} icon={<IconBrain size={16} />} label="Train YOLOv8 Model" />
                        <ListLink to="/hydroponic-system" onClick={onClose} icon={<IconPlant size={16} />} label="Hydroponic System" />
                        <ListLink to="/users" onClick={onClose} icon={<IconUserShield size={16} />} label="Users" />
                    </div>
                    <Footer />
                </div>
            </aside>
        </>

    );
}
