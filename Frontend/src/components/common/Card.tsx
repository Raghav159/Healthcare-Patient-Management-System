import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  actions?: ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  actions,
}) => {
  return (
    <div className={`card bg-base-100 shadow-md ${className}`}>
      {(title || actions) && (
        <div className="card-title p-4 pb-0 flex justify-between items-center">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Card;