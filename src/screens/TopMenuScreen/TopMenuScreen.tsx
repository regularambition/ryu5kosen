import { useState } from 'react';
import ConfirmationDialog from '../../components/ui/dialogs/ConfirmationDialog/ConfirmationDialog';
import SidebarScreenLayout from '../../components/layouts/SidebarScreenLayout';
import PlainButton from '../../components/ui/buttons/PlainButton/PlainButton';
import PlainButtonPair from '../../components/ui/buttons/PlainButtonPair/PlainButtonPair';
import { useScreenNavigation } from '../../contexts/ScreenNavigationContext';
import { ScreenId } from '../../types/ScreenId';

function TopMenuScreen() {
  const { navigate, goBack } = useScreenNavigation();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleConfirm = () => {
    setIsConfirmationOpen(false);
    goBack();
  };

  return (
    <SidebarScreenLayout onBack={() => setIsConfirmationOpen(true)}>
      <PlainButtonPair>
        <PlainButton onClick={() => alert('mbm')}>ゲームを遊ぶ</PlainButton>

        <PlainButton onClick={() => alert('fes')}>遊び方</PlainButton>
      </PlainButtonPair>

      <PlainButtonPair>
        <PlainButton onClick={() => navigate(ScreenId.USER_NAME_UPDATE)}>
          ユーザー名変更
        </PlainButton>

        <PlainButton onClick={() => navigate(ScreenId.CREDITS)}>
          クレジット
        </PlainButton>
      </PlainButtonPair>

      <ConfirmationDialog
        open={isConfirmationOpen}
        onConfirm={handleConfirm}
        onCancel={() => setIsConfirmationOpen(false)}
      >
        タイトルに戻りますか？
      </ConfirmationDialog>
    </SidebarScreenLayout>
  );
}

export default TopMenuScreen;
