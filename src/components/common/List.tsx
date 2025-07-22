import React from 'react';
import type { IListItem } from '../../models/interfaces/IListItem';
import type { ListType } from '../../models/types/ListType';

interface ListProps {
  items: IListItem[];
  showIcons?: boolean;
  listStyle?: ListType;
  className?: string;
}

const List: React.FC<ListProps> = ({
  items,
  showIcons = false,
  listStyle = 'disc',
  className = '',
}) => {
  const listClass =
    listStyle === 'disc'
      ? 'list-disc list-inside'
      : listStyle === 'none'
      ? 'list-none'
      : '';

  return (
    <ul className={`${listClass} ${className}`}>
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-2 mb-1">
          {showIcons && item.icon && <span className="mt-1">{item.icon}</span>}
          <div>{item.content}</div>
        </li>
      ))}
    </ul>
  );
};

export default List;
