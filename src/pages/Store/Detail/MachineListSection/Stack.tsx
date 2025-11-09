import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Divider, Flex, Select, Typography, notification } from 'antd';

import {
  Refresh,
  Settings,
  Play,
} from '@solar-icons/react'

import { useTheme } from '@shared/theme/useTheme';

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

import { formatCurrencyCompact } from '@shared/utils/currency';

import { type Store } from '@shared/types/store';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';
import { BaseModal } from '@shared/components/BaseModal';
import LeftRightSection from '@shared/components/LeftRightSection';
import { Stack, StackCard } from '@shared/components/Stack';

import { MachineConfigModalContent } from './MachineConfigModalContent';
import { StartMachineModalContent } from './StartMachineModalContent';


interface Props {
  store: Store;
}

export const MachineListStackView: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStartMachineModalOpen, setIsStartMachineModalOpen] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<any | null>(null);
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
      page_size: pageSize
    });
  }

  useEffect(() => {
    if (listMachineData) {
      setDataSource(listMachineData.data.map((item) => ({
        id: item.id,
        relay_no: item.relay_no,
        name: item.name,
        machine_type: item.machine_type,
        base_price: item.base_price,
        status: item.status,
      })));
    }
  }, [listMachineData]);

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
    <BaseDetailSection title={t('common.machines')} >
      {contextHolder}

      <LeftRightSection
        left={(null)}
        right={(
          <>
            <Button
              onClick={() => handleListMachine()}
              icon={<Refresh />}
            />

            <Select
              options={listControllerData?.data.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              onChange={(value) => setSelectedControllerId(value)}
              style={{ width: 240 }}
              loading={listControllerLoading}
              placeholder={t('common.selectController')}
            />
          </>
        )}
        rightStyle={{ gap: theme.custom.spacing.small }}
      />

      <Stack
        data={dataSource}
        loading={listMachineLoading}
        initialDisplayCount={pageSize}
        hasMore={page < (listMachineData?.total_pages || 0)}
        onLoadMore={() => setPage(page + 1)}
        renderItem={(item) => (
          <StackCard>
            <StackCard.Header>
              <Typography.Link onClick={() => navigate(`/machines/${item.id}/detail`)} strong>
                {item.name || `${t('common.machine')} ${item.relay_no}`}
              </Typography.Link>
            </StackCard.Header>
            <StackCard.Content>
              <Flex justify="space-between" align="center" wrap="wrap" gap={theme.custom.spacing.xsmall}>
                <DynamicTag value={item.machine_type} />
                <DynamicTag value={item.status} />
              </Flex>

              <Typography.Text type="secondary">{t('common.basePrice')}: {formatCurrencyCompact(item.base_price)}</Typography.Text>
            </StackCard.Content>

            <Divider style={{ margin: 0 }} />

            <StackCard.Action>
              <Button
                type="text"
                icon={<Refresh />}
                onClick={() => {
                  activateMachine(item.id);
                }}
              />

              <Button
                type="text"
                icon={<Play weight="Bold" />}
                onClick={() => {
                  setIsStartMachineModalOpen(true);
                  setSelectedMachineId(item.id);
                  setSelectedMachine(item);;
                }}
                style={{
                  color: theme.custom.colors.success.default,
                }}
              />

              <Button
                type="text"
                icon={<Settings />}
                onClick={() => {
                  setIsModalOpen(true);
                  setSelectedMachineId(item.id);
                }}
              />
            </StackCard.Action>
          </StackCard>
        )}
      />

      {selectedMachineId && (
        <BaseModal
          key={`config-${selectedMachineId}`}
          closable={true}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedMachineId(null);
          }}
          maskClosable={true}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        >
          <MachineConfigModalContent
            key={`config-content-${selectedMachineId}`}
            machineId={selectedMachineId}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedMachineId(null);
            }}
            onSave={() => {
              setSelectedMachineId(null);
              listMachine({
                controller_id: selectedControllerId as string,
                page,
                page_size: pageSize
              });
            }}
          />
        </BaseModal>
      )}

      {selectedMachine && (
        <BaseModal
          key={`start-${selectedMachine.id}`}
          closable={true}
          onCancel={() => {
            setIsStartMachineModalOpen(false);
            setSelectedMachineId(null);
            setSelectedMachine(null);
          }}
          maskClosable={true}
          isModalOpen={isStartMachineModalOpen}
          setIsModalOpen={setIsStartMachineModalOpen}
        >
          <StartMachineModalContent
            key={`start-content-${selectedMachine.id}`}
            machine={selectedMachine}
            onClose={() => {
              setIsStartMachineModalOpen(false);
              setSelectedMachineId(null);
              setSelectedMachine(null);
            }}
            onSuccess={() => {
              setIsStartMachineModalOpen(false);
              setSelectedMachineId(null);
              setSelectedMachine(null);
              listMachine({
                controller_id: selectedControllerId as string,
                page,
                page_size: pageSize
              });
            }}
          />
        </BaseModal>
      )}
    </BaseDetailSection>
  );
};
