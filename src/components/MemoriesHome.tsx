import React from 'react';
import { MemoriesScreen } from './MemoriesScreen';

interface MemoriesHomeProps {
  primaryPhotoUrl?: string | null;
  isPrimaryPhotoLocked?: boolean;
  onPrimaryPhotoUploaded?: (url: string) => void;
  onLockApp: () => void;
  onBackToStart?: () => void;
  onBackToGifts?: () => void;
}

export const MemoriesHome: React.FC<MemoriesHomeProps> = ({
  onLockApp,
  onBackToStart,
  onBackToGifts,
}) => {
  return (
    <MemoriesScreen
      onLockApp={onLockApp}
      onBackToStart={onBackToStart}
      onBackToGifts={onBackToGifts}
    />
  );
};
