import { useNavigate, useLocation } from 'react-router-dom';
import { Flex, Text, VStack, chakra } from '@chakra-ui/react';
import { HomeIcon, ChartIcon, ProfileIcon } from '../../assets/icons';

interface TabItem {
  path: string;
  label: string;
  Icon: React.FC<{ size?: number; color?: string }>;
}

const TABS: TabItem[] = [
  { path: '/', label: 'ホーム', Icon: HomeIcon },
  { path: '/history', label: 'きろく', Icon: ChartIcon },
  { path: '/profile', label: 'プロフィール', Icon: ProfileIcon },
];

export const TabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Flex
      as="nav"
      position="sticky"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      borderTop="1px solid"
      borderColor="#e5e7eb"
      boxShadow="0 -2px 10px rgba(0,0,0,0.04)"
      zIndex={50}
      aria-label="たぶばー"
    >
      {TABS.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <chakra.button
            key={tab.path}
            type="button"
            onClick={() => navigate(tab.path)}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
            flex={1}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={2}
            gap={0.5}
            cursor="pointer"
            transition="all 0.15s"
            minH="56px"
            _active={{ transform: 'scale(0.95)' }}
          >
            <VStack gap={0.5}>
              <tab.Icon
                size={22}
                color={isActive ? '#7c3aed' : '#9ca3af'}
              />
              <Text
                fontSize="2xs"
                fontWeight="700"
                color={isActive ? '#7c3aed' : '#9ca3af'}
                lineHeight="1"
              >
                {tab.label}
              </Text>
            </VStack>
          </chakra.button>
        );
      })}
    </Flex>
  );
};
