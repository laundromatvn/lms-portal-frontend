import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Form, Input, Select, InputNumber, Typography, notification, Skeleton, Button } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { useGetMachineApi, type GetMachineResponse } from '@shared/hooks/useGetMachineApi';

import { MachineTypeEnum } from '@shared/enums/MachineTypeEnum';

import { Box } from '@shared/components/Box';
import { useUpdateMachineApi, type UpdateMachineResponse } from '@shared/hooks/useUpdateMachineApi';
import { MachineStatusEnum } from '@shared/enums/MachineStatusEnum';

interface Props {
  machineId: string;
  onSave?: () => void;
  onClose?: () => void;
}

export const MachineConfigModalContent: React.FC<Props> = ({ machineId, onSave, onClose }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

  const {
    getMachine,
    data: machineData,
    loading: machineLoading,
    error: machineError,
  } = useGetMachineApi<GetMachineResponse>();

  const {
    updateMachine,
    data: updateMachineData,
    loading: updateMachineLoading,
    error: updateMachineError,
  } = useUpdateMachineApi<UpdateMachineResponse>();

  const handleSave = async () => {
    await updateMachine(machineId, form.getFieldsValue())
    onSave?.();
    onClose?.();
  }

  useEffect(() => {
    if (machineId) {
      getMachine(machineId);
    }
  }, [machineId]);

  // Reset form when machineId changes
  useEffect(() => {
    form.resetFields();
  }, [machineId, form]);

  useEffect(() => {
    if (machineError) {
      api.error({
        message: t('machine.getMachineError'),
      });
    }
  }, [machineError]);

  useEffect(() => {
    if (updateMachineError) {
      api.error({
        message: t('machine.updateMachineError'),
      });
    }
  }, [updateMachineError]);

  useEffect(() => {
    if (updateMachineData) {
      api.success({
        message: t('machine.updateMachineSuccess'),
      });
    }
  }, [updateMachineData]);

  useEffect(() => {
    if (machineData) {
      form.setFieldsValue({
        machine_id: machineData.id,
        name: machineData.name,
        machine_type: machineData.machine_type,
        base_price: machineData.base_price,
        status: machineData.status,
        pulse_duration: machineData.pulse_duration,
        coin_value: machineData.coin_value,
      });
    }
  }, [machineData]);

  return (
    <Flex
      vertical
      gap={theme.custom.spacing.medium}
      justify="space-between"
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        paddingRight: theme.custom.spacing.medium,
      }}
    >
      <Typography.Title level={3}>Machine Config {machineId}</Typography.Title>

      {contextHolder}

      {machineLoading && <Skeleton active />}

      {!machineLoading && machineData && (
        <Box
          vertical
          gap={theme.custom.spacing.medium}
          style={{ width: '100%', height: '100%', overflowY: 'auto' }}
        >
          <Form form={form} layout="vertical" style={{ width: '100%' }}>
            <Form.Item
              label={t('common.machineId')}
              name="machine_id"
              rules={[{ required: true, message: t('machine.machineIdRequired') }]}
            >
              <Input size="large" defaultValue={machineId} disabled />
            </Form.Item>

            <Form.Item
              label={t('common.status')}
              name="status"
              rules={[{ required: true, message: t('machine.statusRequired') }]}
            >
              <Select
                size="large"
                disabled
                options={[
                  { label: 'Pending Setup', value: MachineStatusEnum.PENDING_SETUP },
                  { label: 'Idle', value: MachineStatusEnum.IDLE },
                  { label: 'Starting', value: MachineStatusEnum.STARTING },
                  { label: 'Busy', value: MachineStatusEnum.BUSY },
                  { label: 'Out of Service', value: MachineStatusEnum.OUT_OF_SERVICE },
                ]}
              />
            </Form.Item>

            <Form.Item label={t('common.name')} name="name">
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label={t('common.machineType')}
              name="machine_type"
              rules={[{ required: true, message: t('machine.machineTypeRequired') }]}
            >
              <Select
                size="large"
                options={[
                  { label: MachineTypeEnum.WASHER, value: MachineTypeEnum.WASHER },
                  { label: MachineTypeEnum.DRYER, value: MachineTypeEnum.DRYER },
                ]}
              />
            </Form.Item>

            <Form.Item
              label={t('common.basePrice')}
              name="base_price"
              rules={[
                { required: true, message: t('machine.basePriceRequired') },
                {
                  validator: (_, value) => {
                    if (value < 0) {
                      return Promise.reject(new Error(t('machine.basePriceMustBeGreaterThanZero')));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <InputNumber size="large" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label={t('common.pulseDuration')}
              name="pulse_duration"
              rules={[{ required: true, message: t('machine.pulseDurationRequired') }]}
            >
              <InputNumber size="large" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label={t('common.coinValue')}
              name="coin_value"
              rules={[{ required: true, message: t('machine.coinValueRequired') }]}
            >
              <InputNumber size="large" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item style={{ width: '100%', textAlign: 'right' }}>
              <Button
                type="primary"
                size="large"
                onClick={handleSave}
                loading={updateMachineLoading}
              >
                {t('common.save')}
              </Button>
            </Form.Item>
          </Form>
        </Box>
      )}
    </Flex>
  );
};
