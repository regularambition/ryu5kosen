import SidebarScreenLayout from '../../components/layouts/SidebarScreenLayout';
import PlainButton from '../../components/ui/buttons/PlainButton/PlainButton';
import PlainButtonPair from '../../components/ui/buttons/PlainButtonPair/PlainButtonPair';
import { useScreenNavigation } from '../../contexts/ScreenNavigationContext';
import { ScreenId } from '../../types/ScreenId';

function MatchTypeSelectScreen() {
  const { navigate } = useScreenNavigation();

  return (
    <SidebarScreenLayout>
      <PlainButtonPair>
        <PlainButton
          onClick={() => navigate(ScreenId.RANDOM_OPPONENT_SEARCHING)}
        >
          ランダムマッチ
        </PlainButton>

        <PlainButton onClick={() => alert('今後実装予定')}>
          プライベートマッチ
        </PlainButton>
      </PlainButtonPair>
    </SidebarScreenLayout>
  );
}

export default MatchTypeSelectScreen;
