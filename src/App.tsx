// import { useState } from 'react'
import GameTitleScreen from './screens/GameTitleScreen/GameTitleScreen';
import ScreenLayout from './components/layouts/ScreenLayout';
import { useScreenNavigation } from './contexts/ScreenNavigationContext';
import { getScreenTitle, ScreenId } from './types/ScreenId';
import TopMenuScreen from './screens/TopMenuScreen/TopMenuScreen';
import UserNameUpdateScreen from './screens/UserNameUpdateScreen/UserNameUpdateScreen';

function App() {
  const { currentScreen, navigate } = useScreenNavigation();

  const isGameTitleScreen = currentScreen === ScreenId.GAME_TITLE;

  const getRenderedScreen = () => {
    if (currentScreen === ScreenId.GAME_TITLE) {
      return <GameTitleScreen />;
    }
    if (currentScreen === ScreenId.TOP_MENU) {
      return <TopMenuScreen />;
    }
    return <UserNameUpdateScreen />;
  };

  return (
    <ScreenLayout
      onActivate={
        isGameTitleScreen ? () => navigate(ScreenId.TOP_MENU) : undefined
      }
      activationLabel={
        isGameTitleScreen
          ? `${getScreenTitle(ScreenId.TOP_MENU)}画面へ移動`
          : undefined
      }
    >
      {getRenderedScreen()}
    </ScreenLayout>
  );
}

export default App;
