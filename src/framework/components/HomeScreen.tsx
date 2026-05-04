import { useNavigate } from 'react-router-dom';
import { Box, Container, Flex, Heading, Text, VStack, SimpleGrid, chakra } from '@chakra-ui/react';
import { useProgress } from '../hooks/useProgress';
import { useProfile } from '../hooks/useProfile';
import { CATEGORIES } from '../categoryData';
import type { CategoryDef } from '../categoryData';
import { TabBar } from './TabBar';
import { R } from './Ruby';
import { RotationIcon, OverlayIcon, PuzzleIcon, DiceIcon, ProfileIcon } from '../../assets/icons';

/** SVGアイコンのマッピング（実装済み単元用） */
const UNIT_ICONS: Record<string, React.FC<{ size?: number; color?: string }>> = {
  rotation: RotationIcon,
  overlay: OverlayIcon,
  puzzle: PuzzleIcon,
};

/** カテゴリのアイコン */
const CATEGORY_ICONS: Record<string, string> = {
  shapes: '🔷',
  memory: '🧠',
  'math-reasoning': '🔢',
  writing: '✏️',
};

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { profile } = useProfile();

  const handleCategoryTap = (cat: CategoryDef) => {
    const hasImplemented = cat.units.some((u) => u.implemented);
    if (hasImplemented) {
      navigate(`/theme/${cat.id}`);
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

            {/* テーマカード一覧 */}
            <VStack gap={3} align="stretch">
              <Flex align="center" gap={2}>
                <Box w="4px" h="18px" bg="gray.600" borderRadius="full" />
                <Text fontSize="sm" fontWeight="700" color="gray.600">
                  テーマ
                </Text>
              </Flex>

              <SimpleGrid columns={2} gap={3}>
                {CATEGORIES.map((cat) => {
                  const implementedUnits = cat.units.filter((u) => u.implemented);
                  const hasImplemented = implementedUnits.length > 0;
                  const totalDone = implementedUnits.reduce(
                    (sum, u) => sum + (progress?.byType[u.id]?.totalQuestions ?? 0),
                    0,
                  );
                  const unitCount = implementedUnits.length;

                  // 代表アイコン（最初の実装済み単元）
                  const firstImpl = implementedUnits[0];
                  const IconComp = firstImpl ? UNIT_ICONS[firstImpl.id] : undefined;

                  return (
                    <chakra.button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryTap(cat)}
                      aria-label={cat.title}
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      p={4}
                      minH="140px"
                      bg={hasImplemented
                        ? `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}cc 100%)`
                        : cat.unimplementedGradient}
                      border={hasImplemented ? 'none' : '1px solid'}
                      borderColor={hasImplemented ? undefined : `${cat.unimplementedTextColor}22`}
                      borderRadius="2xl"
                      boxShadow={hasImplemented
                        ? '0 4px 16px rgba(0,0,0,0.1)'
                        : '0 1px 4px rgba(0,0,0,0.03)'}
                      cursor={hasImplemented ? 'pointer' : 'default'}
                      transition="all 0.2s ease"
                      _hover={hasImplemented ? {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
                      } : {}}
                      _active={hasImplemented ? { transform: 'scale(0.97)' } : {}}
                      textAlign="left"
                      position="relative"
                      overflow="hidden"
                      opacity={hasImplemented ? 1 : 0.85}
                    >
                      {/* 背景装飾 */}
                      {hasImplemented && (
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
                            opacity={0.25}
                            lineHeight="1"
                          >
                            {IconComp
                              ? <IconComp size={36} color="white" />
                              : <Text fontSize="36px">{CATEGORY_ICONS[cat.id] ?? '📚'}</Text>}
                          </Box>
                        </>
                      )}

                      {/* バッジ */}
                      <Flex justify="flex-end" w="100%" position="relative" zIndex={1}>
                        {hasImplemented ? (
                          <Box bg="whiteAlpha.300" borderRadius="full" px={2.5} py={0.5}>
                            <Text fontSize="xs" fontWeight="700" color="white">
                              {totalDone > 0 ? `${totalDone}問` : `${unitCount}種類`}
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
                          fontSize="xl"
                          fontWeight="800"
                          color={hasImplemented ? 'white' : cat.unimplementedTextColor}
                          lineHeight="1.3"
                        >
                          {cat.title}
                        </Text>
                        {hasImplemented && (
                          <Text fontSize="xs" fontWeight="500" color="whiteAlpha.700" mt={1}>
                            {unitCount}つの<R rt="もんだい">問題</R>タイプ
                          </Text>
                        )}
                        {hasImplemented && (
                          <Box
                            display="inline-block"
                            mt={2}
                            bg="white"
                            borderRadius="full"
                            px={3}
                            py={1}
                          >
                            <Text fontSize="xs" fontWeight="700" color="gray.700">
                              {totalDone > 0 ? 'つづける' : 'はじめる'}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    </chakra.button>
                  );
                })}
              </SimpleGrid>
            </VStack>

          </VStack>
        </Container>
      </Box>

      {/* タブバー */}
      <TabBar />
    </Flex>
  );
};
