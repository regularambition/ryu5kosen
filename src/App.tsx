import GameTitleScreen from './screens/GameTitleScreen/GameTitleScreen';
import ScreenLayout from './components/layouts/ScreenLayout';
import { useScreenNavigation } from './contexts/ScreenNavigationContext';
import { ScreenId } from './types/ScreenId';
import TopMenuScreen from './screens/TopMenuScreen/TopMenuScreen';
import UserNameUpdateScreen from './screens/UserNameUpdateScreen/UserNameUpdateScreen';
import { useUser } from './contexts/UserContext';
import { useEffect, useRef, useState } from 'react';
import CreditsScreen from './screens/CreditsScreen/CreditsScreen';
import HowToPlayScreen from './screens/HowToPlayScreen/HowToPlayScreen';
import MatchTypeSelectScreen from './screens/MatchTypeSelectScreen/MatchTypeSelectScreen';
import RandomOpponentSearchingScreen from './screens/RandomOpponentSearchingScreen/RandomOpponentSearchingScreen';

const GAME_LOCK_NAME = 'ryu5kosen:game-session';

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
    if (currentScreen === ScreenId.USER_NAME_UPDATE) {
      return <UserNameUpdateScreen />;
    }
    if (currentScreen === ScreenId.CREDITS) {
      return <CreditsScreen />;
    }
    if (currentScreen === ScreenId.HOW_TO_PLAY) {
      return <HowToPlayScreen />;
    }
    if (currentScreen === ScreenId.MATCH_TYPE_SELECT) {
      return <MatchTypeSelectScreen />;
    }
    return <RandomOpponentSearchingScreen />;
  };

  const { loadUserName } = useUser();
  const startInProgress = useRef(false);
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState('');

  const releaseGameLock = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (isGameTitleScreen) {
      releaseGameLock.current?.();
    }
  }, [isGameTitleScreen]);

  const handleStart = async () => {
    if (startInProgress.current) return;

    const locks = navigator.locks;
    if (!locks) {
      setStartError('ゲームを開始するには Web Locks 対応ブラウザが必要です。');
      return;
    }

    startInProgress.current = true;
    setIsStarting(true);
    setStartError('');

    try {
      await locks.request(
        GAME_LOCK_NAME,
        { mode: 'exclusive', ifAvailable: true },
        async (lock) => {
          if (!lock) {
            setStartError(
              '別のタブでゲームを起動中です。そのタブを閉じるか、タイトルに戻ってから再試行してください。',
            );
            return;
          }

          const name = await loadUserName();

          const untilReturnToTitle = new Promise<void>((resolve) => {
            releaseGameLock.current = resolve;
          });

          setIsStarting(false);
          navigate(
            name === null ? ScreenId.USER_NAME_UPDATE : ScreenId.TOP_MENU,
          );
          await untilReturnToTitle;
        },
      );
    } catch (error) {
      console.error(error);
      setStartError('ゲームを開始できませんでした。もう一度お試しください。');
    } finally {
      releaseGameLock.current = null;
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
