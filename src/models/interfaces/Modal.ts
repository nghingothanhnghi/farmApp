// src/models/interfaces/Modal.ts
// Define the props for the Modal component
import type { ReactNode } from 'react';
import type { ModalSize, ModalPosition, ModalVariant } from '../types/ModalType';

export interface ModalProps {
    isOpen: boolean;               // Whether the modal is open or not
    onClose: () => void;           // Function to close the modal
    title?: ReactNode;                // Modal title
    content: ReactNode;            // Content inside the modal (can be anything like text, form, etc.)
    actions?: ReactNode;            // Actions (buttons) that will be displayed in the footer
    size?: ModalSize;
    fullWidth?: boolean;
    fullHeight?: boolean;
    position?: ModalPosition;
    variant?: ModalVariant;
    showCloseButton?: boolean;
    sidebarTabs?: {
        id: string;
        label: string | ReactNode;
        icon?: ReactNode;
    }[];
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
}