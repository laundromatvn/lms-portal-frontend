import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import {
  Form,
  Input,
  DatePicker,
  Select,
  type FormInstance,
} from 'antd';

import { type PromotionCampaign } from '@shared/types/promotion/PromotionCampaign';

import { BaseEditSection } from '@shared/components/BaseEditSection';
import { PromotionCampaignStatusEnum } from '@shared/enums/PromotionCampaignStatusEnum';

interface Props {
  promotionCampaign: PromotionCampaign;
  onSave: (form: FormInstance) => void;
}

export const EditSection: React.FC<Props> = ({ promotionCampaign, onSave }: Props) => {
  const { t } = useTranslation();

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      id: promotionCampaign.id,
      name: promotionCampaign.name,
      description: promotionCampaign.description,
      status: promotionCampaign.status,
      start_time: promotionCampaign.start_time ? dayjs(promotionCampaign.start_time) : undefined,
      end_time: promotionCampaign.end_time ? dayjs(promotionCampaign.end_time) : undefined,
      conditions: promotionCampaign.conditions,
      rewards: promotionCampaign.rewards,
      limits: promotionCampaign.limits,
    });
  }, [promotionCampaign]);

  return (
    <BaseEditSection title={t('common.basicInformation')} onSave={() => onSave(form)}>
      <Form form={form} layout="vertical" style={{ width: '100%', maxWidth: 600 }}>
        <Form.Item
          label={t('common.name')}
          name="name"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.nameIsRequired') }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label={t('common.description')}
          name="description"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.descriptionIsRequired') }]}
        >
          <Input.TextArea size="large" />
        </Form.Item>

        <Form.Item
          label={t('common.status')}
          name="status"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.statusIsRequired') }]}
        >
          <Select
            size="large"
            style={{ width: '100%' }}
            options={[
              { label: t('common.draft'), value: PromotionCampaignStatusEnum.DRAFT },
              { label: t('common.scheduled'), value: PromotionCampaignStatusEnum.SCHEDULED },
              { label: t('common.active'), value: PromotionCampaignStatusEnum.ACTIVE },
              { label: t('common.paused'), value: PromotionCampaignStatusEnum.PAUSED },
              { label: t('common.inactive'), value: PromotionCampaignStatusEnum.INACTIVE },
              { label: t('common.finished'), value: PromotionCampaignStatusEnum.FINISHED },
            ]}
          />
        </Form.Item>

        <Form.Item
          label={t('common.startTime')}
          name="start_time"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.startTimeIsRequired') }]}
        >
          <DatePicker
            size="large"
            style={{ width: '100%' }}
            format="YYYY-MM-DD HH:mm:ss"
            showTime
            placeholder={t('common.selectStartDate')}
            disabledDate={(current) => current && current < dayjs().startOf('day')}
            disabledTime={(date) => {
              if (date && date.isSame(dayjs(), 'day')) {
                const now = dayjs();
                return {
                  disabledHours: () => {
                    const hours = [];
                    for (let i = 0; i < now.hour(); i++) {
                      hours.push(i);
                    }
                    return hours;
                  },
                  disabledMinutes: (selectedHour: number) => {
                    if (selectedHour === now.hour()) {
                      const minutes = [];
                      for (let i = 0; i <= now.minute(); i++) {
                        minutes.push(i);
                      }
                      return minutes;
                    }
                    return [];
                  },
                  disabledSeconds: (selectedHour: number, selectedMinute: number) => {
                    if (selectedHour === now.hour() && selectedMinute === now.minute()) {
                      const seconds = [];
                      for (let i = 0; i <= now.second(); i++) {
                        seconds.push(i);
                      }
                      return seconds;
                    }
                    return [];
                  },
                };
              }
              return {};
            }}
          />
        </Form.Item>

        <Form.Item
          label={t('common.endTime')}
          name="end_time"
          style={{ width: '100%' }}
        >
          <DatePicker
            size="large"
            style={{ width: '100%' }}
            format="YYYY-MM-DD HH:mm:ss"
            showTime
            placeholder={t('common.selectEndDate')}
            disabledDate={(current) => current && current < dayjs().startOf('day')}
            disabledTime={(date) => {
              if (date && date.isSame(dayjs(), 'day')) {
                const now = dayjs();
                return {
                  disabledHours: () => {
                    const hours = [];
                    for (let i = 0; i < now.hour(); i++) {
                      hours.push(i);
                    }
                    return hours;
                  },
                  disabledMinutes: (selectedHour: number) => {
                    if (selectedHour === now.hour()) {
                      const minutes = [];
                      for (let i = 0; i <= now.minute(); i++) {
                        minutes.push(i);
                      }
                      return minutes;
                    }
                    return [];
                  },
                  disabledSeconds: (selectedHour: number, selectedMinute: number) => {
                    if (selectedHour === now.hour() && selectedMinute === now.minute()) {
                      const seconds = [];
                      for (let i = 0; i <= now.second(); i++) {
                        seconds.push(i);
                      }
                      return seconds;
                    }
                    return [];
                  },
                };
              }
              return {};
            }}
          />
        </Form.Item>
      </Form>
    </BaseEditSection>
  );
};
