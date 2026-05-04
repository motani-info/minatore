import { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Box, Container, Flex, SimpleGrid, Text, VStack, chakra } from '@chakra-ui/react';
import { registry } from '../../registry/questionTypeRegistry';
import { getCategoryById, buildTabsForCategory } from '../categoryData';
import type { TabDef } from '../categoryData';
import type { Question } from '../../types/question';
import { R } from './Ruby';

/** 1ページあたりの問題数 */
const PAGE_SIZE = 10;

/** 問題タイプごとのテーマカラー */
const TYPE_THEMES: Record<string, { gradient: string; accent: string }> = {
  rotation: { gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', accent: '#7c3aed' },
  'symbol-rotation': { gradient: 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)', accent: '#9333ea' },
  'rotation-sequence': { gradient: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)', accent: '#6d28d9' },
  overlay: { gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', accent: '#3b82f6' },
  'overlay-advanced': { gradient: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)', accent: '#1d4ed8' },
  'overlay-shape': { gradient: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)', accent: '#1e40af' },
  'line-overlay': { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', accent: '#1e3a5f' },
  puzzle: { gradient: 'linear-gradient(135deg, #ec4899 0%, #f9a8d4 100%)', accent: '#ec4899' },
  'overlay-cancel': { gradient: 'linear-gradient(135deg, #0891b2 0%, #67e8f9 100%)', accent: '#0891b2' },
  'odd-one-out': { gradient: 'linear-gradient(135deg, #dc2626 0%, #fca5a5 100%)', accent: '#dc2626' },
  'shape-composition': { gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)', accent: '#ea580c' },
  seesaw: { gradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)', accent: '#059669' },
  'water-volume': { gradient: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)', accent: '#2563eb' },
  'compare-length': { gradient: 'linear-gradient(135deg, #0d9488 0%, #5eead4 100%)', accent: '#0d9488' },
  'compare-spring': { gradient: 'linear-gradient(135deg, #047857 0%, #6ee7b7 100%)', accent: '#047857' },
  'area-compare': { gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', accent: '#7c3aed' },
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
  const location = useLocation();
  const category = themeId ? getCategoryById(themeId) : undefined;

  if (!category) {
    return <Navigate to="/" replace />;
  }

  const tabs = buildTabsForCategory(category);

  if (tabs.length === 0) {
    return <Navigate to="/" replace />;
  }

  // HomeScreen からの初期タブ指定を受け取る
  const state = location.state as { initialTab?: string; initialSubIndex?: number } | null;
  let initialTabIndex = 0;
  let initialSubIndex = 0;
  if (state?.initialTab) {
    const idx = tabs.findIndex((t) => t.label === state.initialTab);
    if (idx >= 0) initialTabIndex = idx;
  }
  if (state?.initialSubIndex != null) {
    initialSubIndex = state.initialSubIndex;
  }

  return <ThemeScreenInner category={category} tabs={tabs} initialTabIndex={initialTabIndex} initialSubIndex={initialSubIndex} />;
};

function ThemeScreenInner({
  category,
  tabs,
  initialTabIndex,
  initialSubIndex,
}: {
  category: ReturnType<typeof getCategoryById> & {};
  tabs: TabDef[];
  initialTabIndex: number;
  initialSubIndex: number;
}) {
  const navigate = useNavigate();
  const [activeTabIndex, setActiveTabIndex] = useState(initialTabIndex);
  const activeTab = tabs[activeTabIndex];

  // グループ内にサブタイプがある場合のサブタブ
  const hasSubTabs = activeTab.units.length > 1;
  const [activeSubIndex, setActiveSubIndex] = useState(initialSubIndex);
  const activeUnit = activeTab.units[Math.min(activeSubIndex, activeTab.units.length - 1)];

  // ページング
  const [currentPage, setCurrentPage] = useState(0);

  // タブ切り替え時にサブタブとページをリセット
  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    setActiveSubIndex(0);
    setCurrentPage(0);
  };

  // 問題取得: getAllQuestions があれば全問表示、なければ生成
  const questionType = registry.get(activeUnit.id);
  const allQuestions: Question[] = useMemo(() => {
    if (!questionType) return [];
    if (questionType.getAllQuestions) {
      return questionType.getAllQuestions();
    }
    // アルゴリズム生成型: 一定数生成（将来的に固定プール化予定）
    return Array.from({ length: 20 }, () => questionType.generateQuestion());
  }, [questionType, activeSubIndex, activeTabIndex]);

  // ページング計算
  const totalPages = Math.ceil(allQuestions.length / PAGE_SIZE);
  const needsPaging = allQuestions.length > PAGE_SIZE;
  const pageQuestions = needsPaging
    ? allQuestions.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
    : allQuestions;
  const pageStartIndex = currentPage * PAGE_SIZE;

  const handleSelect = (pageIndex: number) => {
    if (!questionType) return;
    const globalIndex = pageStartIndex + pageIndex;
    navigate(`/question/${questionType.id}`, {
      state: { selectedQuestion: allQuestions[globalIndex] },
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
          pb={6}
          position="relative"
          overflow="hidden"
        >
          <Box position="absolute" right="-40px" top="-40px" w="160px" h="160px" bg="whiteAlpha.100" borderRadius="full" />
          <Box position="absolute" left="-20px" bottom="-20px" w="100px" h="100px" bg="whiteAlpha.100" borderRadius="full" />

          <VStack gap={3} align="stretch" position="relative" zIndex={1}>
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

            <Box>
              <Text fontSize="2xl" fontWeight="800" color="white" lineHeight="1.3">
                {category.title}
              </Text>
            </Box>
          </VStack>
        </Box>

        {/* 手帳風タブ */}
        <Box position="relative" zIndex={1} bg="white">
          <NotebookTabs
            tabs={tabs}
            activeIndex={activeTabIndex}
            onTabChange={handleTabChange}
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

            {/* サブタブ */}
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
                        setCurrentPage(0);
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

            {/* ページング（上部） */}
            {needsPaging && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={allQuestions.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
                accent={theme.accent}
              />
            )}

            {/* 問題一覧 */}
            {questionType && (
              <SimpleGrid columns={2} gap={3}>
                {pageQuestions.map((question, pageIndex) => {
                  const globalIndex = pageStartIndex + pageIndex;
                  const { QuestionDisplay } = questionType;
                  return (
                    <chakra.button
                      key={`${activeUnit.id}-${globalIndex}`}
                      type="button"
                      onClick={() => handleSelect(pageIndex)}
                      aria-label={`もんだい ${globalIndex + 1}`}
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
                          {globalIndex + 1}
                        </Text>
                      </Flex>

                      <Flex
                        w="100%"
                        minH="80px"
                        align="center"
                        justify="center"
                        pointerEvents="none"
                        overflow="hidden"
                        transform="scale(0.55)"
                        transformOrigin="center center"
                      >
                        <QuestionDisplay data={question.questionData} />
                      </Flex>

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

            {/* ページング（下部） */}
            {needsPaging && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={allQuestions.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
                accent={theme.accent}
              />
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

// ─── ページングコンポーネント ───

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  accent: string;
}

function Pagination({ currentPage, totalPages, totalItems, pageSize, onPageChange, accent }: PaginationProps) {
  const start = currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalItems);

  return (
    <Flex align="center" justify="center" gap={2}>
      <chakra.button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        w="36px"
        h="36px"
        fontSize="md"
        fontWeight="700"
        color={currentPage === 0 ? 'gray.300' : accent}
        bg={currentPage === 0 ? 'gray.50' : 'gray.100'}
        borderRadius="full"
        cursor={currentPage === 0 ? 'default' : 'pointer'}
        transition="all 0.15s"
        _hover={currentPage === 0 ? {} : { bg: 'gray.200' }}
        _active={currentPage === 0 ? {} : { transform: 'scale(0.95)' }}
        aria-label="まえのページ"
      >
        ‹
      </chakra.button>

      <Text fontSize="sm" fontWeight="600" color="gray.500" px={2}>
        {start}〜{end} / {totalItems}もん
      </Text>

      <chakra.button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        w="36px"
        h="36px"
        fontSize="md"
        fontWeight="700"
        color={currentPage >= totalPages - 1 ? 'gray.300' : accent}
        bg={currentPage >= totalPages - 1 ? 'gray.50' : 'gray.100'}
        borderRadius="full"
        cursor={currentPage >= totalPages - 1 ? 'default' : 'pointer'}
        transition="all 0.15s"
        _hover={currentPage >= totalPages - 1 ? {} : { bg: 'gray.200' }}
        _active={currentPage >= totalPages - 1 ? {} : { transform: 'scale(0.95)' }}
        aria-label="つぎのページ"
      >
        ›
      </chakra.button>
    </Flex>
  );
}

// ─── 手帳風タブコンポーネント ───

interface NotebookTabsProps {
  tabs: TabDef[];
  activeIndex: number;
  onTabChange: (index: number) => void;
}

function NotebookTabs({ tabs, activeIndex, onTabChange }: NotebookTabsProps) {
  return (
    <Flex
      position="relative"
      h="44px"
      align="flex-end"
      px={{ base: 3, sm: 4 }}
      overflowX="auto"
      css={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}
    >
      {tabs.map((tab, index) => {
        const isActive = index === activeIndex;
        const tabColor = TAB_COLORS[index % TAB_COLORS.length];

        // タブ内の全ユニットの問題数を合計
        const questionCount = tab.units.reduce((sum, u) => {
          const qt = registry.get(u.id);
          if (!qt) return sum;
          if (qt.getAllQuestions) return sum + qt.getAllQuestions().length;
          return sum + 20; // アルゴリズム生成型
        }, 0);

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
            minW={0}
          >
            <Text lineHeight="1" whiteSpace="nowrap">
              {tab.label}
            </Text>
            <Box
              bg={isActive ? tabColor.bg : `${tabColor.bg}33`}
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
                {questionCount}
              </Text>
            </Box>
          </chakra.button>
        );
      })}
    </Flex>
  );
}
