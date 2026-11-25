export const ScreenId = {
  GAME_TITLE: 'GameTitle',
  TOP_MENU: 'TopMenu',
  USER_NAME_UPDATE: 'UserNameUpdate',
} as const;

export type ScreenId = (typeof ScreenId)[keyof typeof ScreenId];

export function getScreenTitle(screenId: ScreenId) {
  if (screenId === ScreenId.GAME_TITLE) {
    return 'ゲームタイトル';
  } else if (screenId === ScreenId.TOP_MENU) {
    return 'トップメニュー';
  } else if (screenId === ScreenId.USER_NAME_UPDATE) {
    return 'ユーザー名更新';
  } else {
    return 'impossible';
  }
}
