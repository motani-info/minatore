import { useState, useCallback } from 'react';
import { loadProfile, saveProfile, fileToDataUrl } from '../../storage/profileService';
import type { ProfileData } from '../../storage/profileService';

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData>(() => loadProfile());

  const updateName = useCallback((name: string) => {
    const updated = { ...loadProfile(), name };
    saveProfile(updated);
    setProfile(updated);
  }, []);

  const updateAvatar = useCallback(async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    const updated = { ...loadProfile(), avatarUrl: dataUrl };
    saveProfile(updated);
    setProfile(updated);
  }, []);

  const removeAvatar = useCallback(() => {
    const updated = { ...loadProfile(), avatarUrl: null };
    saveProfile(updated);
    setProfile(updated);
  }, []);

  const updateAge = useCallback((age: number | null) => {
    const updated = { ...loadProfile(), age };
    saveProfile(updated);
    setProfile(updated);
  }, []);

  const reload = useCallback(() => {
    setProfile(loadProfile());
  }, []);

  return { profile, updateName, updateAvatar, removeAvatar, updateAge, reload };
}
