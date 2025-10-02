import React from 'react';

import { Modal, type ModalProps } from 'antd';

interface Props {
  children: React.ReactNode;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalStyles?: ModalProps['styles'];
  stylesContent?: React.CSSProperties;
  stylesBody?: React.CSSProperties;
}

export const BaseModal: React.FC<Props> = ({
  children,
  isModalOpen,
  setIsModalOpen,
  modalStyles,
  stylesContent,
  stylesBody,
}) => {
  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      closable={false}
      maskClosable={false}
      footer={null}
      width={1200}
      styles={{
        content: { height: 600, overflow: 'hidden', ...stylesContent },
        body: { height: '100%', ...stylesBody },
        ...modalStyles,
      }}
    >
      {children}
    </Modal>
  )
};
