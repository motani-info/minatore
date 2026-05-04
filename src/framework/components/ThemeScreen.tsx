import { useState, useMemo } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Box, Container, Flex, SimpleGrid, Text, VStack, chakra } from '@chakra-ui/react';
import { registry } from '../../registry/questionTypeRegistry';
import { getCategoryById, buildTabsForCategory } from '../categoryData';
import type { TabDef } from '../categoryData';
import type { Question } from '../../types/question';
import { useProgress } from '../hooks/useProgress';
import { R } from './Ruby';

/** 問題タイプごとのテーマカラー */
const TYPE_THEMES: Record<string, { gradient: string; accent: string }> = {
  rotation: { gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', accent: '#7c3aed' },
  'symbol-rotation': { gradient: 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)', accent: '#9333ea' },
  overlay: { gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', accent: '#3b82f6' },
  'overlay-advanced': { gradient: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)', accent: '#1d4ed8' },
  'overlay-shape': { gradient: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)', accent: '#1e40af' },
  'line-overlay': { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', accent: '#1e3a5f' },
  puzzle: { gradient: 'linear-gradient(135deg, #ec4899 0%, #f9a8d4 100%)', accent: '#ec4899' },
  'overlay-cancel': { gradient: 'linear-gradient(135deg, #0891b2 0%, #67e8f9 100%)', accent: '#0891b2' },
  'odd-one-out': { gradient: 'linear-gradient(135deg, #dc2626 0%, #fca5a5 100%)', accent: '#dc2626' },
  seesaw: { gradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)', accent: '#059669' },
  'shape-karta': { gradient: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)', accent: '#d97706' },
  'syllable-count': { gradient: 'linear-gradient(135deg, #7c3aed 0%, #c4b5fd 100%)', accent: '#7c3aed' },
  'one-to-one': { gradient: 'linear-gradient(135deg, #0284c7 0%, #7dd3fc 100%)', accent: '#0284c7' },
};

/** タブごとに色相をずらすためのカラーパレット */
const TAB_COLORS = [
  { bg: '#7c3aed', bgLight: '#ede9fe', text: '#7c3aed' },
  { bg: '#2563eb', bgLight: '#dbeafe', text: '#2563eb' },
  { bg: '#059669', bgLight: '#d1fae5', text: '#059669' },
  { bg: '#d97706', bgLight: '#fef3c7', text: '#d97706' },
  { bg: '#ec4899', bgLight: '#fce7f3', text: '#ec4899' },
  { bg: '#0891b2', bgLight: '#cffafe', text: '#0891b2' },
  { bg: '#dc2626', bgLight: '#fee2e2', text: '#dc2626' },
  { bg: '#8b5cf6', bgLight: '#ede9fe', text: '#8b5cf6' },
];

export const ThemeScreen: React.FC = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const category = themeId ? getCategoryById(themeId) : undefined;

  if (!category) {
    return <Navigate to="/" replace />;
  }

  const tabs = buildTabsForCategory(category);

  if (tabs.length === 0) {
    return <Navigate to="/" replace />;
  }

  return <ThemeScreenInner category={category} tabs={tabs} />;
};

function ThemeScreenInner({
  category,
  tabs,
}: {
  category: ReturnType<typeof getCategoryById> & {};
  tabs: TabDef[];
}) {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = tabs[activeTabIndex];

  // グループ内にサブタイプがある場合のサブタブ
  const hasSubTabs = activeTab.units.length > 1;
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const activeUnit = activeTab.units[Math.min(activeSubIndex, activeTab.units.length - 1)];

  // タブ切り替え時にサブタブをリセット
  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    setActiveSubIndex(0);
  };

  // 問題生成: getAllQuestions があれば全問表示、なければ一定数生成
  const questionType = registry.get(activeUnit.id);
  const questions: Question[] = useMemo(() => {
    if (!questionType) return [];
    if (questionType.getAllQuestions) {
      return questionType.getAllQuestions();
    }
    return Array.from({ length: 20 }, () => questionType.generateQuestion());
  }, [questionType, activeSubIndex, activeTabIndex]);

  const handleSelect = (index: number) => {
    if (!questionType) return;
    navigate(`/question/${questionType.id}`, {
      state: { selectedQuestion: questions[index] },
    });
  };

  const theme = questionType
    ? (TYPE_THEMES[questionType.id] ?? { gradient: `linear-gradient(135deg, ${category.color}, ${category.color}88)`, accent: category.color })
    : { gradient: `linear-gradient(135deg, ${category.color}, ${category.color}88)`, accent: category.color };

  return (
    <Container maxW="920px" minH="100dvh" py={0} px={0}>
      <VStack gap={0} align="stretch" minH="100dvh">

        {/* ヘッダー */}
        <Box
          bg={theme.gradient}
          px={{ base: 5, sm: 6 }}
          pt={{ base: 4, sm: 6 }}
          pb={2}
          position="relative"
          overflow="hidden"
        >
          <Box position="absolute" right="-40px" top="-40px" w="160px" h="160px" bg="whiteAlpha.100" borderRadius="full" />
          <Box position="absolute" left="-20px" bottom="-20px" w="100px" h="100px" bg="whiteAlpha.100" borderRadius="full" />

          <VStack gap={3} align="stretch" position="relative" zIndex={1}>
            {/* ナビゲーション */}
            <Flex align="center" gap={3}>
              <chakra.button
                type="button"
                onClick={() => navigate('/')}
                aria-label="ホームにもどる"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="40px"
                h="40px"
                fontSize="lg"
                color="whiteAlpha.800"
                borderRadius="full"
                bg="whiteAlpha.200"
                transition="all 0.15s"
                _hover={{ bg: 'whiteAlpha.300', color: 'white' }}
                _active={{ transform: 'scale(0.95)' }}
                flexShrink={0}
              >
                ←
              </chakra.button>
              <Box flex={1} />
            </Flex>

            {/* タイトル */}
            <Box>
              <Text fontSize="2xl" fontWeight="800" color="white" lineHeight="1.3">
                {category.title}
              </Text>
              <Text fontSize="sm" fontWeight="500" color="whiteAlpha.800" mt={0.5}>
                {questions.length > 0
                  ? `ぜんぶで ${questions.length} もん`
                  : <><R rt="もんだい">問題</R>を<R rt="えら">選</R>んで<R rt="ちょうせん">挑戦</R>しよう</>}
              </Text>
            </Box>
          </VStack>
        </Box>

        {/* 手帳風タブ */}
        <Box position="relative" zIndex={3}>
          <NotebookTabs
            tabs={tabs}
            activeIndex={activeTabIndex}
            onTabChange={handleTabChange}
            progress={progress}
          />
        </Box>

        {/* コンテンツ */}
        <Box
          flex={1}
          bg="white"
          px={{ base: 5, sm: 6 }}
          pt={5}
          pb={6}
          position="relative"
          zIndex={2}
          borderTop="3px solid"
          borderColor={TAB_COLORS[activeTabIndex % TAB_COLORS.length].bg}
        >
          <VStack gap={5} align="stretch">

            {/* サブタブ（グループ内の基本/応用など） */}
            {hasSubTabs && (
              <Flex gap={2} overflowX="auto" pb={1}>
                {activeTab.units.map((unit, i) => {
                  const isActive = i === activeSubIndex;
                  return (
                    <chakra.button
                      key={unit.id}
                      type="button"
                      onClick={() => {
                        setActiveSubIndex(i);
                      }}
                      px={4}
                      py={2}
                      fontSize="sm"
                      fontWeight="700"
                      borderRadius="full"
                      bg={isActive ? theme.gradient : 'gray.100'}
                      color={isActive ? 'white' : 'gray.500'}
                      transition="all 0.2s"
                      _hover={isActive ? {} : { bg: 'gray.200' }}
                      _active={{ transform: 'scale(0.95)' }}
                      cursor="pointer"
                      flexShrink={0}
                      minH="36px"
                      boxShadow={isActive ? `0 2px 8px ${theme.accent}33` : 'none'}
                    >
                      {unit.subLabel ?? unit.name}
                    </chakra.button>
                  );
                })}
              </Flex>
            )}

            {/* 問題一覧 */}
            {questionType && (
              <SimpleGrid columns={2} gap={3}>
                {questions.map((question, index) => {
                  const { QuestionDisplay } = questionType;
                  return (
                    <chakra.button
                      key={`${activeUnit.id}-${index}`}
                      type="button"
                      onClick={() => handleSelect(index)}
                      aria-label={`もんだい ${index + 1}`}
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={2}
                      p={3}
                      bg="#fafafa"
                      border="2px solid"
                      borderColor="#e5e7eb"
                      borderRadius="2xl"
                      boxShadow="0 2px 8px rgba(0,0,0,0.04)"
                      cursor="pointer"
                      transition="all 0.2s ease"
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                        borderColor: theme.accent,
                      }}
                      _active={{ transform: 'scale(0.96)' }}
                      position="relative"
                      overflow="hidden"
                    >
                      {/* 問題番号バッジ */}
                      <Flex
                        position="absolute"
                        top={2}
                        left={2}
                        align="center"
                        justify="center"
                        w="24px"
                        h="24px"
                        bg={theme.gradient}
                        borderRadius="full"
                        zIndex={1}
                      >
                        <Text fontSize="xs" fontWeight="800" color="white" lineHeight="1">
                          {index + 1}
                        </Text>
                      </Flex>

                      {/* 問題プレビュー */}
                      <Box
                        w="100%"
                        minH="100px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        pointerEvents="none"
                        transform="scale(0.65)"
                        transformOrigin="center center"
                      >
                        <QuestionDisplay data={question.questionData} />
                      </Box>

                      {/* ラベル */}
                      <Box
                        w="100%"
                        bg={theme.gradient}
                        borderRadius="lg"
                        py={1.5}
                        mt="auto"
                      >
                        <Text fontSize="xs" fontWeight="700" color="white" textAlign="center">
                          この<R rt="もんだい">問題</R>をやる
                        </Text>
                      </Box>
                    </chakra.button>
                  );
                })}
              </SimpleGrid>
            )}

            {/* 未実装の場合 */}
            {!questionType && (
              <Flex
                align="center"
                justify="center"
                minH="200px"
                bg="gray.50"
                borderRadius="2xl"
              >
                <Text color="gray.400" fontWeight="600">
                  <R rt="じゅんび">準備</R>中です
                </Text>
              </Flex>
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

// ─── 手帳風タブコンポーネント ───

interface NotebookTabsProps {
  tabs: TabDef[];
  activeIndex: number;
  onTabChange: (index: number) => void;
  progress: ReturnType<typeof useProgress>['progress'];
}

/**
 * 手帳のインデックスタブ風UI
 * タブが少しずつずれて重なり、アクティブなタブが前面に出る
 */
function NotebookTabs({ tabs, activeIndex, onTabChange, progress }: NotebookTabsProps) {
  return (
    <Flex
      position="relative"
      h="44px"
      align="flex-end"
      px={{ base: 3, sm: 4 }}
    >
      {tabs.map((tab, index) => {
        const isActive = index === activeIndex;
        const tabColor = TAB_COLORS[index % TAB_COLORS.length];
        const totalDone = tab.units.reduce(
          (sum, u) => sum + (progress?.byType[u.id]?.totalQuestions ?? 0),
          0,
        );

        // 重なり具合: 各タブは少しずつ右にずれる
        // アクティブなタブは zIndex が最も高い
        const zIndex = isActive ? tabs.length + 1 : tabs.length - Math.abs(index - activeIndex);

        return (
          <chakra.button
            key={tab.label}
            type="button"
            onClick={() => onTabChange(index)}
            position="relative"
            zIndex={zIndex}
            display="flex"
            alignItems="center"
            gap={1}
            px={{ base: 3, sm: 4 }}
            pt={2}
            pb={isActive ? 2.5 : 2}
            bg={isActive ? 'white' : tabColor.bgLight}
            color={isActive ? tabColor.text : `${tabColor.text}99`}
            fontWeight={isActive ? '800' : '600'}
            fontSize={{ base: 'xs', sm: 'sm' }}
            borderTopRadius="xl"
            borderBottom={isActive ? '3px solid' : 'none'}
            borderBottomColor={isActive ? tabColor.bg : 'transparent'}
            boxShadow={isActive
              ? '0 -2px 8px rgba(0,0,0,0.08)'
              : '0 -1px 4px rgba(0,0,0,0.04)'}
            cursor="pointer"
            transition="all 0.2s ease"
            _hover={isActive ? {} : { bg: `${tabColor.bgLight}`, transform: 'translateY(-2px)' }}
            _active={{ transform: 'scale(0.97)' }}
            marginRight="-6px"
            minH="36px"
            flexShrink={0}
          >
            <Text lineHeight="1" whiteSpace="nowrap">
              {tab.label}
            </Text>
            {totalDone > 0 && (
              <Box
                bg={isActive ? tabColor.bg : `${tabColor.bg}44`}
                borderRadius="full"
                px={1.5}
                py={0.5}
                ml={0.5}
              >
                <Text
                  fontSize="9px"
                  fontWeight="700"
                  color={isActive ? 'white' : tabColor.text}
                  lineHeight="1"
                >
                  {totalDone}
                </Text>
              </Box>
            )}
          </chakra.button>
        );
      })}
    </Flex>
  );
}
