import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  title,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-success" />,
    error: <XCircle className="w-6 h-6 text-error" />,
    info: <Info className="w-6 h-6 text-info" />,
    warning: <AlertCircle className="w-6 h-6 text-warning" />,
  };

  const colors = {
    success: 'bg-success bg-opacity-10 border-success',
    error: 'bg-error bg-opacity-10 border-error',
    info: 'bg-info bg-opacity-10 border-info',
    warning: 'bg-warning bg-opacity-10 border-warning',
  };

  const defaultTitles = {
    success: 'Success',
    error: 'Error',
    info: 'Information',
    warning: 'Warning',
  };

  return (
    <div className={`alert shadow-lg ${colors[type]}`}>
      <div className="flex items-start">
        <div className="mr-3">{icons[type]}</div>
        <div>
          {title && <h3 className="font-bold">{title}</h3>}
          {!title && <h3 className="font-bold">{defaultTitles[type]}</h3>}
          <div className="text-sm">{message}</div>
        </div>
      </div>
      <button onClick={handleClose} className="btn btn-ghost btn-sm">
        <X size={16} />
      </button>
    </div>
  );
};

export default Notification;