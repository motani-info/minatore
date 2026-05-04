import { Box, SimpleGrid } from '@chakra-ui/react';
import type { OddOneOutQuestionData, FigureDefinition, FigurePart } from '../types';

interface Props {
  data: OddOneOutQuestionData;
}

/** 図形パーツを描画 */
const PartRenderer: React.FC<{ part: FigurePart; cellSize: number }> = ({ part, cellSize }) => {
  const scale = cellSize / 100;

  if (part.type === 'rect') {
    return (
      <Box
        position="absolute"
        left={`${part.x}%`}
        top={`${part.y}%`}
        w={`${part.width}%`}
        h={`${part.height}%`}
        border="2px solid"
        borderColor={part.color}
        borderRadius="2px"
        transform={part.rotation ? `rotate(${part.rotation}deg)` : undefined}
      />
    );
  }

  if (part.type === 'circle') {
    return (
      <Box
        position="absolute"
        left={`${part.x}%`}
        top={`${part.y}%`}
        w={`${part.width}%`}
        h={`${part.height}%`}
        borderRadius="full"
        bg={part.color}
        transform={part.rotation ? `rotate(${part.rotation}deg)` : undefined}
      />
    );
  }

  // line
  return (
    <Box
      position="absolute"
      left={`${part.x}%`}
      top={`${part.y}%`}
      w={`${part.width}%`}
      h="2px"
      bg={part.color}
      transformOrigin="left center"
      transform={`rotate(${part.rotation ?? 0}deg)`}
    />
  );
};

/** 1つのセル（図形）を描画 */
const FigureCell: React.FC<{ figure: FigureDefinition; size: number }> = ({ figure, size }) => (
  <Box
    position="relative"
    w={`${size}px`}
    h={`${size}px`}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="md"
    overflow="hidden"
  >
    {figure.map((part, i) => (
      <PartRenderer key={i} part={part} cellSize={size} />
    ))}
  </Box>
);

export const OddOneOutQuestionDisplay: React.FC<Props> = ({ data }) => {
  const { baseFigure, mutatedFigure, gridSize, oddIndex } = data;
  const cellSize = gridSize === 3 ? 60 : 48;

  return (
    <SimpleGrid columns={gridSize} gap={1} w="fit-content" mx="auto">
      {Array.from({ length: gridSize * gridSize }).map((_, i) => (
        <FigureCell
          key={i}
          figure={i === oddIndex ? mutatedFigure : baseFigure}
          size={cellSize}
        />
      ))}
    </SimpleGrid>
  );
};
