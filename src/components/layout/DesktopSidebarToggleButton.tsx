import React from 'react';
import { IconLayoutSidebarFilled, IconDeviceMobileCheck, IconCamera, IconBrain, IconPlant, IconUserShield, IconCalendarCheck } from '@tabler/icons-react';
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
    return (
        <div className={`hidden lg:flex lg:flex-col absolute top-4 left-4 z-20 bg-transparent h-full min-h-0 ${className}`}>
            <Button
                variant="secondary"
                icon={<IconLayoutSidebarFilled size={18} />}
                iconOnly
                label="Close"
                className={`bg-transparent mb-8`}
                onClick={onClick}
            />
            <div className="flex flex-1 flex-col overflow-y-auto space-y-2">
                <ListLink to="/" icon={<IconDeviceMobileCheck size={16} />} label="Device Controller" iconOnlyMode={true} />
                <ListLink to="/ar-detection" icon={<IconCamera size={16} />} label="AR Detection" iconOnlyMode={true} />
                <ListLink to="/model-training" icon={<IconBrain size={16} />} label="Model Training" iconOnlyMode={true} />
                <ListLink to="/hydroponic-system" icon={<IconPlant size={16} />} label="Hydroponics" iconOnlyMode={true} />
                <ListLink to="/users" icon={<IconUserShield size={16} />} label="User Management" iconOnlyMode={true} />
                <ListLink to="/scheduler-health" icon={<IconCalendarCheck size={16} />} label="Health Schedule" iconOnlyMode={true} />
            </div>
        </div>
    );
};

export default DesktopSidebarToggleButton;
