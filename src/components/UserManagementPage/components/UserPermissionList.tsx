import React, { useMemo } from "react";
import Badge from "../../common/Badge";
import MultiSelectDropdown from "../../common/MultiSelectDropdown";
import { IconShieldCheck, IconBan } from '@tabler/icons-react';

interface UserPermissionProps {
    permissions?: string[];
    isActive?: boolean;
    useDropdown?: boolean;
}

const UserPermissionList: React.FC<UserPermissionProps> = ({
    permissions = [],
    isActive = true,
    useDropdown = true
}) => {

    const options = useMemo(() => {
        return permissions.map((perm) => ({
            label: perm.replace(/_/g, ' '),
            value: perm,
            disabled: !isActive,
            checked: true,
        }));
    }, [permissions, isActive]);

    if (!permissions.length) {
        return <p className="text-sm text-gray-400 italic">No permissions</p>;
    }

    // ✨ Use dropdown for better UX
    if (useDropdown || permissions.length > 3) {
        return (
            <div className="mt-2">
                <MultiSelectDropdown
                    size="xs"
                    options={options}
                    title={`Permissions (${permissions.length})`}
                    disabled={!isActive}
                    onChange={(selectedPermissions) => {
                        console.log("Selected permissions:", selectedPermissions);
                        // You could call a save function or update local state here
                    }}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {permissions.map((perm, idx) => (
                <Badge
                    key={idx}
                    variant={isActive ? "gray" : "secondary"}
                    className={`text-xs flex items-center gap-1 ${!isActive ? "opacity-50 line-through" : ""
                        }`}
                >
                    {isActive ? <IconShieldCheck size={14} /> : <IconBan size={14} />}
                    {perm.replace(/_/g, ' ')}
                </Badge>
            ))}
        </div>
    );
};

export default UserPermissionList;
