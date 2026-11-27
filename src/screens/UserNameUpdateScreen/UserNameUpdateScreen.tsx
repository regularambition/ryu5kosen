import { useRef, useState, type SubmitEventHandler } from 'react';
import SidebarScreenLayout from '../../components/layouts/SidebarScreenLayout';
import PlainButton from '../../components/ui/buttons/PlainButton/PlainButton';
import ConfirmationDialog from '../../components/ui/dialogs/ConfirmationDialog/ConfirmationDialog';
import TextInputWithHint from '../../components/ui/inputs/TextInputWithHint/TextInputWithHint';
import { useScreenNavigation } from '../../contexts/ScreenNavigationContext';
import { useUser } from '../../contexts/UserContext';
import { UserNameValidator } from '../../../functions/src/shared/validators';
import './UserNameUpdateScreen.css';
import { ScreenId } from '../../types/ScreenId';

function UserNameUpdateScreen() {
  const { userName, saveUserName } = useUser();
  const { goBack, replace } = useScreenNavigation();
  const [newUserName, setNewUserName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const savingRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    if (isSaving) {
      return;
    }

    event.preventDefault();
    const validationResult = UserNameValidator.validate(newUserName);

    if (!validationResult.isValid) {
      setErrorMessage(validationResult.errorMessage);
      return;
    }

    setIsConfirmationOpen(true);
  };

  const handleConfirm = async () => {
    if (savingRef.current) return;

    savingRef.current = true;
    setIsSaving(true);
    setIsConfirmationOpen(false);
    setErrorMessage('');

    const isFirstRegistration = userName === null;

    try {
      await saveUserName(newUserName);

      if (isFirstRegistration) {
        replace(ScreenId.TOP_MENU);
      } else {
        goBack();
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        'ユーザー名を保存できませんでした。もう一度お試しください。',
      );
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <SidebarScreenLayout>
      <form
        className="user-name-update-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <TextInputWithHint
          id="new-user-name"
          label="新しいユーザー名"
          hint={UserNameValidator.hint()}
          errorMessage={errorMessage || undefined}
          type="text"
          value={newUserName}
          autoComplete="username"
          autoFocus
          onChange={(event) => {
            setNewUserName(event.target.value);
            setErrorMessage('');
          }}
        />

        <PlainButton type="submit" disabled={isSaving}>
          決定
        </PlainButton>
      </form>

      <ConfirmationDialog
        open={isConfirmationOpen}
        onConfirm={handleConfirm}
        onCancel={() => setIsConfirmationOpen(false)}
      >
        ユーザー名を「{newUserName}」に更新します。よろしいですか？
      </ConfirmationDialog>
    </SidebarScreenLayout>
  );
}

export default UserNameUpdateScreen;
