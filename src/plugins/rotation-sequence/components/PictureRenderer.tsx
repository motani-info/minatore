import type { PictureType } from '../types';

interface Props {
  pictureType: PictureType;
  size: number | string;
}

/**
 * 各絵の種類に対応するSVG描画
 * 非対称な絵で回転が分かりやすいデザイン
 */
export const PictureRenderer: React.FC<Props> = ({ pictureType, size }) => {
  switch (pictureType) {
    case 'frog':
      return <FrogPicture size={size} />;
    case 'elephant':
      return <ElephantPicture size={size} />;
    case 'squirrel':
      return <SquirrelPicture size={size} />;
    case 'dots':
      return <DotsPicture size={size} />;
    case 'umbrella':
      return <UmbrellaPicture size={size} />;
    case 'boat':
      return <BoatPicture size={size} />;
    case 'pencil':
      return <PencilPicture size={size} />;
    case 'star-flower':
      return <StarFlowerPicture size={size} />;
  }
};

/** カエル: 上向きに座っている */
const FrogPicture: React.FC<{ size: number | string }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    {/* 体 */}
    <ellipse cx="30" cy="35" rx="14" ry="12" fill="#4ade80" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* 頭 */}
    <circle cx="30" cy="20" r="10" fill="#4ade80" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* 目（左） */}
    <circle cx="24" cy="14" r="5" fill="white" stroke="#1a1a1a" strokeWidth="1" />
    <circle cx="24" cy="14" r="2" fill="#1a1a1a" />
    {/* 目（右） */}
    <circle cx="36" cy="14" r="5" fill="white" stroke="#1a1a1a" strokeWidth="1" />
    <circle cx="36" cy="14" r="2" fill="#1a1a1a" />
    {/* 口 */}
    <path d="M 24 24 Q 30 28 36 24" fill="none" stroke="#1a1a1a" strokeWidth="1" />
    {/* 前足 */}
    <ellipse cx="20" cy="42" rx="5" ry="3" fill="#4ade80" stroke="#1a1a1a" strokeWidth="1" />
    <ellipse cx="40" cy="42" rx="5" ry="3" fill="#4ade80" stroke="#1a1a1a" strokeWidth="1" />
  </svg>
);

/** ゾウ: 右向き */
const ElephantPicture: React.FC<{ size: number | string }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    {/* 体 */}
    <ellipse cx="28" cy="32" rx="16" ry="12" fill="#9ca3af" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* 頭 */}
    <circle cx="44" cy="24" r="9" fill="#9ca3af" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* 耳 */}
    <ellipse cx="38" cy="22" rx="5" ry="7" fill="#6b7280" stroke="#1a1a1a" strokeWidth="1" />
    {/* 目 */}
    <circle cx="47" cy="22" r="2" fill="#1a1a1a" />
    {/* 鼻 */}
    <path d="M 52 26 Q 56 32 54 40 Q 52 44 50 42" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
    {/* 足 */}
    <rect x="18" y="40" width="5" height="12" rx="2" fill="#9ca3af" stroke="#1a1a1a" strokeWidth="1" />
    <rect x="28" y="40" width="5" height="12" rx="2" fill="#9ca3af" stroke="#1a1a1a" strokeWidth="1" />
    <rect x="35" y="40" width="5" height="10" rx="2" fill="#9ca3af" stroke="#1a1a1a" strokeWidth="1" />
    {/* しっぽ */}
    <path d="M 12 30 Q 8 28 10 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** リス: 右向き、大きなしっぽ */
const SquirrelPicture: React.FC<{ size: number | string }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    {/* しっぽ（大きい） */}
    <path d="M 15 20 Q 5 10 10 25 Q 8 35 15 40 Q 20 42 22 38" fill="#d97706" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* 体 */}
    <ellipse cx="32" cy="35" rx="10" ry="12" fill="#f59e0b" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* 頭 */}
    <circle cx="42" cy="22" r="8" fill="#f59e0b" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* 耳 */}
    <path d="M 38 14 L 40 8 L 43 14" fill="#f59e0b" stroke="#1a1a1a" strokeWidth="1" />
    {/* 目 */}
    <circle cx="45" cy="20" r="2" fill="#1a1a1a" />
    {/* 鼻 */}
    <circle cx="49" cy="23" r="1.5" fill="#1a1a1a" />
    {/* 前足 */}
    <ellipse cx="38" cy="42" rx="3" ry="4" fill="#f59e0b" stroke="#1a1a1a" strokeWidth="1" />
    {/* 後足 */}
    <ellipse cx="28" cy="46" rx="4" ry="3" fill="#f59e0b" stroke="#1a1a1a" strokeWidth="1" />
  </svg>
);

/** ドット: 非対称な配置（左上に3つ、右下に1つ） */
const DotsPicture: React.FC<{ size: number | string }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    {/* 左上エリアに3つの黒丸 */}
    <circle cx="18" cy="18" r="6" fill="#1a1a1a" />
    <circle cx="35" cy="15" r="6" fill="#1a1a1a" />
    <circle cx="20" cy="35" r="6" fill="#1a1a1a" />
    {/* 右下に1つの白丸（枠付き） */}
    <circle cx="42" cy="42" r="6" fill="white" stroke="#1a1a1a" strokeWidth="2" />
  </svg>
);

/** 傘: 上向き */
const UmbrellaPicture: React.FC<{ size: number | string }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    {/* 傘の部分 */}
    <path d="M 10 30 Q 10 10 30 10 Q 50 10 50 30 Z" fill="#3b82f6" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* 傘の模様 */}
    <path d="M 20 30 Q 20 18 30 14" fill="none" stroke="#1a1a1a" strokeWidth="1" />
    <path d="M 40 30 Q 40 18 30 14" fill="none" stroke="#1a1a1a" strokeWidth="1" />
    {/* 柄 */}
    <line x1="30" y1="30" x2="30" y2="50" stroke="#1a1a1a" strokeWidth="2" />
    {/* 持ち手（J字） */}
    <path d="M 30 50 Q 30 55 26 55 Q 22 55 22 52" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** 船: 右向き */
const BoatPicture: React.FC<{ size: number | string }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    {/* 帆 */}
    <polygon points="30,10 30,38 48,38" fill="white" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* マスト */}
    <line x1="30" y1="10" x2="30" y2="42" stroke="#1a1a1a" strokeWidth="2" />
    {/* 船体 */}
    <path d="M 12 42 L 48 42 L 44 52 L 16 52 Z" fill="#ef4444" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* 旗 */}
    <polygon points="30,10 30,16 24,13" fill="#ef4444" stroke="#1a1a1a" strokeWidth="0.5" />
  </svg>
);

/** 鉛筆: 右上向き */
const PencilPicture: React.FC<{ size: number | string }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    {/* 鉛筆本体（斜め） */}
    <rect x="18" y="26" width="32" height="8" rx="1" fill="#fbbf24" stroke="#1a1a1a" strokeWidth="1.5" transform="rotate(-30 34 30)" />
    {/* 先端 */}
    <polygon points="12,38 18,34 18,42" fill="#fde68a" stroke="#1a1a1a" strokeWidth="1" transform="rotate(-30 34 30)" />
    {/* 芯 */}
    <polygon points="10,39 14,37 14,41" fill="#1a1a1a" transform="rotate(-30 34 30)" />
    {/* 消しゴム部分 */}
    <rect x="48" y="26" width="6" height="8" rx="1" fill="#f87171" stroke="#1a1a1a" strokeWidth="1" transform="rotate(-30 34 30)" />
  </svg>
);

/** 星と花: 左上に星、右下に花 */
const StarFlowerPicture: React.FC<{ size: number | string }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    {/* 星（左上） */}
    <polygon
      points="20,8 23,16 31,16 25,21 27,29 20,25 13,29 15,21 9,16 17,16"
      fill="#fbbf24"
      stroke="#1a1a1a"
      strokeWidth="1"
    />
    {/* 花（右下） */}
    <circle cx="42" cy="42" r="4" fill="#f472b6" stroke="#1a1a1a" strokeWidth="0.5" />
    <circle cx="42" cy="34" r="4" fill="#f9a8d4" stroke="#1a1a1a" strokeWidth="0.5" />
    <circle cx="42" cy="50" r="4" fill="#f9a8d4" stroke="#1a1a1a" strokeWidth="0.5" />
    <circle cx="35" cy="38" r="4" fill="#f9a8d4" stroke="#1a1a1a" strokeWidth="0.5" />
    <circle cx="49" cy="38" r="4" fill="#f9a8d4" stroke="#1a1a1a" strokeWidth="0.5" />
    <circle cx="35" cy="46" r="4" fill="#f9a8d4" stroke="#1a1a1a" strokeWidth="0.5" />
    <circle cx="49" cy="46" r="4" fill="#f9a8d4" stroke="#1a1a1a" strokeWidth="0.5" />
    <circle cx="42" cy="42" r="3" fill="#fbbf24" />
  </svg>
);
