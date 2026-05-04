import { useNavigate } from 'react-router-dom';
import { Box, Container, Flex, Heading, Text, VStack, SimpleGrid, chakra } from '@chakra-ui/react';
import { registry } from '../../registry/questionTypeRegistry';
import { useProgress } from '../hooks/useProgress';
import { useProfile } from '../hooks/useProfile';
import { TabBar } from './TabBar';
import { R } from './Ruby';

/** 単元カテゴリ定義 */
interface UnitDef {
  id: string;
  name: string;
  icon: string;
  /** 実装済みの問題タイプIDと一致すれば遷移可能 */
  implemented: boolean;
}

interface CategoryDef {
  title: string;
  color: string;
  /** 実装済みカードの個別グラデーション（unitのidで引く） */
  implementedGradients: Record<string, string>;
  /** 未実装カードの薄い背景グラデーション */
  unimplementedGradient: string;
  /** 未実装カードのテキスト色 */
  unimplementedTextColor: string;
  units: UnitDef[];
}

const CATEGORIES: CategoryDef[] = [
  {
    title: '図形',
    color: '#7c3aed',
    implementedGradients: {
      rotation: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
      overlay: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
      puzzle: 'linear-gradient(135deg, #ec4899 0%, #f9a8d4 100%)',
    },
    unimplementedGradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
    unimplementedTextColor: '#7c3aed',
    units: [
      { id: 'rotation', name: '回転図形', icon: '🔄', implemented: true },
      { id: 'overlay', name: '重ね図形', icon: '🔲', implemented: true },
      { id: 'puzzle', name: '図形パズル', icon: '🧩', implemented: true },
      { id: 'position', name: '位置の移動', icon: '➡️', implemented: false },
      { id: 'perspective', name: '四方観察', icon: '👀', implemented: false },
      { id: 'copy', name: '模写', icon: '✏️', implemented: false },
      { id: 'mirror', name: '鏡図形', icon: '🪞', implemented: false },
      { id: 'sequence', name: '系列完成', icon: '🔢', implemented: false },
    ],
  },
  {
    title: '記憶',
    color: '#2563eb',
    implementedGradients: {},
    unimplementedGradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    unimplementedTextColor: '#2563eb',
    units: [
      { id: 'story-memory', name: 'お話の記憶', icon: '📖', implemented: false },
      { id: 'visual-memory', name: '視覚記憶', icon: '🖼️', implemented: false },
    ],
  },
  {
    title: '数量・推理',
    color: '#059669',
    implementedGradients: {},
    unimplementedGradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    unimplementedTextColor: '#059669',
    units: [
      { id: 'counting', name: '数', icon: '🔢', implemented: false },
      { id: 'science', name: '理科的常識', icon: '🔬', implemented: false },
      { id: 'reasoning', name: '推理', icon: '⚖️', implemented: false },
      { id: 'elimination', name: '選択抹消', icon: '✂️', implemented: false },
    ],
  },
  {
    title: '運筆',
    color: '#d97706',
    implementedGradients: {},
    unimplementedGradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    unimplementedTextColor: '#d97706',
    units: [
      { id: 'line-drawing', name: '線引き', icon: '〰️', implemented: false },
    ],
  },
];

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { profile } = useProfile();

  const totalQuestions = progress
    ? Object.values(progress.byType).reduce((s, t) => s + t.totalQuestions, 0)
    : 0;
  const totalCorrect = progress
    ? Object.values(progress.byType).reduce((s, t) => s + t.correctAnswers, 0)
    : 0;
  const progressPercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const handleUnitTap = (unit: UnitDef) => {
    if (unit.implemented && registry.has(unit.id)) {
      navigate(`/question/${unit.id}`);
    }
  };

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
                  <Text fontSize="20px" color="gray.400">👤</Text>
                )}
              </chakra.button>
            </Flex>

            {/* プログレスバー */}
            <Box>
              <Box h="6px" bg="gray.200" borderRadius="full" overflow="hidden">
                <Box
                  h="100%"
                  w={`${progressPercent}%`}
                  bg="linear-gradient(90deg, #34d399, #10b981)"
                  borderRadius="full"
                  transition="width 0.4s ease"
                />
              </Box>
              <Text fontSize="xs" color="gray.400" mt={2}>
                {totalQuestions > 0
                  ? <>{progressPercent}% — {totalCorrect}問<R rt="せいかい">正解</R> / {totalQuestions}問中</>
                  : <>まだ<R rt="もんだい">問題</R>をといていません</>}
              </Text>
            </Box>

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
              {/* 背景装飾 */}
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
                <Text fontSize="28px" lineHeight="1">🎲</Text>
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

            {/* カテゴリ別単元カード */}
            {CATEGORIES.map((cat) => (
              <VStack key={cat.title} gap={3} align="stretch">
                <Flex align="center" gap={2}>
                  <Box w="4px" h="18px" bg={cat.color} borderRadius="full" />
                  <Text fontSize="sm" fontWeight="700" color="gray.600">
                    {cat.title}
                  </Text>
                </Flex>

                <SimpleGrid columns={2} gap={3}>
                  {cat.units.map((unit) => {
                    const typeProgress = progress?.byType[unit.id];
                    const done = typeProgress?.totalQuestions ?? 0;
                    const unitGradient = unit.implemented
                      ? (cat.implementedGradients[unit.id] ?? `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}88 100%)`)
                      : cat.unimplementedGradient;

                    return (
                      <chakra.button
                        key={unit.id}
                        type="button"
                        onClick={() => handleUnitTap(unit)}
                        aria-label={unit.name}
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        p={4}
                        minH="130px"
                        bg={unitGradient}
                        border={unit.implemented ? 'none' : '1px solid'}
                        borderColor={unit.implemented ? undefined : `${cat.unimplementedTextColor}22`}
                        borderRadius="2xl"
                        boxShadow={unit.implemented
                          ? '0 4px 16px rgba(0,0,0,0.1)'
                          : '0 1px 4px rgba(0,0,0,0.03)'}
                        cursor={unit.implemented ? 'pointer' : 'default'}
                        transition="all 0.2s ease"
                        _hover={unit.implemented ? {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
                        } : {}}
                        _active={unit.implemented ? { transform: 'scale(0.97)' } : {}}
                        textAlign="left"
                        position="relative"
                        overflow="hidden"
                        opacity={unit.implemented ? 1 : 0.85}
                      >
                        {/* 背景装飾 */}
                        {unit.implemented && (
                          <>
                            <Box
                              position="absolute"
                              right="-8px"
                              top="-8px"
                              w="60px"
                              h="60px"
                              bg="whiteAlpha.200"
                              borderRadius="full"
                            />
                            <Box
                              position="absolute"
                              right="12px"
                              bottom="12px"
                              fontSize="36px"
                              opacity={0.25}
                              lineHeight="1"
                            >
                              {unit.icon}
                            </Box>
                          </>
                        )}

                        {/* バッジ */}
                        <Flex justify="flex-end" w="100%" position="relative" zIndex={1}>
                          {unit.implemented ? (
                            <Box bg="whiteAlpha.300" borderRadius="full" px={2.5} py={0.5}>
                              <Text fontSize="xs" fontWeight="700" color="white">
                                {done > 0 ? `${done}問` : 'はじめて'}
                              </Text>
                            </Box>
                          ) : (
                            <Box bg={`${cat.unimplementedTextColor}15`} borderRadius="full" px={2.5} py={0.5}>
                              <Text fontSize="xs" fontWeight="600" color={cat.unimplementedTextColor} opacity={0.6}>
                                <R rt="じゅんび">準備</R>中
                              </Text>
                            </Box>
                          )}
                        </Flex>

                        {/* テキスト */}
                        <Box position="relative" zIndex={1}>
                          <Text
                            fontSize="xs"
                            color={unit.implemented ? 'whiteAlpha.800' : cat.unimplementedTextColor}
                            fontWeight="500"
                            opacity={unit.implemented ? 1 : 0.7}
                          >
                            {unit.icon}
                          </Text>
                          <Text
                            fontSize="sm"
                            fontWeight="700"
                            color={unit.implemented ? 'white' : cat.unimplementedTextColor}
                            mt={0.5}
                            lineHeight="1.3"
                          >
                            {unit.name}
                          </Text>

                          {unit.implemented && (
                            <Box
                              display="inline-block"
                              mt={2}
                              bg="white"
                              borderRadius="full"
                              px={3}
                              py={1}
                            >
                              <Text fontSize="xs" fontWeight="700" color="gray.700">
                                {done > 0 ? 'つづける' : 'はじめる'}
                              </Text>
                            </Box>
                          )}
                        </Box>
                      </chakra.button>
                    );
                  })}
                </SimpleGrid>
              </VStack>
            ))}

          </VStack>
        </Container>
      </Box>

      {/* タブバー */}
      <TabBar />
    </Flex>
  );
};
