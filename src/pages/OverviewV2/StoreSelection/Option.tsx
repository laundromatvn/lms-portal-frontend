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
  selected: boolean;
  onSelect: () => void;
  style?: React.CSSProperties;
}

export const StoreSelectionSectionOption: React.FC<Props> = ({
  store,
  selected,
  onSelect,
  style,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const borderColor = useMemo(() => {
    if (selected) return theme.custom.colors.primary.default;
    if (isHovered) return theme.custom.colors.primary.default;
    return theme.custom.colors.neutral[200];
  }, [isHovered, selected]);

  const backgroundColor = useMemo(() => {
    if (selected) return theme.custom.colors.primary.light;
    if (isHovered) return theme.custom.colors.primary.light;
    return theme.custom.colors.background.light;
  }, [isHovered, selected]);

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
        padding: theme.custom.spacing.large,
        borderColor,
        backgroundColor,
        transition: 'border-color 0.2s ease',
        ...style,
      }}
    >
      <Box
        style={{
          padding: theme.custom.spacing.small,
          borderRadius: theme.custom.radius.medium,
          color: theme.custom.colors.primary.default,
          backgroundColor: theme.custom.colors.primary.light,
        }}
      >
        <Buildings2
          weight="BoldDuotone"
          size={32}
        />
      </Box>

      <Flex
        vertical
        justify="start"
        align="start"
        gap={theme.custom.spacing.xsmall}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Typography.Text strong>{store.name}</Typography.Text>
        <Typography.Text type="secondary">{store.address}</Typography.Text>
      </Flex>

      <Flex
        justify="center"
        align="center"
        style={{ height: '100%' }}
      >
        <AltArrowRight size={24} />
      </Flex>
    </Box>
  )
};