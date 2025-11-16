import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Form, Button, notification, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Machine } from '@shared/types/machine';

import {
  useUpdateMachineApi,
  type UpdateMachineResponse,
} from '@shared/hooks/useUpdateMachineApi';

import { BaseModal } from '@shared/components/BaseModal';

import { EditBasicInformationSection } from './EditBasicInformationSection';
import { EditMachineConfigSection } from './EditMachineConfigSection';
import { EditPriceSection } from './EditPriceSection';

interface Props {
  machine: Machine;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: () => void;
}

export const MachineSettingModal: React.FC<Props> = ({
  machine,
  isModalOpen,
  setIsModalOpen,
  onSave,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

  const {
    updateMachine,
    data: updateMachineData,
    loading: updateMachineLoading,
    error: updateMachineError,
  } = useUpdateMachineApi<UpdateMachineResponse>();

  const handleUpdateMachine = async () => {
    await updateMachine(machine.id, form.getFieldsValue());
    onSave?.();
  }

  const handleOnChange = (values: any) => {
    const currentValues = form.getFieldsValue();
    form.setFieldsValue({ ...currentValues, ...values });
  }

  useEffect(() => {
    const initialValues = {
      name: machine.name,
      status: machine.status,
      machine_type: machine.machine_type,
      base_price: machine.base_price,
      coin_value: machine.coin_value,
      pulse_duration: machine.pulse_duration,
      pulse_interval: machine.pulse_interval,
    };
    form.setFieldsValue(initialValues);
  }, [machine, form]);

  useEffect(() => {
    if (!updateMachineData) return;

    setIsModalOpen(false);

    api.success({
      message: t('messages.updateMachineSuccess'),
    });
  }, [updateMachineData]);

  useEffect(() => {
    if (!updateMachineError) return;

    api.error({
      message: t('messages.updateMachineError'),
    });
  }, [updateMachineError]);

  return (
    <BaseModal
      maskClosable={true}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    >
      {contextHolder}

      <Flex
        vertical
        gap={theme.custom.spacing.medium}
        style={{ width: '100%', height: '100%' }}
      >
        <Typography.Text strong>{t('common.machineEdit')}</Typography.Text>

        <Flex
          vertical
          gap={theme.custom.spacing.medium}
          style={{
            width: '100%',
            height: '100%',
            overflowY: 'auto',
          }}
        >
          <EditBasicInformationSection
            form={form}
            onChange={handleOnChange}
          />

          <EditPriceSection
            form={form}
            onChange={handleOnChange}
          />

          <EditMachineConfigSection
            form={form}
            onChange={handleOnChange}
          />

        </Flex>

        <Flex justify="flex-end" gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <Button
            type="default"
            onClick={() => setIsModalOpen(false)}
          >
            {t('common.cancel')}
          </Button>

          <Button
            type="primary"
            onClick={handleUpdateMachine}
            loading={updateMachineLoading}
          >
            {t('common.update')}
          </Button>
        </Flex>
      </Flex>
    </BaseModal>
  );
};
