import { useEffect, useState } from 'react';
import SidebarScreenLayout from '../../components/layouts/SidebarScreenLayout';
import ConfirmationDialog from '../../components/ui/dialogs/ConfirmationDialog/ConfirmationDialog';
import {
  MatchMakingRequestStatus,
  type JoinRandomMatchQueueRequest,
} from '../../../functions/src/shared';
import { useScreenNavigation } from '../../contexts/ScreenNavigationContext';
import { joinRandomMatchQueue } from '../../api/functions';
// import { ScreenId } from '../../types/ScreenId';

function RandomOpponentSearchingScreen() {
  const { /*navigate,*/ goBack } = useScreenNavigation();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [status, setStatus] = useState<MatchMakingRequestStatus>(
    MatchMakingRequestStatus.WAITING,
  );

  const handleConfirm = async () => {
    setStatus(MatchMakingRequestStatus.CANCELLED);
    setIsConfirmationOpen(false);
  };

  const handleCancel = async () => {
    if (status !== MatchMakingRequestStatus.TIMED_OUT) {
      console.log('タイムアウト前にキャンセルが選択されました');
      // dbにある自分のリクエストを消す処理
    }

    setIsConfirmationOpen(false);
    goBack();
  };

  useEffect(() => {
    const req: JoinRandomMatchQueueRequest = {
      searchId: 'test_serach_id',
      previousSearchId: null,
    };
    joinRandomMatchQueue(req);
  }, []);

  return (
    <SidebarScreenLayout>
      <h2>
        {status === MatchMakingRequestStatus.MATCHED
          ? '！！！ 対戦相手が見つかりました ！！！'
          : '対戦相手を探しています…'}
      </h2>

      <ConfirmationDialog
        open={isConfirmationOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      >
        {status === MatchMakingRequestStatus.TIMED_OUT
          ? 'タイムアウトしました。もう一度相手を探しますか？'
          : '相手を探すのを止めますか？'}
      </ConfirmationDialog>
    </SidebarScreenLayout>
  );
}

export default RandomOpponentSearchingScreen;
