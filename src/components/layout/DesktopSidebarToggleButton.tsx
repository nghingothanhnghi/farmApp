import React, { useState } from 'react';
import { IconLayoutSidebarLeftExpand, IconDeviceGamepad3, IconDeviceMobileCheck, IconCamera, IconBrain, IconPlant, IconUserShield, IconCalendarCheck, IconAnalyze } from '@tabler/icons-react';
import Button from '../common/Button';
import ListLink from '../common/ListLink';
interface DesktopSidebarToggleButtonProps {
    onClick: () => void;
    className?: string;
}

const DesktopSidebarToggleButton: React.FC<DesktopSidebarToggleButtonProps> = ({
    onClick,
    className = '',
}) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div className={`hidden lg:flex lg:flex-col absolute top-4 left-4 z-20 bg-transparent h-full min-h-0 ${className}`}>
            <Button
                variant="secondary"
                icon={
                    <span className="transition-transform duration-300 ease-in-out">
                        {hovered ? (
                            <IconLayoutSidebarLeftExpand size={18} />
                        ) : (
                            <IconDeviceGamepad3 size={18} className="text-orange-600" />
                        )}
                    </span>
                }
                iconOnly
                label="Close"
                className={`bg-transparent mb-8`}
                onClick={onClick}
                     onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
            />
            <div className="flex flex-1 flex-col overflow-y-auto space-y-0.5">
                <ListLink to="/scheduler-health" icon={<IconCalendarCheck size={16} />} label="Health Schedule" iconOnlyMode={true} />
                <ListLink to="/" icon={<IconDeviceMobileCheck size={16} />} label="Device Controller" iconOnlyMode={true} />
                <ListLink to="/ar-detection" icon={<IconCamera size={16} />} label="AR Detection" iconOnlyMode={true} />
                <ListLink to="/model-training" icon={<IconBrain size={16} />} label="Model Training" iconOnlyMode={true} />
                <ListLink to="/hydroponic-system" icon={<IconPlant size={16} />} label="Hydroponics" iconOnlyMode={true} />
                <ListLink to="/users" icon={<IconUserShield size={16} />} label="User Management" iconOnlyMode={true} />  
                <ListLink to="/migrate" icon={<IconAnalyze size={16} />} label="Data Migration" iconOnlyMode />      
            </div>
        </div>
    );
};

export default DesktopSidebarToggleButton;
