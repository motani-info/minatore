import { useState } from 'react';
import { Box, Container, Flex, Heading, Text, VStack, SimpleGrid } from '@chakra-ui/react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useProgress } from '../hooks/useProgress';
import { TabBar } from './TabBar';
import { R } from './Ruby';

/** 分野名マッピング */
const TYPE_NAMES: Record<string, { name: string; icon: string; color: string }> = {
  rotation: { name: '回転図形', icon: '🔄', color: '#7c3aed' },
  overlay: { name: '重ね図形', icon: '🔲', color: '#2563eb' },
  puzzle: { name: '図形パズル', icon: '🧩', color: '#ec4899' },
};

/** 正解率から★評価を返す（5段階） */
function getStars(rate: number): React.ReactNode {
  const filled = rate >= 80 ? 5 : rate >= 60 ? 4 : rate >= 40 ? 3 : rate >= 20 ? 2 : rate > 0 ? 1 : 0;
  return (
    <Flex gap={0.5}>
      {[...Array(5)].map((_, i) => (
        <Text key={i} fontSize="lg" color={i < filled ? '#fbbf24' : '#d1d5db'} lineHeight="1">
          {i < filled ? '★' : '☆'}
        </Text>
      ))}
    </Flex>
  );
}

export const HistoryScreen: React.FC = () => {
  const { progress, resetAll } = useProgress();
  const [showConfirm, setShowConfirm] = useState(false);

  const totalQuestions = progress
    ? Object.values(progress.byType).reduce((s, t) => s + t.totalQuestions, 0)
    : 0;
  const totalCorrect = progress
    ? Object.values(progress.byType).reduce((s, t) => s + t.correctAnswers, 0)
    : 0;
  const correctRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  /** 分野別データ（データがある分野のみ） */
  const typeEntries = progress
    ? Object.entries(progress.byType)
        .filter(([, v]) => v.totalQuestions > 0)
        .map(([key, v]) => {
          const meta = TYPE_NAMES[key] ?? { name: key, icon: '📝', color: '#6b7280' };
          const rate = v.totalQuestions > 0 ? Math.round((v.correctAnswers / v.totalQuestions) * 100) : 0;
          return { key, ...meta, ...v, rate };
        })
    : [];

  /** 棒グラフ用データ */
  const barData = typeEntries.map((e) => ({
    name: e.name,
    問題数: e.totalQuestions,
    正解数: e.correctAnswers,
  }));

  /** 円グラフ用データ */
  const pieData =
    totalQuestions > 0
      ? [
          { name: '正解', value: totalCorrect },
          { name: '不正解', value: totalQuestions - totalCorrect },
        ]
      : [];
  const PIE_COLORS = ['#34d399', '#fca5a5'];

  /** 日別グラフ用データ */
  const lineData = (progress?.dailyRecords ?? []).map((r) => ({
    date: r.date.slice(5).replace('-', '/'),
    問題数: r.totalQuestions,
    正解数: r.correctAnswers,
  }));

  /** 学習開始日フォーマット */
  const startedAtFormatted = progress?.startedAt
    ? new Date(progress.startedAt).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const handleReset = () => {
    resetAll();
    setShowConfirm(false);
  };

  return (
    <Flex direction="column" minH="100dvh">
      <Box flex={1}>
        <Container maxW="920px" py={{ base: 6, sm: 8 }} px={{ base: 5, sm: 6 }}>
          <VStack gap={7} align="stretch">

            {/* A. ヘッダー */}
            <Heading
              as="h1"
              fontSize={{ base: '2xl', sm: '3xl' }}
              fontWeight="800"
              color="gray.800"
              lineHeight="1.2"
            >
              <R rt="がくしゅう">学習</R><R rt="きろく">記録</R>
            </Heading>

            {/* B. 全体サマリーカード */}
            <Box
              bg="white"
              borderRadius="2xl"
              p={6}
              boxShadow="0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)"
            >
              {totalQuestions > 0 ? (
                <VStack gap={4} align="stretch">
                  <Text fontSize="sm" fontWeight="700" color="gray.600">トータル</Text>
                  <Flex gap={4} justify="center" flexWrap="wrap">
                    <Box flex={1} textAlign="center" minW="80px">
                      <Text fontSize={{ base: '2xl', sm: '4xl' }} fontWeight="800" color="gray.800">
                        {totalQuestions}
                      </Text>
                      <Text fontSize="xs" color="gray.400" fontWeight="600">
                        <R rt="もんだい">問題</R>数
                      </Text>
                    </Box>
                    <Box w="1px" bg="gray.100" />
                    <Box flex={1} textAlign="center" minW="80px">
                      <Text fontSize={{ base: '2xl', sm: '4xl' }} fontWeight="800" color="#34d399">
                        {totalCorrect}
                      </Text>
                      <Text fontSize="xs" color="gray.400" fontWeight="600">
                        <R rt="せいかい">正解</R>数
                      </Text>
                    </Box>
                    <Box w="1px" bg="gray.100" />
                    <Box flex={1} textAlign="center" minW="80px">
                      <Text fontSize={{ base: '2xl', sm: '4xl' }} fontWeight="800" color="#7c3aed">
                        {correctRate}%
                      </Text>
                      <Text fontSize="xs" color="gray.400" fontWeight="600">
                        <R rt="せいかい">正解</R><R rt="りつ">率</R>
                      </Text>
                    </Box>
                  </Flex>
                  <Flex justify="center">{getStars(correctRate)}</Flex>
                </VStack>
              ) : (
                <Text textAlign="center" color="gray.400" fontWeight="600" py={4}>
                  まだ<R rt="もんだい">問題</R>をといていません
                </Text>
              )}
            </Box>

            {/* 学習開始日 */}
            {startedAtFormatted && (
              <Text fontSize="sm" color="gray.500" fontWeight="600" textAlign="center">
                <R rt="がくしゅう">学習</R><R rt="かいし">開始</R>: {startedAtFormatted}
              </Text>
            )}

            {/* C. 正解率の円グラフ */}
            {totalQuestions > 0 && (
              <Box
                bg="white"
                borderRadius="2xl"
                p={6}
                boxShadow="0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)"
              >
                <Text fontSize="sm" fontWeight="700" color="gray.600" mb={4}>
                  <R rt="せいかい">正解</R><R rt="りつ">率</R>
                </Text>
                <Box position="relative" w="100%" h="220px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        stroke="none"
                      >
                        {pieData.map((_, idx) => (
                          <Cell key={idx} fill={PIE_COLORS[idx]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* 中央に正解率を表示 */}
                  <Flex
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    direction="column"
                    align="center"
                    pointerEvents="none"
                  >
                    <Text fontSize="3xl" fontWeight="800" color="gray.800" lineHeight="1">
                      {correctRate}%
                    </Text>
                    <Text fontSize="xs" color="gray.400" fontWeight="600">
                      <R rt="せいかい">正解</R><R rt="りつ">率</R>
                    </Text>
                  </Flex>
                </Box>
              </Box>
            )}

            {/* D. 分野別の棒グラフ */}
            {totalQuestions > 0 && barData.length > 0 && (
              <Box
                bg="white"
                borderRadius="2xl"
                p={6}
                boxShadow="0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)"
              >
                <Text fontSize="sm" fontWeight="700" color="gray.600" mb={4}>
                  <R rt="ぶんや">分野</R><R rt="べつ">別</R><R rt="せいせき">成績</R>
                </Text>
                <Box w="100%" h="250px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} />
                      <YAxis fontSize={12} tickLine={false} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="問題数" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="正解数" fill="#34d399" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            )}

            {/* E. 日別の学習グラフ */}
            {lineData.length > 0 && (
              <Box
                bg="white"
                borderRadius="2xl"
                p={6}
                boxShadow="0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)"
              >
                <Text fontSize="sm" fontWeight="700" color="gray.600" mb={4}>
                  日<R rt="べつ">別</R>の<R rt="がくしゅう">学習</R>
                </Text>
                <Box w="100%" h="250px">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" fontSize={12} tickLine={false} />
                      <YAxis fontSize={12} tickLine={false} allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="問題数" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="正解数" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            )}

            {/* F. 分野別の詳細カード */}
            {typeEntries.length > 0 && (
              <VStack gap={3} align="stretch">
                <Text fontSize="sm" fontWeight="700" color="gray.600">
                  <R rt="ぶんや">分野</R><R rt="べつ">別</R><R rt="くわ">詳</R>しく
                </Text>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                  {typeEntries.map((entry) => (
                    <Box
                      key={entry.key}
                      bg="white"
                      borderRadius="2xl"
                      p={5}
                      boxShadow="0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)"
                      borderLeft="4px solid"
                      borderColor={entry.color}
                    >
                      <Flex align="center" gap={3} mb={3}>
                        <Text fontSize="2xl" lineHeight="1">{entry.icon}</Text>
                        <Text fontSize="md" fontWeight="700" color="gray.800">
                          {entry.name}
                        </Text>
                      </Flex>
                      <Flex gap={4} mb={3}>
                        <Box>
                          <Text fontSize="xl" fontWeight="800" color="gray.800">
                            {entry.totalQuestions}
                          </Text>
                          <Text fontSize="xs" color="gray.400" fontWeight="600">
                            <R rt="もんだい">問題</R>数
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="xl" fontWeight="800" color="#34d399">
                            {entry.correctAnswers}
                          </Text>
                          <Text fontSize="xs" color="gray.400" fontWeight="600">
                            <R rt="せいかい">正解</R>数
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="xl" fontWeight="800" color={entry.color}>
                            {entry.rate}%
                          </Text>
                          <Text fontSize="xs" color="gray.400" fontWeight="600">
                            <R rt="せいかい">正解</R><R rt="りつ">率</R>
                          </Text>
                        </Box>
                      </Flex>
                      {getStars(entry.rate)}
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            )}

            {/* G. リセットボタン */}
            {totalQuestions > 0 && (
              <Flex justify="center" pt={2} pb={4}>
                <Box
                  as="button"
                  px={6}
                  py={3}
                  borderRadius="xl"
                  bg="red.50"
                  color="red.500"
                  fontWeight="700"
                  fontSize="sm"
                  border="1px solid"
                  borderColor="red.200"
                  cursor="pointer"
                  _hover={{ bg: 'red.100' }}
                  onClick={() => setShowConfirm(true)}
                >
                  <R rt="きろく">記録</R>をリセット
                </Box>
              </Flex>
            )}

          </VStack>
        </Container>
      </Box>

      {/* 確認ダイアログ */}
      {showConfirm && (
        <Flex
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.500"
          zIndex={1000}
          align="center"
          justify="center"
          onClick={() => setShowConfirm(false)}
        >
          <Box
            bg="white"
            borderRadius="2xl"
            p={6}
            mx={4}
            maxW="320px"
            w="100%"
            boxShadow="0 4px 24px rgba(0,0,0,0.15)"
            onClick={(e) => e.stopPropagation()}
          >
            <Text fontWeight="700" fontSize="md" color="gray.800" mb={5} textAlign="center">
              本当にリセットしますか？
            </Text>
            <Flex gap={3}>
              <Box
                as="button"
                flex={1}
                py={3}
                borderRadius="xl"
                bg="gray.100"
                color="gray.600"
                fontWeight="700"
                fontSize="sm"
                cursor="pointer"
                textAlign="center"
                _hover={{ bg: 'gray.200' }}
                onClick={() => setShowConfirm(false)}
              >
                やめる
              </Box>
              <Box
                as="button"
                flex={1}
                py={3}
                borderRadius="xl"
                bg="red.500"
                color="white"
                fontWeight="700"
                fontSize="sm"
                cursor="pointer"
                textAlign="center"
                _hover={{ bg: 'red.600' }}
                onClick={handleReset}
              >
                リセット
              </Box>
            </Flex>
          </Box>
        </Flex>
      )}

      {/* タブバー */}
      <TabBar />
    </Flex>
  );
};
