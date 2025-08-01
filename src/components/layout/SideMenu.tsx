// src/components/layout/SideMenu.tsx
import { IconDeviceMobileCheck, IconCamera, IconBrain, IconPlant, IconUserShield, IconCalendarCheck, IconAnalyze } from '@tabler/icons-react';
import ListLink from '../common/ListLink';
import { APP_NAME } from '../../config/constants';
import Header from './Header';
import Footer from './Footer';

interface SideMenuProps {
    open?: boolean;
    onClose?: () => void;
}
export default function SideMenu({ open = false, onClose }: SideMenuProps) {
    // Only close on mobile
    const handleLinkClick = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            onClose?.();
        }
    };
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
                    transition-all duration-300 ease-in-out
                    transform opacity-100
                    ${open ? 'translate-x-0 opacity-100 will-change-[transform,opacity]' : 'lg:-translate-x-64 -translate-x-full opacity-0 pointer-events-none'}

                `}
            >
                <div className='flex h-full min-h-0 flex-col'>
                    <Header appName={APP_NAME} onClose={onClose} />
                    <div className="flex flex-1 flex-col overflow-y-auto p-4 space-y-0.5">
                        <ListLink to="/scheduler-health" onClick={handleLinkClick} icon={<IconCalendarCheck size={16} />} label="Scheduler Health" />
                        <ListLink to="/" onClick={handleLinkClick} icon={<IconDeviceMobileCheck size={16} />} label="Device Controller" />
                        <ListLink to="/ar-detection" onClick={handleLinkClick} icon={<IconCamera size={16} />} label="AR Object Detection" />
                        <ListLink to="/model-training" onClick={handleLinkClick} icon={<IconBrain size={16} />} label="Train YOLOv8 Model" />
                        <ListLink to="/hydroponic-system" onClick={handleLinkClick} icon={<IconPlant size={16} />} label="Hydroponic System" />
                        <ListLink to="/users" onClick={handleLinkClick} icon={<IconUserShield size={16} />} label="Users" />
                        <ListLink to="/migrate" onClick={handleLinkClick} icon={<IconAnalyze size={16} />} label="Data Migration" />
                    </div>
                    <Footer />
                </div>
            </aside>
        </>

    );
}
