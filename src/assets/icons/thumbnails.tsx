/**
 * 問題タイプ別サムネイルアイコン
 * ホーム画面のカードに表示する、各問題タイプの内容を直感的に伝えるイラスト
 */

interface ThumbnailProps {
  size?: number;
}

/**
 * 回転図形 — 2×2グリッドと回転矢印
 */
export const RotationThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* 2×2 グリッド */}
    <rect x="20" y="30" width="24" height="24" rx="3" fill="white" opacity="0.9" />
    <rect x="46" y="30" width="24" height="24" rx="3" fill="white" opacity="0.4" />
    <rect x="20" y="56" width="24" height="24" rx="3" fill="white" opacity="0.4" />
    <rect x="46" y="56" width="24" height="24" rx="3" fill="white" opacity="0.9" />
    {/* 回転矢印 */}
    <path d="M78,40 A20,20 0 1,1 60,22" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
    <polygon points="60,16 60,28 52,22" fill="white" />
  </svg>
);

/**
 * 重ね図形 — 2枚の図形が重なるイメージ
 */
export const OverlayThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* 左の図形 */}
    <rect x="15" y="25" width="35" height="50" rx="4" fill="white" opacity="0.5" />
    <circle cx="32" cy="40" r="6" fill="white" opacity="0.8" />
    <circle cx="32" cy="60" r="6" fill="white" opacity="0.8" />
    {/* 右の図形 */}
    <rect x="50" y="25" width="35" height="50" rx="4" fill="white" opacity="0.5" />
    <circle cx="67" cy="40" r="6" fill="white" opacity="0.8" />
    <circle cx="67" cy="60" r="6" fill="white" opacity="0" stroke="white" strokeWidth="1.5" />
    {/* 矢印（折り重ね） */}
    <path d="M45,85 L55,85" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <polygon points="55,82 61,85 55,88" fill="white" />
    {/* 結果 */}
    <rect x="65" y="82" width="20" height="12" rx="2" fill="white" opacity="0.3" />
  </svg>
);

/**
 * 重ね図形（応用） — 3×3グリッドの重なり
 */
export const OverlayAdvancedThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* 左3×3 */}
    <rect x="10" y="30" width="12" height="12" rx="2" fill="white" opacity="0.3" />
    <rect x="24" y="30" width="12" height="12" rx="2" fill="white" opacity="0.9" />
    <rect x="10" y="44" width="12" height="12" rx="2" fill="white" opacity="0.9" />
    <rect x="24" y="44" width="12" height="12" rx="2" fill="white" opacity="0.3" />
    <rect x="10" y="58" width="12" height="12" rx="2" fill="white" opacity="0.9" />
    <rect x="24" y="58" width="12" height="12" rx="2" fill="white" opacity="0.3" />
    {/* プラス記号 */}
    <text x="42" y="55" fill="white" fontSize="16" fontWeight="bold" opacity="0.8">+</text>
    {/* 右3×3 */}
    <rect x="54" y="30" width="12" height="12" rx="2" fill="white" opacity="0.9" />
    <rect x="68" y="30" width="12" height="12" rx="2" fill="white" opacity="0.3" />
    <rect x="54" y="44" width="12" height="12" rx="2" fill="white" opacity="0.9" />
    <rect x="68" y="44" width="12" height="12" rx="2" fill="white" opacity="0.9" />
    <rect x="54" y="58" width="12" height="12" rx="2" fill="white" opacity="0.3" />
    <rect x="68" y="58" width="12" height="12" rx="2" fill="white" opacity="0.9" />
    {/* イコール */}
    <text x="84" y="55" fill="white" fontSize="14" fontWeight="bold" opacity="0.8">=</text>
  </svg>
);

/**
 * 重ね図形（図形） — 三角形と四角形の重なり
 */
export const OverlayShapeThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* 三角形 */}
    <polygon points="35,25 15,70 55,70" fill="white" opacity="0.5" stroke="white" strokeWidth="1.5" />
    {/* 四角形（重なり） */}
    <rect x="40" y="35" width="40" height="40" fill="white" opacity="0.4" stroke="white" strokeWidth="1.5" />
    {/* プラス */}
    <text x="70" y="25" fill="white" fontSize="18" fontWeight="bold" opacity="0.7">+</text>
  </svg>
);

/**
 * 重ね図形（線） — ドットグリッド上の線
 */
export const LineOverlayThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* ドットグリッド 4×4 */}
    {[0, 1, 2, 3].map(row =>
      [0, 1, 2, 3].map(col => (
        <circle key={`${row}-${col}`} cx={25 + col * 18} cy={22 + row * 18} r="2.5" fill="white" opacity="0.5" />
      ))
    )}
    {/* 線A */}
    <line x1="25" y1="22" x2="61" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
    <line x1="43" y1="22" x2="43" y2="58" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
    {/* プラス */}
    <text x="75" y="50" fill="white" fontSize="14" fontWeight="bold" opacity="0.7">+</text>
    {/* 線B（小さく） */}
    <line x1="78" y1="58" x2="90" y2="72" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
  </svg>
);

/**
 * 図形パズル — ピースを組み合わせるイメージ
 */
export const PuzzleThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* お手本（完成形） */}
    <rect x="35" y="15" width="30" height="30" rx="3" fill="white" opacity="0.3" stroke="white" strokeWidth="1" strokeDasharray="3 2" />
    {/* ピースA */}
    <path d="M15,60 L15,80 L35,80 L35,70 L25,70 L25,60 Z" fill="white" opacity="0.8" />
    {/* ピースB */}
    <path d="M55,60 L55,70 L65,70 L65,80 L85,80 L85,60 Z" fill="white" opacity="0.8" />
    {/* 矢印（合体） */}
    <path d="M38,70 L48,70" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <polygon points="48,67 53,70 48,73" fill="white" opacity="0.7" />
    {/* イコール */}
    <text x="44" y="35" fill="white" fontSize="12" fontWeight="bold" opacity="0.6">=?</text>
  </svg>
);

/**
 * 折り重ね（相殺） — ○と×が打ち消し合うイメージ
 */
export const OverlayCancelThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* 左グリッド */}
    <rect x="10" y="30" width="16" height="16" rx="2" fill="white" opacity="0.2" stroke="white" strokeWidth="0.5" />
    <rect x="28" y="30" width="16" height="16" rx="2" fill="white" opacity="0.2" stroke="white" strokeWidth="0.5" />
    <rect x="10" y="48" width="16" height="16" rx="2" fill="white" opacity="0.2" stroke="white" strokeWidth="0.5" />
    <rect x="28" y="48" width="16" height="16" rx="2" fill="white" opacity="0.2" stroke="white" strokeWidth="0.5" />
    {/* ○ */}
    <circle cx="18" cy="38" r="5" fill="none" stroke="white" strokeWidth="2" />
    {/* × */}
    <line x1="32" y1="52" x2="40" y2="60" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="52" x2="32" y2="60" stroke="white" strokeWidth="2" strokeLinecap="round" />
    {/* 折り矢印 */}
    <path d="M48,50 C55,50 55,50 62,50" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    <polygon points="62,47 67,50 62,53" fill="white" opacity="0.7" />
    {/* 結果（相殺で空） */}
    <rect x="70" y="35" width="20" height="30" rx="3" fill="white" opacity="0.15" stroke="white" strokeWidth="1" strokeDasharray="2 2" />
    <text x="75" y="55" fill="white" fontSize="10" opacity="0.6">空</text>
  </svg>
);

/**
 * 異図形発見 — 1つだけ違う図形を見つける
 */
export const OddOneOutThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* 同じ図形（丸）×3 */}
    <circle cx="25" cy="40" r="12" fill="white" opacity="0.7" />
    <circle cx="55" cy="40" r="12" fill="white" opacity="0.7" />
    <circle cx="25" cy="70" r="12" fill="white" opacity="0.7" />
    {/* 違う図形（三角） */}
    <polygon points="55,58 43,82 67,82" fill="white" opacity="0.9" />
    {/* ？マーク */}
    <circle cx="55" cy="70" r="15" fill="none" stroke="white" strokeWidth="2" strokeDasharray="3 2" opacity="0.5" />
    {/* 虫眼鏡 */}
    <circle cx="82" cy="25" r="10" fill="none" stroke="white" strokeWidth="2.5" />
    <line x1="89" y1="32" x2="95" y2="38" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);


/**
 * 図形構成 — 複数の図形を組み合わせて形を作る
 */
export const ShapeCompositionThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* 完成形（大きな四角） */}
    <rect x="30" y="20" width="40" height="40" rx="3" fill="white" opacity="0.2" stroke="white" strokeWidth="1.5" strokeDasharray="4 2" />
    {/* パーツ */}
    <polygon points="15,70 15,90 35,90" fill="white" opacity="0.8" />
    <rect x="42" y="70" width="20" height="20" fill="white" opacity="0.8" />
    <polygon points="75,70 65,90 85,90" fill="white" opacity="0.8" />
    {/* 上向き矢印 */}
    <path d="M50,62 L50,55" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <polygon points="47,55 50,50 53,55" fill="white" opacity="0.6" />
  </svg>
);

/**
 * 比較（重さ） — シーソーのイメージ
 */
export const SeesawThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* 支点（三角） */}
    <polygon points="50,80 42,90 58,90" fill="white" opacity="0.7" />
    {/* シーソーの棒（傾き） */}
    <line x1="18" y1="55" x2="82" y2="70" stroke="white" strokeWidth="3" strokeLinecap="round" />
    {/* 左の物体（重い＝上がらない） */}
    <circle cx="22" cy="48" r="10" fill="white" opacity="0.8" />
    <text x="18" y="52" fill="currentColor" fontSize="10" opacity="0.6">🍎</text>
    {/* 右の物体（軽い＝上がる） */}
    <circle cx="78" cy="63" r="8" fill="white" opacity="0.6" />
    <text x="74" y="67" fill="currentColor" fontSize="9" opacity="0.6">🍊</text>
  </svg>
);

/**
 * 比較（水量） — コップの水量比較
 */
export const WaterVolumeThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* コップ1（多い） */}
    <path d="M15,30 L15,80 L38,80 L38,30 Z" fill="none" stroke="white" strokeWidth="2" opacity="0.7" />
    <rect x="16" y="45" width="21" height="34" fill="white" opacity="0.5" />
    {/* コップ2（少ない） */}
    <path d="M50,30 L50,80 L73,80 L73,30 Z" fill="none" stroke="white" strokeWidth="2" opacity="0.7" />
    <rect x="51" y="60" width="21" height="19" fill="white" opacity="0.5" />
    {/* 比較マーク */}
    <text x="78" y="60" fill="white" fontSize="20" fontWeight="bold" opacity="0.7">&gt;</text>
  </svg>
);

/**
 * 比較（長さ） — 線の長さ比較
 */
export const CompareLengthThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* 長い線 */}
    <line x1="15" y1="35" x2="85" y2="35" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
    {/* 短い線 */}
    <line x1="15" y1="55" x2="55" y2="55" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
    {/* もっと短い線 */}
    <line x1="15" y1="75" x2="40" y2="75" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
    {/* ○マーク（一番長い） */}
    <circle cx="90" cy="35" r="7" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
  </svg>
);

/**
 * 比較（ばね） — ばねの伸びで重さ比較
 */
export const CompareSpringThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* 天井 */}
    <line x1="10" y1="15" x2="90" y2="15" stroke="white" strokeWidth="2" opacity="0.5" />
    {/* ばね1（短い＝軽い） */}
    <path d="M25,15 L25,20 L20,25 L30,30 L20,35 L30,40 L25,42" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7" />
    <rect x="18" y="42" width="14" height="10" rx="2" fill="white" opacity="0.6" />
    {/* ばね2（長い＝重い） */}
    <path d="M55,15 L55,20 L50,27 L60,34 L50,41 L60,48 L50,55 L60,62 L55,65" stroke="white" strokeWidth="1.5" fill="none" opacity="0.9" />
    <rect x="48" y="65" width="14" height="14" rx="2" fill="white" opacity="0.8" />
    {/* 重さマーク */}
    <text x="75" y="55" fill="white" fontSize="10" opacity="0.7">重</text>
    <path d="M80,60 L80,75" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <polygon points="77,75 80,80 83,75" fill="white" opacity="0.5" />
  </svg>
);

/**
 * 比較（広さ） — グリッドの塗り面積比較
 */
export const AreaCompareThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* グリッドA（広い） */}
    <rect x="10" y="25" width="12" height="12" fill="white" opacity="0.8" />
    <rect x="24" y="25" width="12" height="12" fill="white" opacity="0.8" />
    <rect x="38" y="25" width="12" height="12" fill="white" opacity="0.8" />
    <rect x="10" y="39" width="12" height="12" fill="white" opacity="0.8" />
    <rect x="24" y="39" width="12" height="12" fill="white" opacity="0.8" />
    <rect x="10" y="53" width="12" height="12" fill="white" opacity="0.3" />
    <rect x="24" y="53" width="12" height="12" fill="white" opacity="0.3" />
    <rect x="38" y="39" width="12" height="12" fill="white" opacity="0.3" />
    <rect x="38" y="53" width="12" height="12" fill="white" opacity="0.3" />
    {/* グリッドB（狭い） */}
    <rect x="60" y="25" width="12" height="12" fill="white" opacity="0.8" />
    <rect x="74" y="25" width="12" height="12" fill="white" opacity="0.8" />
    <rect x="60" y="39" width="12" height="12" fill="white" opacity="0.3" />
    <rect x="74" y="39" width="12" height="12" fill="white" opacity="0.3" />
    <rect x="60" y="53" width="12" height="12" fill="white" opacity="0.3" />
    <rect x="74" y="53" width="12" height="12" fill="white" opacity="0.3" />
    {/* 比較 ○ on left */}
    <circle cx="30" cy="78" r="7" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
    {/* × on right */}
    <line x1="64" y1="72" x2="76" y2="84" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <line x1="76" y1="72" x2="64" y2="84" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

/**
 * 図形と数カルタ — カードに図形と数字
 */
export const ShapeKartaThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* カード1 */}
    <rect x="10" y="20" width="35" height="50" rx="4" fill="white" opacity="0.3" stroke="white" strokeWidth="1" />
    <circle cx="20" cy="35" r="5" fill="white" opacity="0.8" />
    <circle cx="35" cy="35" r="5" fill="white" opacity="0.8" />
    <polygon points="27,48 22,58 32,58" fill="white" opacity="0.8" />
    {/* カード2 */}
    <rect x="55" y="20" width="35" height="50" rx="4" fill="white" opacity="0.3" stroke="white" strokeWidth="1" />
    <rect x="63" y="30" width="8" height="8" fill="white" opacity="0.8" />
    <rect x="77" y="30" width="8" height="8" fill="white" opacity="0.8" />
    <circle cx="72" cy="52" r="5" fill="white" opacity="0.8" />
    {/* 指差し */}
    <text x="40" y="88" fill="white" fontSize="10" opacity="0.7">👆</text>
  </svg>
);

/**
 * 文字数あつまり — 単語の文字数とグループ
 */
export const SyllableCountThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* 単語ボックス */}
    <rect x="25" y="15" width="50" height="22" rx="11" fill="white" opacity="0.3" stroke="white" strokeWidth="1.5" />
    <text x="35" y="30" fill="white" fontSize="11" fontWeight="bold" opacity="0.9">りんご</text>
    {/* 3文字 → 3人グループ */}
    <text x="15" y="58" fill="white" fontSize="8" opacity="0.6">3もじ</text>
    {/* 人アイコン×3 */}
    <circle cx="30" cy="72" r="5" fill="white" opacity="0.7" />
    <circle cx="50" cy="72" r="5" fill="white" opacity="0.7" />
    <circle cx="70" cy="72" r="5" fill="white" opacity="0.7" />
    <line x1="30" y1="78" x2="30" y2="88" stroke="white" strokeWidth="1.5" opacity="0.7" />
    <line x1="50" y1="78" x2="50" y2="88" stroke="white" strokeWidth="1.5" opacity="0.7" />
    <line x1="70" y1="78" x2="70" y2="88" stroke="white" strokeWidth="1.5" opacity="0.7" />
  </svg>
);

/**
 * 1対1対応 — 2種類のアイテムの対応
 */
export const OneToOneThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* 上段: ひよこ */}
    <circle cx="20" cy="30" r="8" fill="white" opacity="0.8" />
    <circle cx="45" cy="30" r="8" fill="white" opacity="0.8" />
    <circle cx="70" cy="30" r="8" fill="white" opacity="0.8" />
    {/* 対応線 */}
    <line x1="20" y1="40" x2="20" y2="55" stroke="white" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
    <line x1="45" y1="40" x2="45" y2="55" stroke="white" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
    <line x1="70" y1="40" x2="70" y2="55" stroke="white" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
    {/* 下段: 巣（2つだけ＝1つ足りない） */}
    <rect x="12" y="60" width="16" height="12" rx="6" fill="white" opacity="0.6" />
    <rect x="37" y="60" width="16" height="12" rx="6" fill="white" opacity="0.6" />
    <rect x="62" y="60" width="16" height="12" rx="6" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.4" />
    {/* 「？」 */}
    <text x="65" y="70" fill="white" fontSize="10" fontWeight="bold" opacity="0.7">?</text>
    {/* 余り表示 */}
    <text x="25" y="90" fill="white" fontSize="9" opacity="0.6">あまり 1</text>
  </svg>
);

/**
 * 回転図形（応用） — シンボル付き2×2グリッドの回転
 */
export const SymbolRotationThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* 2×2 グリッド枠 */}
    <rect x="18" y="28" width="26" height="26" rx="3" fill="white" opacity="0.2" stroke="white" strokeWidth="1" />
    <rect x="46" y="28" width="26" height="26" rx="3" fill="white" opacity="0.2" stroke="white" strokeWidth="1" />
    <rect x="18" y="56" width="26" height="26" rx="3" fill="white" opacity="0.2" stroke="white" strokeWidth="1" />
    <rect x="46" y="56" width="26" height="26" rx="3" fill="white" opacity="0.2" stroke="white" strokeWidth="1" />
    {/* シンボル */}
    <circle cx="31" cy="41" r="7" fill="white" opacity="0.8" />
    <polygon points="59,34 53,48 65,48" fill="white" opacity="0.8" />
    <rect x="25" y="63" width="12" height="12" fill="white" opacity="0.8" />
    {/* ♠ */}
    <text x="53" y="74" fill="white" fontSize="14" opacity="0.8">♠</text>
    {/* 回転矢印 */}
    <path d="M80,35 A18,18 0 1,1 65,20" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
    <polygon points="65,15 65,25 58,20" fill="white" opacity="0.7" />
  </svg>
);

/**
 * 回転図形（連続） — 連続回転のイメージ
 */
export const RotationSequenceThumbnail: React.FC<ThumbnailProps> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* 3つの小さなグリッド（連続変化） */}
    {/* グリッド1 */}
    <rect x="8" y="35" width="10" height="10" rx="1" fill="white" opacity="0.9" />
    <rect x="20" y="35" width="10" height="10" rx="1" fill="white" opacity="0.3" />
    <rect x="8" y="47" width="10" height="10" rx="1" fill="white" opacity="0.3" />
    <rect x="20" y="47" width="10" height="10" rx="1" fill="white" opacity="0.9" />
    {/* 矢印1 */}
    <path d="M33,47 L38,47" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <polygon points="38,45 42,47 38,49" fill="white" opacity="0.6" />
    {/* グリッド2 */}
    <rect x="44" y="35" width="10" height="10" rx="1" fill="white" opacity="0.3" />
    <rect x="56" y="35" width="10" height="10" rx="1" fill="white" opacity="0.9" />
    <rect x="44" y="47" width="10" height="10" rx="1" fill="white" opacity="0.9" />
    <rect x="56" y="47" width="10" height="10" rx="1" fill="white" opacity="0.3" />
    {/* 矢印2 */}
    <path d="M69,47 L74,47" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <polygon points="74,45 78,47 74,49" fill="white" opacity="0.6" />
    {/* グリッド3（？） */}
    <rect x="80" y="35" width="10" height="10" rx="1" fill="white" opacity="0.15" stroke="white" strokeWidth="0.5" strokeDasharray="2 1" />
    <rect x="80" y="47" width="10" height="10" rx="1" fill="white" opacity="0.15" stroke="white" strokeWidth="0.5" strokeDasharray="2 1" />
    <text x="83" y="48" fill="white" fontSize="12" fontWeight="bold" opacity="0.8">?</text>
    {/* 回転矢印（上部） */}
    <path d="M55,20 A12,12 0 1,1 42,12" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
    <polygon points="42,8 42,16 36,12" fill="white" opacity="0.5" />
  </svg>
);
