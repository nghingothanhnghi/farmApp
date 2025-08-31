import React, { useState } from 'react';
import { IconLayoutSidebarLeftExpand, IconDeviceGamepad3, IconDeviceMobileCheck, IconCamera, IconBrain, IconPlant, IconUserShield, IconCalendarCheck, IconAnalyze, IconLogout, IconUserEdit } from '@tabler/icons-react';
import Button from '../common/Button';
import DropdownButton from '../common/DropdownButton';
import ListLink from '../common/ListLink';
import Avatar from '../common/Avatar';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/authContext';
interface DesktopSidebarToggleButtonProps {
    onClick: () => void;
    className?: string;
}

const DesktopSidebarToggleButton: React.FC<DesktopSidebarToggleButtonProps> = ({
    onClick,
    className = '',
}) => {
    const [hovered, setHovered] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    return (
        <div className={`hidden lg:flex lg:flex-col fixed top-0 left-4 z-20 bg-transparent h-full min-h-0 ${className}`}>
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
                rounded='full'
                label="Close"
                className={`bg-transparent mt-4`}
                onClick={onClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            />
            <div className="flex flex-1 flex-col overflow-y-auto space-y-0.5 pt-8 ">
                <ListLink to="/scheduler-health" icon={<IconCalendarCheck size={16} />} label="Health Schedule" iconOnlyMode={true} />
                <ListLink to="/" icon={<IconDeviceMobileCheck size={16} />} label="Device Controller" iconOnlyMode={true} />
                <ListLink to="/ar-detection" icon={<IconCamera size={16} />} label="AR Detection" iconOnlyMode={true} />
                <ListLink to="/model-training" icon={<IconBrain size={16} />} label="Model Training" iconOnlyMode={true} />
                <ListLink to="/hydroponic-system" icon={<IconPlant size={16} />} label="Hydroponics" iconOnlyMode={true} />
                <ListLink to="/users" icon={<IconUserShield size={16} />} label="User Management" iconOnlyMode={true} />
                <ListLink to="/migrate" icon={<IconAnalyze size={16} />} label="Data Migration" iconOnlyMode />
            </div>
            <div className='flex justify-between items-center space-x-2 pb-4'>
                {user ? (
                    <DropdownButton
                        className='w-full text-left bg-transparent'
                        iconOnly={true}
                        showArrow={false}
                        label={
                            <Avatar
                                imageUrl={user.image_url}
                                size={32}
                                rounded="full"
                            />
                        }
                        items={[
                            { label: 'Edit Profile', value: 'edit-profile', icon: <IconUserEdit size={18} /> },
                            { label: <> Logout</>, value: 'Logout', icon: <IconLogout size={18} /> },
                        ]}
                        onSelect={(item) => {
                            if (item.value === 'Logout') {
                                logout();
                            } else if (item.value === 'edit-profile' && user?.id) {
                                navigate(`/users/${user.id}/edit`);
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
                        rounded='lg'
                    />
                )}
            </div>
        </div>
    );
};

export default DesktopSidebarToggleButton;
