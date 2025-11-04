import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Form,
  Input,
  DatePicker,
  Select,
  type FormInstance,
} from 'antd';

import { BaseEditSection } from '@shared/components/BaseEditSection';
import { PromotionCampaignStatusEnum } from '@shared/enums/PromotionCampaignStatusEnum';

interface Props {
  formRef?: React.RefObject<FormInstance | null>;
}

export const AddSection: React.FC<Props> = ({ formRef }: Props) => {
  const { t } = useTranslation();

  const [form] = Form.useForm();

  useEffect(() => {
    if (formRef) {
      (formRef as React.MutableRefObject<FormInstance | null>).current = form;
    }
  }, [form, formRef]);

  return (
    <BaseEditSection title={t('common.basicInformation')} showSaveButton={false}>
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
          initialValue={PromotionCampaignStatusEnum.DRAFT}
        >
          <Select
            size="large"
            style={{ width: '100%' }}
            disabled
            options={[
              { label: t('common.draft'), value: PromotionCampaignStatusEnum.DRAFT },
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
          />
        </Form.Item>
      </Form>
    </BaseEditSection>
  );
};

