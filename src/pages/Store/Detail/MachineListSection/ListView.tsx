import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  List,
  Select,
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
  useListControllerApi,
  type ListControllerResponse,
} from '@shared/hooks/useListControllerApi';
import {
  useActivateMachineApi,
  type ActivateMachineResponse,
} from '@shared/hooks/useActivateMachineApi';

import type { Machine } from '@shared/types/machine';
import { type Store } from '@shared/types/store';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

import { StartMachineDrawer } from '@shared/components/Drawer/StartMachineDrawer';
import { MachineSettingDrawer } from '@shared/components/Drawer/MachineSettingDrawer';

import { formatCurrencyCompact } from '@shared/utils/currency';

interface Props {
  store: Store;
}

export const ListView: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const [api, contextHolder] = notification.useNotification();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [isMachineSettingDrawerOpen, setIsMachineSettingDrawerOpen] = useState(false);
  const [isStartMachineDrawerOpen, setIsStartMachineDrawerOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [selectedControllerId, setSelectedControllerId] = useState<string | null>(null);

  const {
    data: listControllerData,
    loading: listControllerLoading,
    listController,
  } = useListControllerApi<ListControllerResponse>();
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
    if (!selectedControllerId) return;

    listMachine({
      controller_id: selectedControllerId as string,
      page,
      page_size: pageSize,
      order_by: 'name',
    });
  }

  useEffect(() => {
    handleListMachine();
  }, [selectedControllerId]);

  useEffect(() => {
    listController({
      store_id: store.id,
      page,
      page_size: pageSize,
    });
  }, [store]);

  useEffect(() => {
    if (listControllerData) {
      setSelectedControllerId(listControllerData.data[0].id);
    }
  }, [listControllerData]);

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
    <BaseDetailSection title={t('common.machines')} onRefresh={handleListMachine}>
      {contextHolder}

      <Flex justify="end" align="center" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
        <Select
          options={listControllerData?.data.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          value={selectedControllerId}
          onChange={(value) => setSelectedControllerId(value)}
          style={{ width: 240 }}
          loading={listControllerLoading}
          placeholder={t('common.selectController')}
        />
      </Flex>

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

              <Flex justify="space-between" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                <Typography.Text strong style={{ color: theme.custom.colors.success.default }}>
                  {formatCurrencyCompact(item.base_price)}
                </Typography.Text>

                <Flex gap={theme.custom.spacing.small}>
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
            </Flex>
          </List.Item>
        )}
      />

      {selectedMachine && (
        <StartMachineDrawer
          key={`start-${selectedMachine.id}`}
          machine={selectedMachine}
          isDrawerOpen={isStartMachineDrawerOpen}
          setIsDrawerOpen={setIsStartMachineDrawerOpen}
          onStartSuccess={() => {
            setSelectedMachine(null);
            handleListMachine();
          }}
        />
      )}

      {selectedMachine && (
        <MachineSettingDrawer
          key={`config-${selectedMachine.id}`}
          machine={selectedMachine}
          isDrawerOpen={isMachineSettingDrawerOpen}
          setIsDrawerOpen={setIsMachineSettingDrawerOpen}
          onSave={() => {
            setSelectedMachine(null);
            handleListMachine();
          }}
        />
      )}
    </BaseDetailSection>
  );
};
