/**
 * カテゴリ・単元の定義データ
 * HomeScreen と ThemeScreen で共有する
 */

/** 単元定義 */
export interface UnitDef {
  id: string;
  name: string;
  icon: string;
  /** 実装済みの問題タイプIDと一致すれば遷移可能 */
  implemented: boolean;
  /** サブグループ名（同じ名前の単元はグループ化される） */
  group?: string;
  /** グループ内のサブラベル（基本/応用など） */
  subLabel?: string;
}

/** カテゴリ定義 */
export interface CategoryDef {
  id: string;
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

/** タブ定義（テーマ画面で使用） */
export interface TabDef {
  /** タブのラベル */
  label: string;
  /** タブに含まれる単元 */
  units: UnitDef[];
  /** タブの色 */
  color: string;
  /** タブのグラデーション */
  gradient: string;
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'shapes',
    title: '図形',
    color: '#7c3aed',
    implementedGradients: {
      rotation: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
      'symbol-rotation': 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)',
      'rotation-sequence': 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',
      overlay: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
      'overlay-advanced': 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
      'overlay-shape': 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
      'line-overlay': 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
      'line-decompose': 'linear-gradient(135deg, #1e3a5f 0%, #4f46e5 100%)',
      puzzle: 'linear-gradient(135deg, #ec4899 0%, #f9a8d4 100%)',
      'overlay-cancel': 'linear-gradient(135deg, #0891b2 0%, #67e8f9 100%)',
      'overlay-cancel-3x3': 'linear-gradient(135deg, #0e7490 0%, #22d3ee 100%)',
      'overlay-cancel-4x4': 'linear-gradient(135deg, #155e75 0%, #06b6d4 100%)',
      'overlay-compose': 'linear-gradient(135deg, #0369a1 0%, #38bdf8 100%)',
      'shape-composition': 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
    },
    unimplementedGradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
    unimplementedTextColor: '#7c3aed',
    units: [
      { id: 'rotation', name: '回転図形', icon: '🔄', implemented: true, group: '回転図形', subLabel: '基本' },
      { id: 'symbol-rotation', name: '回転図形', icon: '🎯', implemented: true, group: '回転図形', subLabel: '応用' },
      { id: 'rotation-sequence', name: '回転図形', icon: '🔄', implemented: true, group: '回転図形', subLabel: '連続' },
      { id: 'overlay', name: '重ね図形', icon: '🔲', implemented: true, group: '重ね図形', subLabel: '基本' },
      { id: 'overlay-advanced', name: '重ね図形', icon: '🔲', implemented: true, group: '重ね図形', subLabel: '応用' },
      { id: 'overlay-shape', name: '重ね図形', icon: '🔲', implemented: true, group: '重ね図形', subLabel: '図形' },
      { id: 'line-overlay', name: '重ね図形', icon: '📐', implemented: true, group: '重ね図形', subLabel: '線' },
      { id: 'line-decompose', name: '重ね図形', icon: '📐', implemented: true, group: '重ね図形', subLabel: '分解' },
      { id: 'overlay-cancel', name: '折り重ね', icon: '🔲', implemented: true, group: '折り重ね', subLabel: '相殺' },
      { id: 'overlay-cancel-3x3', name: '折り重ね', icon: '🔲', implemented: true, group: '折り重ね', subLabel: '相殺 3×3' },
      { id: 'overlay-cancel-4x4', name: '折り重ね', icon: '🔲', implemented: true, group: '折り重ね', subLabel: '相殺 4×4' },
      { id: 'overlay-compose', name: '折り重ね', icon: '🔲', implemented: true, group: '折り重ね', subLabel: '合成' },
      { id: 'puzzle', name: '図形構成', icon: '🧩', implemented: true, group: '図形構成', subLabel: '基本' },
      { id: 'shape-composition', name: '図形構成', icon: '🧩', implemented: true, group: '図形構成', subLabel: '応用' },
      { id: 'position', name: '位置の移動', icon: '➡️', implemented: false },
      { id: 'perspective', name: '四方観察', icon: '👀', implemented: false },
      { id: 'copy', name: '模写', icon: '✏️', implemented: false },
      { id: 'mirror', name: '鏡図形', icon: '🪞', implemented: false },
      { id: 'sequence', name: '系列完成', icon: '🔢', implemented: false },
    ],
  },
  {
    id: 'math-reasoning',
    title: '数量・推理',
    color: '#059669',
    implementedGradients: {
      seesaw: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
      'water-volume': 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
      'compare-length': 'linear-gradient(135deg, #0d9488 0%, #5eead4 100%)',
      'compare-spring': 'linear-gradient(135deg, #047857 0%, #6ee7b7 100%)',
      'area-compare': 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
      'shape-karta': 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
      'syllable-count': 'linear-gradient(135deg, #7c3aed 0%, #c4b5fd 100%)',
      'one-to-one': 'linear-gradient(135deg, #0284c7 0%, #7dd3fc 100%)',
    },
    unimplementedGradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    unimplementedTextColor: '#059669',
    units: [
      { id: 'compare-length', name: '比較', icon: '📏', implemented: true, group: '比較', subLabel: '長さ' },
      { id: 'area-compare', name: '比較', icon: '⬛', implemented: true, group: '比較', subLabel: '広さ' },
      { id: 'water-volume', name: '比較', icon: '💧', implemented: true, group: '比較', subLabel: '水量' },
      { id: 'seesaw', name: '比較', icon: '⚖️', implemented: true, group: '比較', subLabel: '重さ' },
      { id: 'compare-spring', name: '比較', icon: '🔩', implemented: true, group: '比較', subLabel: 'ばね' },
      { id: 'shape-karta', name: '図形と数カルタ', icon: '🎴', implemented: true },
      { id: 'syllable-count', name: '文字数あつまり', icon: '🔤', implemented: true },
      { id: 'one-to-one', name: '1対1対応', icon: '🐤', implemented: true },
      { id: 'counting', name: '数', icon: '🔢', implemented: false },
      { id: 'science', name: '理科的常識', icon: '🔬', implemented: false },
      { id: 'reasoning', name: '推理', icon: '🧠', implemented: false },
      { id: 'elimination', name: '選択抹消', icon: '✂️', implemented: false },
    ],
  },
];

/** カテゴリIDからカテゴリ定義を取得する */
export function getCategoryById(id: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

/**
 * カテゴリの実装済み単元からタブ定義を生成する
 * グループ化された単元は1つのタブにまとめ、サブタブとして扱う
 */
export function buildTabsForCategory(category: CategoryDef): TabDef[] {
  const tabs: TabDef[] = [];
  const seenGroups = new Set<string>();
  const implementedUnits = category.units.filter((u) => u.implemented);

  for (const unit of implementedUnits) {
    if (unit.group) {
      if (seenGroups.has(unit.group)) continue;
      seenGroups.add(unit.group);
      const grouped = implementedUnits.filter((u) => u.group === unit.group);
      tabs.push({
        label: unit.group,
        units: grouped,
        color: category.color,
        gradient: category.implementedGradients[unit.id]
          ?? `linear-gradient(135deg, ${category.color} 0%, ${category.color}88 100%)`,
      });
    } else {
      tabs.push({
        label: unit.name,
        units: [unit],
        color: category.color,
        gradient: category.implementedGradients[unit.id]
          ?? `linear-gradient(135deg, ${category.color} 0%, ${category.color}88 100%)`,
      });
    }
  }

  return tabs;
}
