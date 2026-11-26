type GameTitleScreenProps = {
  isStarting: boolean;
  startError: string;
};

function GameTitleScreen({ isStarting, startError }: GameTitleScreenProps) {
  return (
    <>
      <h1>ゲームタイトル</h1>
      <h2>
        任意の場所をクリックして
        <br />
        ゲーム開始
      </h2>
      {isStarting && <h6>ユーザー情報を確認中…</h6>}
      {startError ?? <h6>{startError}</h6>}
    </>
  );
}

export default GameTitleScreen;
