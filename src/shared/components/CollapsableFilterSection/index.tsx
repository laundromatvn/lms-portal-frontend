import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Modal, Flex } from 'antd';

import { SliderHorizontal } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

interface Props {
  children: React.ReactNode;
  onFilter?: () => void;
  isOpen?: boolean;
}

export interface CollapsableFilterSectionRef {
  open: () => void;
  close: () => void;
}

export const CollapsableFilterSection = forwardRef<CollapsableFilterSectionRef, Props>(
  ({ children, onFilter, isOpen: controlledIsOpen }, ref) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    // Use controlled or internal state
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const setIsOpen = controlledIsOpen !== undefined 
      ? () => {} // Controlled mode - state managed externally
      : setInternalIsOpen;

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    const handleOpen = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    const handleFilter = () => {
      if (onFilter) {
        onFilter();
      }
      handleClose();
    };

    // Desktop view: render children directly
    if (!isMobile) {
      return <>{children}</>;
    }

    // Mobile view: show button that opens modal
    return (
      <>
        <Button
          icon={<SliderHorizontal />}
          onClick={handleOpen}
        >
          {t('common.filter')}
        </Button>
        <Modal
          open={isOpen}
          onCancel={handleClose}
          title={t('common.filter')}
          footer={(
            <Flex justify="flex-end" gap={theme.custom.spacing.small}>
              <Button onClick={handleClose}>
                {t('common.cancel')}
              </Button>
              <Button type="primary" onClick={handleFilter}>
                {t('common.filter')}
              </Button>
            </Flex>
          )}
          width="90%"
          style={{ maxWidth: 500 }}
        >
          <Flex 
            vertical 
            gap={theme.custom.spacing.medium} 
            style={{ width: '100%' }}
          >
            {React.Children.map(children, (child, index) => (
              <div key={index} style={{ width: '100%' }}>
                {child}
              </div>
            ))}
          </Flex>
        </Modal>
      </>
    );
  }
);

CollapsableFilterSection.displayName = 'CollapsableFilterSection';

