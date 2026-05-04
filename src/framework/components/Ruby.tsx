/**
 * ルビ（ふりがな）付きテキストコンポーネント
 * 小学3年生以上の漢字にふりがなを付ける
 */
export const R: React.FC<{ children: string; rt: string }> = ({ children, rt }) => (
  <ruby>{children}<rp>(</rp><rt>{rt}</rt><rp>)</rp></ruby>
);
