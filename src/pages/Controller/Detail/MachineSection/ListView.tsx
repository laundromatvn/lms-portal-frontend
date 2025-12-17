import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  List,
  Typography,
  notification,
} from 'antd';

import {
  Refresh,
  Settings,
  Play,
} from '@solar-icons/react'

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import {
  useListMachineApi,
  type ListMachineResponse,
} from '@shared/hooks/useListMachineApi';
import {
  useActivateMachineApi,
  type ActivateMachineResponse,
} from '@shared/hooks/useActivateMachineApi';

import { formatCurrencyCompact } from '@shared/utils/currency';

import { type Controller } from '@shared/types/Controller';
import type { Machine } from '@shared/types/machine';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

import { StartMachineDrawer } from '@shared/components/Drawer/StartMachineDrawer';
import { MachineSettingDrawer } from '@shared/components/Drawer/MachineSettingDrawer';


interface Props {
  controller: Controller;
  onSuccess?: () => void;
}

export const ListView: React.FC<Props> = ({ controller }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const [api, contextHolder] = notification.useNotification();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isMachineSettingDrawerOpen, setIsMachineSettingDrawerOpen] = useState(false);
  const [isStartMachineDrawerOpen, setIsStartMachineDrawerOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const columns = [
    { title: t('common.relayNo'), dataIndex: 'relay_no', width: 48 },
    { title: t('common.name'), dataIndex: 'name' },
    { title: t('common.machineType'), dataIndex: 'machine_type', width: 128 },
    { title: t('common.basePrice'), dataIndex: 'base_price', width: 128 },
    { title: t('common.status'), dataIndex: 'status', render: (status: string) => <DynamicTag value={status} />, width: 128 },
    { title: t('common.actions'), dataIndex: 'actions', width: 256 },
  ];

  const {
    data: listMachineData,
    loading: listMachineLoading,
    listMachine,
  } = useListMachineApi<ListMachineResponse>();
  const {
    activateMachine,
    data: activateMachineData,
    loading: activateMachineLoading,
    error: activateMachineError,
  } = useActivateMachineApi<ActivateMachineResponse>();

  const handleListMachine = () => {
    if (!controller.id) return;

    listMachine({
      controller_id: controller.id,
      page,
      page_size: pageSize,
      order_by: 'name',
    });
  }

  useEffect(() => {
    handleListMachine();
  }, [controller]);

  useEffect(() => {
    if (activateMachineData) {
      api.success({
        message: t('messages.resetMachineSuccess'),
      });
      handleListMachine();
    }
  }, [activateMachineData]);

  useEffect(() => {
    if (activateMachineError) {
      api.error({
        message: t('messages.resetMachineError'),
      });
    }
  }, [activateMachineError]);

  return (
    <BaseDetailSection
      title={t('common.machines')}
      onRefresh={handleListMachine}
    >
      {contextHolder}

      <List
        dataSource={listMachineData?.data}
        loading={listMachineLoading}
        style={{ width: '100%' }}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: listMachineData?.total || 0,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          style: { marginTop: theme.custom.spacing.medium },
        }}
        renderItem={(item) => (
          <List.Item
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: theme.custom.spacing.small,
              width: '100%',
              padding: theme.custom.spacing.medium,
              marginBottom: theme.custom.spacing.medium,
              backgroundColor: theme.custom.colors.background.light,
              borderRadius: theme.custom.radius.medium,
              border: `1px solid ${theme.custom.colors.neutral[200]}`,
            }}
          >
            <Flex vertical gap={theme.custom.spacing.small} style={{ width: '100%' }}>
              <Flex justify="space-between" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                <Typography.Link onClick={() => navigate(`/machines/${item.id}/detail`)}>
                  {item.name || `${t('common.machine')} ${item.relay_no}`}
                </Typography.Link>
                <DynamicTag value={item.status} />
              </Flex>

              <Flex gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                <Typography.Text type="secondary">{item.machine_type}</Typography.Text>
                <Typography.Text type="secondary">|</Typography.Text>
                <Typography.Text type="secondary">{`${t('common.machine')} ${item.relay_no}`}</Typography.Text>
              </Flex>

              <Flex gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                <Typography.Text type="secondary">{`${t('common.pulseDuration')}: ${item.pulse_duration}`}</Typography.Text>
                <Typography.Text type="secondary">|</Typography.Text>
                <Typography.Text type="secondary">{`${t('common.pulseInterval')}: ${item.pulse_interval}`}</Typography.Text>
              </Flex>

              <Flex gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                <Typography.Text type="secondary">{`${t('common.basePrice')}: ${formatCurrencyCompact(item.base_price)}`}</Typography.Text>
                <Typography.Text type="secondary">|</Typography.Text>
                <Typography.Text type="secondary">{`${t('common.coinValue')}: ${item.coin_value}`}</Typography.Text>
              </Flex>

              <Flex justify="flex-end" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                {can('machine.start') && <Button
                  icon={<Play />}
                  onClick={() => {
                    setIsStartMachineDrawerOpen(true);
                    setSelectedMachine(item);
                  }}
                />}

                {can('machine.restart') && <Button
                  icon={<Refresh />}
                  onClick={() => {
                    activateMachine(item.id);
                    handleListMachine();
                  }}
                  loading={activateMachineLoading}
                />}

                {can('machine.update') && <Button
                  icon={<Settings />}
                  onClick={() => {
                    setIsMachineSettingDrawerOpen(true);
                    setSelectedMachine(item);
                  }}
                />}
              </Flex>
            </Flex>
          </List.Item>
        )}
      />

      {isMachineSettingDrawerOpen && (
        <MachineSettingDrawer
          key={`machine-setting-${selectedMachine?.id}`}
          machine={selectedMachine as Machine}
          isDrawerOpen={isMachineSettingDrawerOpen}
          setIsDrawerOpen={setIsMachineSettingDrawerOpen}
          onSave={() => {
            setSelectedMachine(null);
            handleListMachine();
          }}
        />
      )}

      {isStartMachineDrawerOpen && (
        <StartMachineDrawer
          key={`start-machine-${selectedMachine?.id}`}
          machine={selectedMachine as Machine}
          isDrawerOpen={isStartMachineDrawerOpen}
          setIsDrawerOpen={setIsStartMachineDrawerOpen}
          onStartSuccess={() => {
            setSelectedMachine(null);
            handleListMachine();
          }}
        />
      )}
    </BaseDetailSection>
  );
};
