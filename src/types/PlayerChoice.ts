import {
  attackIcon,
  beamIcon,
  chargeIcon,
  defenseIcon,
} from '../asset_path_reference/images/player_choice';

export const PlayerChoice = {
  CHARGE: { name: '蓄積', iconPath: chargeIcon },
  DEFENSE: { name: '防御', iconPath: defenseIcon },
  ATTACK: { name: '攻撃', iconPath: attackIcon },
  BEAM: { name: '光線', iconPath: beamIcon },
} as const;

export type PlayerChoice = (typeof PlayerChoice)[keyof typeof PlayerChoice];
