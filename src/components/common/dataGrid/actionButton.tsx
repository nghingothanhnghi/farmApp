import React from 'react';
import type { ActionButtonsProps } from '../../../models/interfaces/DataGrid';
import { IconPencil, IconPrinter, IconShare, IconTrash, IconEye } from '@tabler/icons-react';
import Button from '../Button';

const ActionButtons: React.FC<ActionButtonsProps> = ({ row, onView, onPrint, onShare, onEdit, onDelete }) => {
    return (
        <div className="flex gap-2 items-center justify-center h-full">
            {onView && (
                <Button
                    icon={
                        <IconEye size={16} stroke={1.5}/>
                    }
                    iconOnly
                    variant="secondary"
                    onClick={() => onView(row)}
                    label="View"
                    size='xs'
                    rounded="full"
                    className='bg-transparent'
                />
            )}
            {onPrint && (
                <Button
                    icon={
                        <IconPrinter size={16} stroke={1.5}/>
                    }
                    iconOnly
                    variant="secondary"
                    onClick={() => onPrint(row)}
                    label="Print"
                    size='xs'
                    rounded="full"
                    className='bg-transparent'
                />
            )}
            {onShare && (
                <Button
                    icon={
                        <IconShare size={16} stroke={1.5}/>
                    }
                    iconOnly
                    variant="secondary"
                    onClick={() => onShare(row)}
                    label="Share"
                    size='xs'
                    rounded="full"
                    className='bg-transparent'
                />
            )}
            {/* Edit Button */}
            {onEdit && (
                <Button
                    icon={
                        <IconPencil size={16} stroke={1.5}/>
                    }
                    iconOnly
                    variant="secondary"
                    onClick={() => onEdit(row)}
                    label="Edit"
                    size='xs'
                    rounded="full"
                    className='bg-transparent'
                />
            )}
            {/* Delete Button */}
            {onDelete && (
                <Button
                    icon={
                        <IconTrash size={16} stroke={1.5}/>
                    }
                    iconOnly
                    variant="secondary"
                    onClick={() => onDelete(row)}
                    label="Delete"
                    size='xs'
                    rounded="full"
                    className='bg-transparent'
                />
            )}
        </div>
    );
};

export default ActionButtons;
