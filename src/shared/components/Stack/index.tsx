import React, { useEffect, useRef, useState } from 'react';
import { Flex, Spin, Typography } from 'antd';
import { useTheme } from '@shared/theme/useTheme';

export interface StackCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export interface StackCardHeaderProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export interface StackCardContentProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export interface StackCardActionProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const StackCardHeader: React.FC<StackCardHeaderProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <Flex
      vertical
      gap={theme.custom.spacing.small}
      style={{
        width: '100%',
        ...style,
      }}
    >
      {children}
    </Flex>
  );
};

const StackCardContent: React.FC<StackCardContentProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <Flex
      vertical
      gap={theme.custom.spacing.small}
      style={{
        width: '100%',
        flex: 1,
        ...style,
      }}
    >
      {children}
    </Flex>
  );
};

const StackCardAction: React.FC<StackCardActionProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <Flex
      gap={theme.custom.spacing.small}
      justify="flex-end"
      style={{
        width: '100%',
        ...style,
      }}
    >
      {children}
    </Flex>
  );
};

const StackCardBase: React.FC<StackCardProps> = ({ children, onClick, style }) => {
  const theme = useTheme();

  return (
    <Flex
      vertical
      gap={theme.custom.spacing.medium}
      onClick={onClick}
      style={{
        padding: theme.custom.spacing.large,
        borderRadius: theme.custom.radius.medium,
        backgroundColor: theme.custom.colors.background.light,
        border: `1px solid ${theme.custom.colors.neutral[200]}`,
        width: '100%',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </Flex>
  );
};

interface StackCardComponent extends React.FC<StackCardProps> {
  Header: typeof StackCardHeader;
  Content: typeof StackCardContent;
  Action: typeof StackCardAction;
}

const StackCardWithSubcomponents = StackCardBase as StackCardComponent;

StackCardWithSubcomponents.Header = StackCardHeader;
StackCardWithSubcomponents.Content = StackCardContent;
StackCardWithSubcomponents.Action = StackCardAction;

// Export as StackCard for easier usage
export const StackCard = StackCardWithSubcomponents;

export interface StackProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loading?: boolean;
  initialDisplayCount?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  gap?: number;
  style?: React.CSSProperties;
  getItemKey?: (item: T, index: number) => string | number;
}

export function Stack<T>({
  data,
  renderItem,
  loading = false,
  initialDisplayCount = 5,
  onLoadMore,
  hasMore = false,
  gap,
  style,
  getItemKey,
}: StackProps<T>) {
  const theme = useTheme();
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);
  const observerTarget = useRef<HTMLDivElement>(null);
  const prevDataLengthRef = useRef<number>(data.length);
  const resolvedGap = gap ?? theme.custom.spacing.medium;

  // Reset display count when data length decreases significantly (e.g., new search, filter change)
  // This happens when filters change and data is reset
  useEffect(() => {
    // If data length decreased significantly (more than 50% reduction), it's likely a new search
    // Or if data is empty and we had data before, reset
    if (data.length === 0 && prevDataLengthRef.current > 0) {
      setDisplayCount(initialDisplayCount);
    } else if (data.length > 0 && prevDataLengthRef.current > data.length * 2) {
      // Data was cut significantly, likely a new search
      setDisplayCount(initialDisplayCount);
    }
    prevDataLengthRef.current = data.length;
  }, [data.length, initialDisplayCount]);

  const displayedItems = data.slice(0, displayCount);
  // Only use observer for local data pagination (when !hasMore), not for API pagination
  const shouldShowObserver = !hasMore && data.length > displayCount && !loading;

  // Intersection Observer for infinite scroll (only for local data)
  useEffect(() => {
    if (!shouldShowObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!loading && data.length > displayCount) {
            // For local data, just increase display count
            setDisplayCount((prev) => Math.min(prev + initialDisplayCount, data.length));
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '20px',
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loading, data.length, displayCount, initialDisplayCount, shouldShowObserver]);

  return (
    <Flex
      vertical
      gap={resolvedGap}
      style={{
        width: '100%',
        ...style,
      }}
    >
      {displayedItems.map((item, index) => {
        const key = getItemKey ? getItemKey(item, index) : index;
        return (
          <React.Fragment key={key}>
            {renderItem(item, index)}
          </React.Fragment>
        );
      })}

      {shouldShowObserver && (
        <div ref={observerTarget} style={{ height: 1, width: '100%' }} />
      )}

      {loading && !hasMore && (
        <Flex justify="center" style={{ padding: theme.custom.spacing.large }}>
          <Spin spinning={loading} />
        </Flex>
      )}

      {hasMore && onLoadMore && (
        <Flex justify="center" style={{ padding: theme.custom.spacing.medium }}>
          {loading ? (
            <Spin spinning={loading} />
          ) : (
            <Typography.Link onClick={onLoadMore} style={{ cursor: 'pointer' }}>
              View More
            </Typography.Link>
          )}
        </Flex>
      )}
    </Flex>
  );
}

