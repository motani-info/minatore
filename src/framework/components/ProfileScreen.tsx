import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Flex, Heading, Text, VStack, chakra } from '@chakra-ui/react';
import { useProfile } from '../hooks/useProfile';
import { useProgress } from '../hooks/useProgress';
import { TabBar } from './TabBar';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateName, updateAvatar, removeAvatar } = useProfile();
  const { progress } = useProgress();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(profile.name);

  const totalQuestions = progress
    ? Object.values(progress.byType).reduce((s, t) => s + t.totalQuestions, 0)
    : 0;
  const totalCorrect = progress
    ? Object.values(progress.byType).reduce((s, t) => s + t.correctAnswers, 0)
    : 0;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await updateAvatar(file);
    }
    // リセットして同じファイルを再選択可能に
    e.target.value = '';
  };

  const handleNameSave = () => {
    updateName(nameValue.trim());
    setEditingName(false);
  };

  return (
    <Flex direction="column" minH="100dvh">
      <Box flex={1}>
        <Container maxW="460px" py={{ base: 6, sm: 8 }} px={{ base: 5, sm: 6 }}>
          <VStack gap={8} align="stretch">

            {/* ヘッダー */}
            <Flex align="center">
              <chakra.button
                type="button"
                onClick={() => navigate('/')}
                aria-label="もどる"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="40px"
                h="40px"
                fontSize="lg"
                color="gray.400"
                borderRadius="full"
                bg="white"
                boxShadow="0 1px 3px rgba(0,0,0,0.06)"
                transition="all 0.15s"
                _hover={{ color: 'gray.600' }}
                _active={{ transform: 'scale(0.95)' }}
                flexShrink={0}
              >
                ←
              </chakra.button>
              <Heading
                as="h1"
                fontSize="xl"
                fontWeight="700"
                color="gray.800"
                ml={3}
              >
                ぷろふぃーる
              </Heading>
            </Flex>

        {/* アバター */}
        <VStack gap={3}>
          <chakra.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="しゃしんをえらぶ"
            position="relative"
            w="100px"
            h="100px"
            borderRadius="full"
            overflow="hidden"
            bg="gray.100"
            border="3px solid"
            borderColor="white"
            boxShadow="0 4px 16px rgba(0,0,0,0.08)"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ boxShadow: '0 6px 24px rgba(0,0,0,0.12)' }}
            _active={{ transform: 'scale(0.97)' }}
            flexShrink={0}
          >
            {profile.avatarUrl ? (
              <chakra.img
                src={profile.avatarUrl}
                alt="あばたー"
                w="100%"
                h="100%"
                objectFit="cover"
              />
            ) : (
              <Flex
                align="center"
                justify="center"
                w="100%"
                h="100%"
                fontSize="40px"
                color="gray.300"
              >
                👤
              </Flex>
            )}
            {/* カメラオーバーレイ */}
            <Flex
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              h="28px"
              bg="blackAlpha.500"
              align="center"
              justify="center"
            >
              <Text fontSize="xs" color="white">📷</Text>
            </Flex>
          </chakra.button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {profile.avatarUrl && (
            <chakra.button
              type="button"
              onClick={removeAvatar}
              fontSize="xs"
              color="red.400"
              fontWeight="600"
              _hover={{ color: 'red.500' }}
              minH="44px"
            >
              しゃしんをけす
            </chakra.button>
          )}
        </VStack>

        {/* 名前 */}
        <Box
          bg="white"
          borderRadius="2xl"
          p={5}
          boxShadow="0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)"
        >
          <Text fontSize="xs" color="gray.400" fontWeight="600" mb={3}>
            なまえ
          </Text>
          {editingName ? (
            <Flex gap={2}>
              <chakra.input
                type="text"
                value={nameValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNameValue(e.target.value)}
                placeholder="なまえをいれてね"
                flex={1}
                px={4}
                py={2.5}
                fontSize="md"
                fontWeight="600"
                color="gray.800"
                bg="gray.50"
                border="2px solid"
                borderColor="purple.300"
                borderRadius="xl"
                outline="none"
                _focus={{ borderColor: 'purple.500' }}
                autoFocus
                maxLength={20}
              />
              <chakra.button
                type="button"
                onClick={handleNameSave}
                px={5}
                py={2.5}
                fontSize="sm"
                fontWeight="700"
                color="white"
                bg="linear-gradient(135deg, #7c6cf0, #9b8afb)"
                borderRadius="xl"
                _hover={{ opacity: 0.9 }}
                _active={{ transform: 'scale(0.97)' }}
                minH="44px"
              >
                ほぞん
              </chakra.button>
            </Flex>
          ) : (
            <Flex align="center" justify="space-between">
              <Text fontSize="lg" fontWeight="700" color="gray.800">
                {profile.name || 'まだせっていされていません'}
              </Text>
              <chakra.button
                type="button"
                onClick={() => {
                  setNameValue(profile.name);
                  setEditingName(true);
                }}
                px={4}
                py={2}
                fontSize="sm"
                fontWeight="600"
                color="purple.500"
                bg="purple.50"
                borderRadius="lg"
                _hover={{ bg: 'purple.100' }}
                _active={{ transform: 'scale(0.97)' }}
                minH="44px"
              >
                へんこう
              </chakra.button>
            </Flex>
          )}
        </Box>

        {/* 学習スタッツ */}
        <Box
          bg="white"
          borderRadius="2xl"
          p={5}
          boxShadow="0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)"
        >
          <Text fontSize="xs" color="gray.400" fontWeight="600" mb={4}>
            がくしゅうきろく
          </Text>
          <Flex gap={4}>
            <Box flex={1} textAlign="center">
              <Text fontSize="2xl" fontWeight="800" color="gray.800">
                {totalQuestions}
              </Text>
              <Text fontSize="xs" color="gray.400" fontWeight="500">
                といたかず
              </Text>
            </Box>
            <Box w="1px" bg="gray.100" />
            <Box flex={1} textAlign="center">
              <Text fontSize="2xl" fontWeight="800" color="green.500">
                {totalCorrect}
              </Text>
              <Text fontSize="xs" color="gray.400" fontWeight="500">
                せいかい
              </Text>
            </Box>
            <Box w="1px" bg="gray.100" />
            <Box flex={1} textAlign="center">
              <Text fontSize="2xl" fontWeight="800" color="purple.500">
                {totalQuestions > 0 ? `${Math.round((totalCorrect / totalQuestions) * 100)}%` : '—'}
              </Text>
              <Text fontSize="xs" color="gray.400" fontWeight="500">
                せいかいりつ
              </Text>
            </Box>
          </Flex>
        </Box>

          </VStack>
        </Container>
      </Box>

      {/* タブバー */}
      <TabBar />
    </Flex>
  );
};
