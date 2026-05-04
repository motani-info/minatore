/** プロフィールデータ */
export interface ProfileData {
  /** 表示名 */
  name: string;
  /** アバター画像（Base64 Data URL） */
  avatarUrl: string | null;
  /** 年齢（歳） */
  age: number | null;
}

const STORAGE_KEY = 'exam-app-profile';

const DEFAULT_PROFILE: ProfileData = {
  name: '',
  avatarUrl: null,
  age: null,
};

/** プロフィールを読み込む */
export function loadProfile(): ProfileData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return {
        name: typeof parsed.name === 'string' ? parsed.name : '',
        avatarUrl: typeof parsed.avatarUrl === 'string' ? parsed.avatarUrl : null,
        age: typeof parsed.age === 'number' ? parsed.age : null,
      };
    }
    return { ...DEFAULT_PROFILE };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

/** プロフィールを保存する */
export function saveProfile(data: ProfileData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

/**
 * 画像ファイルをBase64 Data URLに変換する。
 * 容量を抑えるため、最大200x200にリサイズする。
 */
export function fileToDataUrl(file: File, maxSize = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;

        // アスペクト比を維持してリサイズ
        if (w > maxSize || h > maxSize) {
          if (w > h) {
            h = Math.round((h * maxSize) / w);
            w = maxSize;
          } else {
            w = Math.round((w * maxSize) / h);
            h = maxSize;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}
