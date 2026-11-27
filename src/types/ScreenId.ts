export const ScreenId = {
  GAME_TITLE: 'GameTitle',
  TOP_MENU: 'TopMenu',
  USER_NAME_UPDATE: 'UserNameUpdate',
  CREDITS: 'Credits',
  HOW_TO_PLAY: 'HowToPlay',
} as const;

export type ScreenId = (typeof ScreenId)[keyof typeof ScreenId];

export function getScreenTitle(screenId: ScreenId) {
  if (screenId === ScreenId.GAME_TITLE) {
    return 'ゲームタイトル';
  } else if (screenId === ScreenId.TOP_MENU) {
    return 'トップメニュー';
  } else if (screenId === ScreenId.USER_NAME_UPDATE) {
    return 'ユーザー名更新';
  } else if (screenId === ScreenId.CREDITS) {
    return 'クレジット';
  } else if (screenId === ScreenId.HOW_TO_PLAY) {
    return '遊び方';
  } else {
    return 'impossible';
  }
}
