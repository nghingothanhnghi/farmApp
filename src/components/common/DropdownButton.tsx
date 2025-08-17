import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';

interface DropdownItem {
    label: React.ReactNode;
    value: string;
    icon?: React.ReactNode;
}

type DropdownDirection =
    | 'auto'
    | 'top'
    | 'top-left'
    | 'top-right'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right'
    | 'left'
    | 'right';
interface DropdownButtonProps {
    label: React.ReactNode;
    items: DropdownItem[];
    onSelect: (item: DropdownItem) => void;
    disabled?: boolean;
    className?: string;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    direction?: DropdownDirection;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
    label,
    items,
    onSelect,
    disabled = false,
    className = '',
    variant = 'secondary',
    size = 'md',
    direction = 'auto'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);
    // const [position, setPosition] = useState<'bottom' | 'top'>('bottom');
    const [position, setPosition] = useState<DropdownDirection>('bottom');

    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen((prev) => !prev);
            setFocusedIndex(-1);
        }
    };

    const handleSelect = (item: DropdownItem) => {
        onSelect(item);
        setIsOpen(false);
        setFocusedIndex(-1);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (
            containerRef.current &&
            !containerRef.current.contains(e.target as Node)
        ) {
            setIsOpen(false);
            setFocusedIndex(-1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!isOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedIndex((prev) => (prev + 1) % items.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
        } else if (e.key === 'Enter' && focusedIndex >= 0) {
            e.preventDefault();
            handleSelect(items[focusedIndex]);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsOpen(false);
            setFocusedIndex(-1);
        }
    };

    // Auto-position logic
    useEffect(() => {
        if (isOpen && containerRef.current && dropdownRef.current) {
            if (direction === 'auto') {
                const rect = containerRef.current.getBoundingClientRect();
                const dropdownHeight = dropdownRef.current.offsetHeight;
                const dropdownWidth = dropdownRef.current.offsetWidth;

                const spaceBelow = window.innerHeight - rect.bottom;
                const spaceAbove = rect.top;
                const spaceRight = window.innerWidth - rect.right;
                const spaceLeft = rect.left;

                // Pick vertical direction first
                if (spaceBelow >= dropdownHeight) {
                    // Enough space below → align left/right based on available space
                    if (spaceRight >= dropdownWidth / 2 && spaceLeft >= dropdownWidth / 2) {
                        setPosition('bottom');
                    } else if (spaceRight >= dropdownWidth) {
                        setPosition('bottom-left');
                    } else {
                        setPosition('bottom-right');
                    }
                } else if (spaceAbove >= dropdownHeight) {
                    // Enough space above
                    if (spaceRight >= dropdownWidth / 2 && spaceLeft >= dropdownWidth / 2) {
                        setPosition('top');
                    } else if (spaceRight >= dropdownWidth) {
                        setPosition('top-left');
                    } else {
                        setPosition('top-right');
                    }
                } else if (spaceRight >= dropdownWidth) {
                    setPosition('right');
                } else if (spaceLeft >= dropdownWidth) {
                    setPosition('left');
                } else {
                    setPosition('bottom'); // fallback
                }
            } else {
                setPosition(direction);
            }
        }
    }, [isOpen, direction]);


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <Button
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                className={className}
                variant={variant}
                size={size}
                rounded='lg'
                label=""
                icon={
                    <div className="flex items-center gap-2">
                        {label}
                        <svg
                            className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'
                                }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                }

            />
            {isOpen && (
                <ul
                    ref={dropdownRef}
                    //                     className={`absolute z-10 w-full min-w-[200px] bg-white border rounded shadow overflow-hidden
                    //     transition-all duration-200 ease-out
                    //     ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
                    //     ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'}
                    //     origin-top
                    //   `}
                    // className={`absolute z-10 min-w-[200px] bg-white border rounded shadow overflow-hidden
                    //     transition-all duration-200 ease-out
                    //     ${position === 'top' ? 'bottom-full mb-2' : ''}
                    //     ${position === 'bottom' ? 'top-full mt-2' : ''}
                    //     ${position === 'left' ? 'right-full mr-2 top-0' : ''}
                    //     ${position === 'right' ? 'left-full ml-2 top-0' : ''}
                    //     ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                    // `}
                    className={`absolute z-10 min-w-[200px] bg-white border rounded shadow overflow-hidden
                        transition-all duration-200 ease-out
                        ${position === 'top' ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' : ''}
                        ${position === 'top-left' ? 'bottom-full mb-2 left-0' : ''}
                        ${position === 'top-right' ? 'bottom-full mb-2 right-0' : ''}
                        ${position === 'bottom' ? 'top-full mt-2 left-1/2 -translate-x-1/2' : ''}
                        ${position === 'bottom-left' ? 'top-full mt-2 left-0' : ''}
                        ${position === 'bottom-right' ? 'top-full mt-2 right-0' : ''}
                        ${position === 'left' ? 'right-full mr-2 top-0' : ''}
                        ${position === 'right' ? 'left-full ml-2 top-0' : ''}
                        ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                    `}
                >
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className={`flex items-center px-4 py-2 cursor-pointer text-sm ${index === focusedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
                                }`}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setFocusedIndex(index)}
                            role="option"
                            aria-selected={focusedIndex === index}
                        >
                            {item.icon && <span className="flex-shrink-0 pr-3">{item.icon}</span>}
                            {item.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownButton;
