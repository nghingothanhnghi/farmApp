import React, { isValidElement, cloneElement } from 'react';
import type { ReactElement, ReactNode } from 'react';

interface ButtonGroupProps {
  children: ReactNode;
  vertical?: boolean;
  className?: string;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  vertical = false,
  className = '',
}) => {
  const childArray = React.Children.toArray(children).filter(isValidElement) as ReactElement<any>[];

  const total = childArray.length;
  const layoutClass = vertical ? 'flex-col' : 'flex-row';

  const modifiedChildren = childArray.map((child, index) => {
    let roundedClass = '';

    if (total === 1) {
      roundedClass = 'rounded-lg';
    } else if (index === 0) {
      roundedClass = vertical ? 'rounded-t-lg' : 'rounded-l-lg';
    } else if (index === total - 1) {
      roundedClass = vertical ? 'rounded-b-lg' : 'rounded-r-lg';
    } else {
      roundedClass = 'rounded-none';
    }

    const childClassName = child.props.className || '';

    return cloneElement(child, {
      className: `${childClassName} ${roundedClass}`.trim(),
    });
  });

  return (
    <div className={`inline-flex ${layoutClass} ${className}`}>
      {modifiedChildren}
    </div>
  );
};

export default ButtonGroup;
