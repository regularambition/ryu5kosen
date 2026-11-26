// import { useState } from 'react'
import GameTitleScreen from './screens/GameTitleScreen/GameTitleScreen';
import ScreenLayout from './components/layouts/ScreenLayout';
import { useScreenNavigation } from './contexts/ScreenNavigationContext';
import { ScreenId } from './types/ScreenId';
import TopMenuScreen from './screens/TopMenuScreen/TopMenuScreen';
import UserNameUpdateScreen from './screens/UserNameUpdateScreen/UserNameUpdateScreen';
import { useUser } from './contexts/UserContext';
import { useRef, useState } from 'react';

function App() {
  const { currentScreen, navigate } = useScreenNavigation();
  const isGameTitleScreen = currentScreen === ScreenId.GAME_TITLE;

  const getRenderedScreen = () => {
    if (currentScreen === ScreenId.GAME_TITLE) {
      return (
        <GameTitleScreen isStarting={isStarting} startError={startError} />
      );
    }
    if (currentScreen === ScreenId.TOP_MENU) {
      return <TopMenuScreen />;
    }
    return <UserNameUpdateScreen />;
  };

  const { loadUserName } = useUser();
  const startInProgress = useRef(false);
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState('');

  const handleStart = async () => {
    if (startInProgress.current) return;

    startInProgress.current = true;
    setIsStarting(true);
    setStartError('');

    try {
      const name = await loadUserName();
      navigate(name === null ? ScreenId.USER_NAME_UPDATE : ScreenId.TOP_MENU);
    } catch (error) {
      console.error(error);
      setStartError(
        'ユーザー情報を取得できませんでした。もう一度お試しください。',
      );
    } finally {
      startInProgress.current = false;
      setIsStarting(false);
    }
  };

  return (
    <ScreenLayout
      onActivate={isGameTitleScreen ? handleStart : undefined}
      activationLabel={'ゲーム開始'}
    >
      {getRenderedScreen()}
    </ScreenLayout>
  );
}

export default App;
