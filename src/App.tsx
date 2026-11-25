// import { useState } from 'react'
import GameTitleScreen from './screens/GameTitleScreen/GameTitleScreen';
import ScreenLayout from './components/layouts/ScreenLayout';
import { useScreenNavigation } from './contexts/ScreenNavigationContext';
import { getScreenTitle, ScreenId } from './types/ScreenId';

function App() {
  const { currentScreen, navigate } = useScreenNavigation();

  const isGameTitleScreen = currentScreen === ScreenId.TOP_MENU;

  return (
    <ScreenLayout
      onActivate={
        isGameTitleScreen
          ? () => navigate(ScreenId.TOP_MENU)
          : () => alert('test')
      }
      activationLabel={
        isGameTitleScreen
          ? `${getScreenTitle(ScreenId.TOP_MENU)}画面へ移動`
          : undefined
      }
    >
      <GameTitleScreen />
    </ScreenLayout>
  );
}

export default App;
