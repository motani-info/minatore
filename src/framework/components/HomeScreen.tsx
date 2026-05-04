import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Flex, Heading, Text, VStack, chakra } from '@chakra-ui/react';
import { useProgress } from '../hooks/useProgress';
import { useProfile } from '../hooks/useProfile';
import { CATEGORIES, buildTabsForCategory } from '../categoryData';
import type { CategoryDef, TabDef } from '../categoryData';
import { registry } from '../../registry/questionTypeRegistry';
import { TabBar } from './TabBar';
import { R } from './Ruby';
import { DiceIcon, ProfileIcon } from '../../assets/icons';

/** カテゴリのアイコン */
const CATEGORY_ICONS: Record<string, string> = {
  shapes: '🔷',
  memory: '🧠',
  'math-reasoning': '🔢',
  writing: '✏️',
};

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
  'water-volume': { gradient: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)', accent: '#2563eb' },
  'compare-length': { gradient: 'linear-gradient(135deg, #0d9488 0%, #5eead4 100%)', accent: '#0d9488' },
  'compare-spring': { gradient: 'linear-gradient(135deg, #047857 0%, #6ee7b7 100%)', accent: '#047857' },
  'area-compare': { gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', accent: '#7c3aed' },
  'shape-karta': { gradient: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)', accent: '#d97706' },
  'syllable-count': { gradient: 'linear-gradient(135deg, #7c3aed 0%, #c4b5fd 100%)', accent: '#7c3aed' },
  'one-to-one': { gradient: 'linear-gradient(135deg, #0284c7 0%, #7dd3fc 100%)', accent: '#0284c7' },
};

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { profile } = useProfile();

  return (
    <Flex direction="column" minH="100dvh">
      <Box flex={1}>
        <Container maxW="920px" py={{ base: 6, sm: 8 }} px={{ base: 5, sm: 6 }}>
          <VStack gap={7} align="stretch">

            {/* ヘッダー */}
            <Flex align="start" justify="space-between">
              <Box>
                <Heading
                  as="h1"
                  fontSize={{ base: '2xl', sm: '3xl' }}
                  fontWeight="800"
                  color="gray.800"
                  lineHeight="1.2"
                >
                  みなトレ
                </Heading>
                <Text fontSize="sm" color="gray.400" mt={1}>
                  {profile.name
                    ? <>{profile.name}さんの <R rt="れんしゅう">練習</R></>
                    : <>国立小学校<R rt="じゅけん">受験</R> <R rt="もんだい">問題</R><R rt="れんしゅう">練習</R></>}
                </Text>
              </Box>
              <chakra.button
                type="button"
                onClick={() => navigate('/profile')}
                aria-label="プロフィール"
                w="44px"
                h="44px"
                borderRadius="full"
                overflow="hidden"
                bg="gray.100"
                border="2px solid"
                borderColor="white"
                boxShadow="0 2px 8px rgba(0,0,0,0.06)"
                cursor="pointer"
                transition="all 0.15s"
                _hover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                _active={{ transform: 'scale(0.95)' }}
                flexShrink={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {profile.avatarUrl ? (
                  <chakra.img
                    src={profile.avatarUrl}
                    alt=""
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                ) : (
                  <ProfileIcon size={24} color="#9ca3af" />
                )}
              </chakra.button>
            </Flex>

            {/* ランダム10問カード */}
            <chakra.button
              type="button"
              onClick={() => navigate('/random')}
              aria-label="ランダム10問"
              display="flex"
              alignItems="center"
              gap={4}
              w="100%"
              p={5}
              bg="linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(249, 115, 22, 0.25)"
              cursor="pointer"
              transition="all 0.2s ease"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 30px rgba(249, 115, 22, 0.35)',
              }}
              _active={{ transform: 'scale(0.98)' }}
              position="relative"
              overflow="hidden"
              textAlign="left"
            >
              <Box
                position="absolute"
                right="-10px"
                top="-10px"
                w="80px"
                h="80px"
                bg="whiteAlpha.200"
                borderRadius="full"
              />
              <Box
                position="absolute"
                right="30px"
                bottom="-15px"
                w="50px"
                h="50px"
                bg="whiteAlpha.100"
                borderRadius="full"
              />

              <Flex
                align="center"
                justify="center"
                w="52px"
                h="52px"
                bg="whiteAlpha.300"
                borderRadius="xl"
                flexShrink={0}
                position="relative"
                zIndex={1}
              >
                <Text fontSize="28px" lineHeight="1"><DiceIcon size={32} color="white" /></Text>
              </Flex>
              <Box position="relative" zIndex={1}>
                <Text fontSize="lg" fontWeight="800" color="white">
                  ランダム10問
                </Text>
                <Text fontSize="xs" fontWeight="500" color="whiteAlpha.800" mt={0.5}>
                  いろいろな<R rt="もんだい">問題</R>に<R rt="ちょうせん">挑戦</R>！
                </Text>
              </Box>
            </chakra.button>

            {/* カテゴリごとのパネル一覧 */}
            {CATEGORIES.map((cat) => {
              const tabs = buildTabsForCategory(cat);
              const hasImplemented = tabs.length > 0;

              return (
                <VStack key={cat.id} gap={3} align="stretch">
                  {/* カテゴリ見出し */}
                  <Flex align="center" gap={2}>
                    <Text fontSize="lg" lineHeight="1">{CATEGORY_ICONS[cat.id] ?? '📚'}</Text>
                    <Text fontSize="sm" fontWeight="700" color="gray.600">
                      {cat.title}
                    </Text>
                    {!hasImplemented && (
                      <Box bg={`${cat.unimplementedTextColor}15`} borderRadius="full" px={2} py={0.5}>
                        <Text fontSize="2xs" fontWeight="600" color={cat.unimplementedTextColor} opacity={0.6}>
                          <R rt="じゅんび">準備</R>中
                        </Text>
                      </Box>
                    )}
                  </Flex>

                  {hasImplemented ? (
                    <VStack gap={3} align="stretch">
                      {tabs.map((tab) => (
                        <UnitPanel
                          key={tab.label}
                          tab={tab}
                          category={cat}
                          progress={progress}
                        />
                      ))}
                    </VStack>
                  ) : (
                    <Box
                      bg={cat.unimplementedGradient}
                      border="1px solid"
                      borderColor={`${cat.unimplementedTextColor}22`}
                      borderRadius="2xl"
                      p={4}
                      opacity={0.85}
                    >
                      <Text fontSize="sm" fontWeight="600" color={cat.unimplementedTextColor} opacity={0.6}>
                        <R rt="じゅんび">準備</R>中です
                      </Text>
                    </Box>
                  )}
                </VStack>
              );
            })}

          </VStack>
        </Container>
      </Box>

      {/* タブバー */}
      <TabBar />
    </Flex>
  );
};

// ─── 単元パネルコンポーネント ───

interface UnitPanelProps {
  tab: TabDef;
  category: CategoryDef;
  progress: ReturnType<typeof useProgress>['progress'];
}

function UnitPanel({ tab, category, progress }: UnitPanelProps) {
  const navigate = useNavigate();
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const activeUnit = tab.units[Math.min(activeSubIndex, tab.units.length - 1)];

  const theme = TYPE_THEMES[activeUnit.id]
    ?? { gradient: `linear-gradient(135deg, ${category.color} 0%, ${category.color}88 100%)`, accent: category.color };

  const questionType = registry.get(activeUnit.id);

  const questionCount = useMemo(() => {
    if (!questionType) return 0;
    if (questionType.getAllQuestions) return questionType.getAllQuestions().length;
    return 20;
  }, [questionType]);

  const totalDone = tab.units.reduce(
    (sum, u) => sum + (progress?.byType[u.id]?.totalQuestions ?? 0),
    0,
  );

  const handleStart = () => {
    if (!questionType) return;
    navigate(`/theme/${category.id}`, { state: { initialTab: tab.label, initialSubIndex: activeSubIndex } });
  };

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      border="1px solid"
      borderColor="#e5e7eb"
      boxShadow="0 2px 8px rgba(0,0,0,0.04)"
      overflow="hidden"
    >
      {/* パネルヘッダー */}
      <Box
        bg={theme.gradient}
        px={4}
        py={3}
        position="relative"
        overflow="hidden"
      >
        <Box position="absolute" right="-20px" top="-20px" w="80px" h="80px" bg="whiteAlpha.100" borderRadius="full" />
        <Flex align="center" justify="space-between" position="relative" zIndex={1}>
          <Flex align="center" gap={2}>
            <Text fontSize="md" fontWeight="800" color="white">
              {tab.label}
            </Text>
            <Box bg="whiteAlpha.300" borderRadius="full" px={2} py={0.5}>
              <Text fontSize="2xs" fontWeight="700" color="white">
                {questionCount}もん
              </Text>
            </Box>
          </Flex>
          {totalDone > 0 && (
            <Box bg="whiteAlpha.300" borderRadius="full" px={2} py={0.5}>
              <Text fontSize="2xs" fontWeight="700" color="white">
                {totalDone}問クリア
              </Text>
            </Box>
          )}
        </Flex>
      </Box>

      {/* サブタブ（難易度・サブ分類） */}
      <Box px={4} pt={3} pb={3}>
        <Flex gap={2} overflowX="auto" pb={1}>
          {tab.units.map((unit, i) => {
            const isActive = i === activeSubIndex;
            const unitTheme = TYPE_THEMES[unit.id]
              ?? { gradient: `linear-gradient(135deg, ${category.color} 0%, ${category.color}88 100%)`, accent: category.color };
            return (
              <chakra.button
                key={unit.id}
                type="button"
                onClick={() => setActiveSubIndex(i)}
                px={3}
                py={1.5}
                fontSize="xs"
                fontWeight="700"
                borderRadius="full"
                bg={isActive ? unitTheme.gradient : 'gray.100'}
                color={isActive ? 'white' : 'gray.500'}
                transition="all 0.2s"
                _hover={isActive ? {} : { bg: 'gray.200' }}
                _active={{ transform: 'scale(0.95)' }}
                cursor="pointer"
                flexShrink={0}
                minH="32px"
                boxShadow={isActive ? `0 2px 8px ${unitTheme.accent}33` : 'none'}
              >
                {unit.subLabel ?? unit.name}
              </chakra.button>
            );
          })}
        </Flex>
      </Box>

      {/* プレビュー＆開始ボタン */}
      <Box px={4} pb={4}>
        {questionType && (
          <QuestionPreview
            questionType={questionType}
            theme={theme}
            onStart={handleStart}
          />
        )}
      </Box>
    </Box>
  );
}

// ─── 問題プレビューコンポーネント ───

interface QuestionPreviewProps {
  questionType: ReturnType<typeof registry.get> & {};
  theme: { gradient: string; accent: string };
  onStart: () => void;
}

function QuestionPreview({ questionType, theme, onStart }: QuestionPreviewProps) {
  const previewQuestions = useMemo(() => {
    if (questionType.getAllQuestions) {
      return questionType.getAllQuestions().slice(0, 3);
    }
    return Array.from({ length: 3 }, () => questionType.generateQuestion());
  }, [questionType]);

  return (
    <VStack gap={3} align="stretch">
      {/* プレビューサムネイル */}
      <Flex gap={2} justify="center">
        {previewQuestions.map((q, i) => {
          const { QuestionDisplay } = questionType;
          return (
            <Box
              key={i}
              flex={1}
              maxW="100px"
              bg="#fafafa"
              border="1.5px solid"
              borderColor="#e5e7eb"
              borderRadius="xl"
              p={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
              <Box
                pointerEvents="none"
                transform="scale(0.4)"
                transformOrigin="center center"
                minH="60px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <QuestionDisplay data={q.questionData} />
              </Box>
            </Box>
          );
        })}
      </Flex>

      {/* 開始ボタン */}
      <chakra.button
        type="button"
        onClick={onStart}
        w="100%"
        bg={theme.gradient}
        borderRadius="xl"
        py={2.5}
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ transform: 'translateY(-1px)', boxShadow: `0 4px 12px ${theme.accent}33` }}
        _active={{ transform: 'scale(0.98)' }}
      >
        <Text fontSize="sm" fontWeight="700" color="white" textAlign="center">
          <R rt="もんだい">問題</R>をえらぶ
        </Text>
      </chakra.button>
    </VStack>
  );
}
