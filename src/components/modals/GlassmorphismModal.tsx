import React, { ReactNode, CSSProperties } from 'react';

interface GlassmorphismModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  width?: number;
  children: ReactNode;
  footer?: ReactNode;
  zIndex?: number;
}

const styles = {
  modalBackdrop: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    zIndex: 999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px) saturate(1.5)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.3)',
    borderRadius: '12px',
    padding: 0,
    overflow: 'hidden',
    maxHeight: '95vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  modalHeader: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    color: 'rgba(0, 0, 0, 0.85)',
  },
  modalBody: {
    padding: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    overflowY: 'auto' as const,
    flex: 1,
    minHeight: 0,
  },
  modalFooter: {
    borderTop: '1px solid rgba(255, 255, 255, 0.5)',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    flexShrink: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    color: 'rgba(0, 0, 0, 0.6)',
    padding: 0,
    transition: 'color 0.2s ease',
  },
};

const GlassmorphismModal: React.FC<GlassmorphismModalProps> = ({
  open,
  onClose,
  title,
  width = 500,
  children,
  footer,
  zIndex = 1000,
}) => {
  // 防止背景滚动
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const containerStyle: CSSProperties = {
    ...styles.modalContainer,
    width: width,
  };

  const backdropStyle: CSSProperties = {
    ...styles.modalBackdrop,
    zIndex: zIndex,
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div
        style={containerStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <div>{title}</div>
          <button
            onClick={onClose}
            style={styles.closeButton}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div style={styles.modalBody}>{children}</div>
        {footer && <div style={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
};

export default GlassmorphismModal;
