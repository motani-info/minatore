import { useNavigate } from 'react-router-dom';
import { Box, Container, Flex, Heading, Text, VStack, SimpleGrid, chakra } from '@chakra-ui/react';
import { useProfile } from '../hooks/useProfile';
import { CATEGORIES, buildTabsForCategory } from '../categoryData';
import { TabBar } from './TabBar';
import { R } from './Ruby';
import { DiceIcon, ProfileIcon } from '../../assets/icons';
import {
  RotationThumbnail,
  SymbolRotationThumbnail,
  RotationSequenceThumbnail,
  OverlayThumbnail,
  OverlayAdvancedThumbnail,
  OverlayShapeThumbnail,
  LineOverlayThumbnail,
  PuzzleThumbnail,
  OverlayCancelThumbnail,
  ShapeCompositionThumbnail,
  SeesawThumbnail,
  WaterVolumeThumbnail,
  CompareLengthThumbnail,
  CompareSpringThumbnail,
  AreaCompareThumbnail,
  ShapeKartaThumbnail,
  SyllableCountThumbnail,
  OneToOneThumbnail,
} from '../../assets/icons/thumbnails';

/** 問題タイプ別サムネイルコンポーネントのマッピング */
const TYPE_THUMBNAILS: Record<string, React.FC<{ size?: number }>> = {
  rotation: RotationThumbnail,
  'symbol-rotation': SymbolRotationThumbnail,
  'rotation-sequence': RotationSequenceThumbnail,
  overlay: OverlayThumbnail,
  'overlay-advanced': OverlayAdvancedThumbnail,
  'overlay-shape': OverlayShapeThumbnail,
  'line-overlay': LineOverlayThumbnail,
  puzzle: PuzzleThumbnail,
  'overlay-cancel': OverlayCancelThumbnail,
  'shape-composition': ShapeCompositionThumbnail,
  seesaw: SeesawThumbnail,
  'water-volume': WaterVolumeThumbnail,
  'compare-length': CompareLengthThumbnail,
  'compare-spring': CompareSpringThumbnail,
  'area-compare': AreaCompareThumbnail,
  'shape-karta': ShapeKartaThumbnail,
  'syllable-count': SyllableCountThumbnail,
  'one-to-one': OneToOneThumbnail,
};

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
  'rotation-sequence': { gradient: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)', accent: '#6d28d9' },
  overlay: { gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', accent: '#3b82f6' },
  'overlay-advanced': { gradient: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)', accent: '#1d4ed8' },
  'overlay-shape': { gradient: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)', accent: '#1e40af' },
  'line-overlay': { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', accent: '#1e3a5f' },
  puzzle: { gradient: 'linear-gradient(135deg, #ec4899 0%, #f9a8d4 100%)', accent: '#ec4899' },
  'overlay-cancel': { gradient: 'linear-gradient(135deg, #0891b2 0%, #67e8f9 100%)', accent: '#0891b2' },
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

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
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
              onClick={() => {
                // 前回のランダムクイズ進捗をリセットして新規開始
                sessionStorage.removeItem('randomQuizTypeIds');
                sessionStorage.removeItem('randomQuizIndex');
                navigate('/random');
              }}
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
                    <Text fontSize="xl" lineHeight="1">{CATEGORY_ICONS[cat.id] ?? '📚'}</Text>
                    <Text fontSize="md" fontWeight="700" color="gray.600">
                      {cat.title}
                    </Text>
                    {!hasImplemented && (
                      <Box bg={`${cat.unimplementedTextColor}15`} borderRadius="full" px={2} py={0.5}>
                        <Text fontSize="xs" fontWeight="600" color={cat.unimplementedTextColor} opacity={0.6}>
                          <R rt="じゅんび">準備</R>中
                        </Text>
                      </Box>
                    )}
                  </Flex>

                  {hasImplemented ? (
                    <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} gap={3}>
                      {tabs.map((tab) => {
                        const firstUnit = tab.units[0];
                        const theme = TYPE_THEMES[firstUnit.id]
                          ?? { gradient: `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}88 100%)`, accent: cat.color };
                        const subCount = tab.units.length;

                        // サムネイルアイコンを取得
                        const ThumbnailIcon = TYPE_THUMBNAILS[firstUnit.id];

                        return (
                          <chakra.button
                            key={tab.label}
                            type="button"
                            onClick={() => navigate(`/theme/${cat.id}`, { state: { initialTab: tab.label } })}
                            aria-label={tab.label}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="space-between"
                            p={2.5}
                            aspectRatio="1"
                            bg={theme.gradient}
                            borderRadius="xl"
                            boxShadow="0 2px 10px rgba(0,0,0,0.1)"
                            cursor="pointer"
                            transition="all 0.2s ease"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}
                            _active={{ transform: 'scale(0.97)' }}
                            textAlign="center"
                            position="relative"
                            overflow="hidden"
                          >
                            {/* 背景装飾 */}
                            <Box position="absolute" right="-6px" top="-6px" w="32px" h="32px" bg="whiteAlpha.200" borderRadius="full" />

                            {/* タイトル（上） */}
                            <Text fontSize="sm" fontWeight="800" color="white" lineHeight="1.3" w="100%">
                              {tab.label}
                            </Text>

                            {/* サムネイルアイコン（中央） */}
                            <Flex
                              flex={1}
                              align="center"
                              justify="center"
                              w="100%"
                              overflow="hidden"
                              pointerEvents="none"
                            >
                              {ThumbnailIcon ? (
                                <ThumbnailIcon size={72} />
                              ) : (
                                <Text fontSize="28px" lineHeight="1">{firstUnit.icon}</Text>
                              )}
                            </Flex>

                            {/* 分類（下） — サブタイプがある場合のみ */}
                            {subCount > 1 ? (
                              <Text fontSize="xs" fontWeight="500" color="whiteAlpha.700" lineHeight="1.3" w="100%">
                                {tab.units.map(u => u.subLabel ?? u.name).join('・')}
                              </Text>
                            ) : (
                              <Box h="1em" />
                            )}
                          </chakra.button>
                        );
                      })}
                    </SimpleGrid>
                  ) : (
                    <Box
                      bg={cat.unimplementedGradient}
                      border="1px solid"
                      borderColor={`${cat.unimplementedTextColor}22`}
                      borderRadius="xl"
                      p={3}
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

