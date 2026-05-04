/**
 * アイコンコンポーネント
 * 元素材: icooon-mono.com（商用利用可能・クレジット不要）
 * https://icooon-mono.com/license/
 */

interface IconProps {
  size?: number;
  color?: string;
}

export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill={color}>
    <path d="M256,28.2L0,296.3h64v187.5h160V336.3h64v147.5h160V296.3h64L256,28.2z" />
  </svg>
);

export const ProfileIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill={color}>
    <circle cx="256" cy="150" r="110" />
    <path d="M256,290c-130,0-220,70-220,150v44h440v-44C476,360,386,290,256,290z" />
  </svg>
);

export const DiceIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill={color}>
    <rect x="48" y="48" width="416" height="416" rx="48" ry="48" />
    <circle cx="160" cy="160" r="32" fill="white" />
    <circle cx="352" cy="160" r="32" fill="white" />
    <circle cx="256" cy="256" r="32" fill="white" />
    <circle cx="160" cy="352" r="32" fill="white" />
    <circle cx="352" cy="352" r="32" fill="white" />
  </svg>
);

export const RotationIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill={color}>
    <path d="M256,48C141.1,48,48,141.1,48,256c0,63.3,28.3,119.9,72.9,158.1l34-34C122.5,350.5,104,305.8,104,256
      c0-83.9,68.1-152,152-152c42,0,80,17.1,107.5,44.5L320,192h160V32L427.3,84.7C389.5,60.5,325.8,48,256,48z" />
    <path d="M256,464c114.9,0,208-93.1,208-208c0-63.3-28.3-119.9-72.9-158.1l-34,34C389.5,161.5,408,206.2,408,256
      c0,83.9-68.1,152-152,152c-42,0-80-17.1-107.5-44.5L192,320H32v160l52.7-52.7C122.5,451.5,186.2,464,256,464z" />
  </svg>
);

export const OverlayIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill={color}>
    <rect x="64" y="96" width="200" height="280" rx="16" opacity="0.6" />
    <rect x="248" y="136" width="200" height="280" rx="16" opacity="0.9" />
  </svg>
);

export const PuzzleIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill={color}>
    <path d="M432,272h-48c0-26.5-21.5-48-48-48s-48,21.5-48,48H192c-17.7,0-32,14.3-32,32v96c26.5,0,48,21.5,48,48
      s-21.5,48-48,48v64c0,17.7,14.3,32,32,32h240c17.7,0,32-14.3,32-32V448c-26.5,0-48-21.5-48-48s21.5-48,48-48V304
      C464,286.3,449.7,272,432,272z" transform="translate(-20,-80) scale(0.95)" />
  </svg>
);

export const ChartIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill={color}>
    <rect x="64" y="320" width="96" height="144" rx="8" />
    <rect x="208" y="208" width="96" height="256" rx="8" />
    <rect x="352" y="96" width="96" height="368" rx="8" />
  </svg>
);

export const PencilIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill={color}>
    <path d="M410.3,71.7l30,30c12.5,12.5,12.5,32.8,0,45.3L168,419.3L64,448l28.7-104L365,71.7
      C377.5,59.2,397.8,59.2,410.3,71.7z" />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill={color}>
    <path d="M256,38.5l66.9,135.5l149.5,21.7l-108.2,105.5l25.5,148.8L256,384.2L122.3,450l25.5-148.8L39.6,195.7
      l149.5-21.7L256,38.5z" />
  </svg>
);
