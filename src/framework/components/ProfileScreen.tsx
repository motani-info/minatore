import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Flex, Heading, SimpleGrid, Text, VStack, chakra } from '@chakra-ui/react';
import { useProfile } from '../hooks/useProfile';
import { TabBar } from './TabBar';
import { R } from './Ruby';
import { ProfileIcon } from '../../assets/icons';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateName, updateAvatar, removeAvatar, updateAge } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(profile.name);
  const [editingAge, setEditingAge] = useState(false);

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

  const handleAgeSelect = (age: number) => {
    updateAge(age);
    setEditingAge(false);
  };

  return (
    <Flex direction="column" minH="100dvh">
      <Box flex={1}>
        <Container maxW="920px" py={{ base: 6, sm: 8 }} px={{ base: 5, sm: 6 }}>
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
                プロフィール
              </Heading>
            </Flex>

        {/* アバター */}
        <VStack gap={3}>
          <chakra.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="写真をえらぶ"
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
                color="gray.300"
              >
                <ProfileIcon size={48} color="#d1d5db" />
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
              <R rt="しゃしん">写真</R>をけす
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
            名前
          </Text>
          {editingName ? (
            <Flex gap={2}>
              <chakra.input
                type="text"
                value={nameValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNameValue(e.target.value)}
                placeholder="名前を入れてね"
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
                <R rt="ほぞん">保存</R>
              </chakra.button>
            </Flex>
          ) : (
            <Flex align="center" justify="space-between">
              <Text fontSize="lg" fontWeight="700" color="gray.800">
                {profile.name || <>せっていしてね</>}
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
                <R rt="へんこう">変更</R>
              </chakra.button>
            </Flex>
          )}
        </Box>

        {/* 年齢 */}
        <Box
          bg="white"
          borderRadius="2xl"
          p={5}
          boxShadow="0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)"
        >
          <Text fontSize="xs" color="gray.400" fontWeight="600" mb={3}>
            <R rt="ねんれい">年齢</R>
          </Text>
          {editingAge ? (
            <VStack gap={4} align="stretch">
              <Text fontSize="sm" color="gray.600" fontWeight="600" textAlign="center">
                <R rt="ねんれい">年齢</R>をえらんでね
              </Text>
              <SimpleGrid columns={3} gap={3}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((age) => (
                  <chakra.button
                    key={age}
                    type="button"
                    onClick={() => handleAgeSelect(age)}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    py={4}
                    bg={profile.age === age ? 'purple.50' : 'gray.50'}
                    border="2.5px solid"
                    borderColor={profile.age === age ? 'purple.400' : '#e5e7eb'}
                    borderRadius="2xl"
                    cursor="pointer"
                    transition="all 0.2s ease"
                    _hover={{ borderColor: 'purple.300', bg: 'purple.50', transform: 'translateY(-2px)' }}
                    _active={{ transform: 'scale(0.95)' }}
                    minH="64px"
                  >
                    <Text fontSize="xl" fontWeight="800" color="gray.800">
                      {age}
                    </Text>
                    <Text fontSize="xs" color="gray.500" fontWeight="600">
                      さい
                    </Text>
                  </chakra.button>
                ))}
              </SimpleGrid>
              <chakra.button
                type="button"
                onClick={() => setEditingAge(false)}
                fontSize="sm"
                fontWeight="600"
                color="gray.400"
                _hover={{ color: 'gray.600' }}
                minH="44px"
              >
                キャンセル
              </chakra.button>
            </VStack>
          ) : (
            <Flex align="center" justify="space-between">
              <Text fontSize="lg" fontWeight="700" color="gray.800">
                {profile.age !== null ? <>{profile.age}<R rt="さい">歳</R></> : <>せっていしてね</>}
              </Text>
              <chakra.button
                type="button"
                onClick={() => setEditingAge(true)}
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
                <R rt="へんこう">変更</R>
              </chakra.button>
            </Flex>
          )}
        </Box>

          </VStack>
        </Container>
      </Box>

      {/* タブバー */}
      <TabBar />
    </Flex>
  );
};
