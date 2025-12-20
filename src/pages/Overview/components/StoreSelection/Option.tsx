import React, { useMemo, useState } from 'react';

import {
  Flex,
  Typography,
} from 'antd';

import {
  AltArrowRight,
  Buildings2,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { Store } from '@shared/types/store';

import { Box } from '@shared/components/Box';

interface Props {
  store: Store;
  onSelect: () => void;
  style?: React.CSSProperties;
}

export const StoreSelectionSectionOption: React.FC<Props> = ({
  store,
  onSelect,
  style,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const borderColor = useMemo(() => {
    if (isHovered) return theme.custom.colors.primary.default;
    return theme.custom.colors.neutral[200];
  }, [isHovered]);

  const backgroundColor = useMemo(() => {
    if (isHovered) return theme.custom.colors.primary.light;
    return theme.custom.colors.background.light;
  }, [isHovered]);

  return (
    <Box
      border
      justify="space-between"
      align="flex-start"
      gap={theme.custom.spacing.medium}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        padding: theme.custom.spacing.medium,
        borderColor,
        backgroundColor,
        transition: 'border-color 0.2s ease',
        ...style,
      }}
    >
      <Box style={{
        padding: theme.custom.spacing.small,
        borderRadius: theme.custom.radius.medium,
        color: theme.custom.colors.primary.default,
        backgroundColor: theme.custom.colors.primary.light,
      }}>
        <Buildings2 weight="BoldDuotone" size={32} />
      </Box>

      <Typography.Text
        type="secondary"
        ellipsis
        style={{
          width: '100%',
          fontSize: theme.custom.fontSize.small,
        }}
      >
        {store.contact_phone_number} • {store.address}
      </Typography.Text>

      <Flex justify="center" align="center" style={{ height: '100%' }}>
        <AltArrowRight size={20} color={theme.custom.colors.text.tertiary} />
      </Flex>
    </Box>
  )
};