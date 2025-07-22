// components/RoleAssignment/RoleAssignmentForm.tsx

import { useEffect, useState } from "react";
import { assignRoleToUser, getAllRoles } from "../../services/roleService";
import type { Role } from "../../models/interfaces/Role";
import Form, { FormGroup, FormInput, FormSelect, FormLabel, FormActions } from '../common/Form';
import { useAlert } from '../../contexts/alertContext';
import { useAuth } from '../../contexts/authContext';
import PageTitle from "../common/PageTitle";
import Button from "../common/Button";

interface Props {
    onSuccess?: () => void;
}

const RoleAssignmentForm = ({ onSuccess }: Props) => {
    const { user } = useAuth();
    if (!user) return null;
    const { setAlert } = useAlert();

    const [roles, setRoles] = useState<Role[]>([]);
    const [roleId, setRoleId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getAllRoles();
                setRoles(response);
            } catch (err) {
                setAlert({
                    message: 'Failed to load roles.',
                    type: 'error',
                });
            }
        };
        fetchRoles();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id || roleId === null) {
            setAlert({
                message: 'Please select a role.',
                type: 'error',
            });
            return; // ❗important: exit early to avoid invalid call
        }

        setLoading(true);
        try {
            await assignRoleToUser({ userId: user.id, roleId });
            setAlert({
                message: 'Role assigned successfully',
                type: 'success',
            });
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setAlert({
                message: (err?.response?.data?.detail || "Assignment failed"),
                type: 'error',
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageTitle
                title="User"
            />
            <Form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
                <FormGroup className='grid gap-x-8 gap-y-6 sm:grid-cols-2'>
                    <div className='space-y-1'>
                        <FormLabel htmlFor="user-id">User ID</FormLabel>
                    </div>
                    <div>
                        <FormInput
                            id="user-id"
                            type="text"
                            value={user?.id || ""}
                            onChange={() => { }}
                            disabled
                        />
                    </div>
                </FormGroup>
                <FormGroup className='grid gap-x-8 gap-y-6 sm:grid-cols-2'>
                    <div className='space-y-1'>
                        <FormLabel htmlFor="role-id">Select Role</FormLabel>
                    </div>
                    <div>
                        <FormSelect
                            id="role-id"
                            value={roleId ?? ""}
                            onChange={(e) => {
                                const selected = e.target.value;
                                setRoleId(selected ? Number(selected) : null);
                            }}
                        >
                            <option value="" disabled>Select a role</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.display_name}
                                </option>
                            ))}
                        </FormSelect>
                    </div>
                </FormGroup>
                 <hr role="presentation" className="my-10 w-full border-t border-zinc-950/5 dark:border-white/5"></hr>
                <FormActions className='lg:static fixed bottom-0 left-0 right-0 p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Button
                        type="submit"
                        label={loading ? "Assigning..." : "Assign Role"}
                        onClick={() => { }} // Form submit will handle this
                        disabled={loading}
                        variant="primary"
                        className="md:w-auto"
                        fullWidth={true}
                    />
                </FormActions>
            </Form>
        </div>

    );
};

export default RoleAssignmentForm;
