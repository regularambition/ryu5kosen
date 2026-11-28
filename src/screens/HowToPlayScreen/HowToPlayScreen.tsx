import { useState } from 'react';
import SidebarScreenLayout from '../../components/layouts/SidebarScreenLayout';
import { PlayerChoice } from '../../types/PlayerChoice';
import ChoiceEffectPage from './components/ChoiceEffectPage';
import MatchupPage from './components/MatchupPage';
import BasicRulePage from './components/BasicRulePage';

type FinishingPair = {
  winner: PlayerChoice;
  loser: PlayerChoice;
};

const fp: Array<FinishingPair> = [
  { winner: PlayerChoice.ATTACK, loser: PlayerChoice.CHARGE },
  { winner: PlayerChoice.BEAM, loser: PlayerChoice.CHARGE },
  { winner: PlayerChoice.BEAM, loser: PlayerChoice.DEFENSE },
];

const choiceDescriptions = new Map<PlayerChoice, readonly string[]>([
  [
    PlayerChoice.CHARGE,
    ['自分のマナを1増やす', '相手が攻撃してきていると負け'],
  ],
  [PlayerChoice.DEFENSE, ['マナの消費量は0', '相手の攻撃を防ぐ']],
  [PlayerChoice.ATTACK, ['マナの消費量は1', '相手に対して攻撃を仕掛ける']],
  [
    PlayerChoice.BEAM,
    [
      'マナの消費量は5',
      '相手に対して防御不可能な攻撃を仕掛ける',
      'この手で勝利した場合に貰えるのは1点ではなく2点',
    ],
  ],
]);

const SectionType = {
  BASIC_RULE: 0,
  CHOICE_EFFECT: 1,
  MATCHUP: 2,
} as const;

type SectionType = (typeof SectionType)[keyof typeof SectionType];

type ChoiceEffectPageDefinition = {
  type: typeof SectionType.CHOICE_EFFECT;
  choice: PlayerChoice;
  description: readonly string[];
};

type MatchupPageDefinition = {
  type: typeof SectionType.MATCHUP;
  winner: PlayerChoice;
  loser: PlayerChoice;
};

type BasicRulePageDefinition = {
  type: typeof SectionType.BASIC_RULE;
  rules: readonly string[];
};

type HowToPlayPageDefinition =
  ChoiceEffectPageDefinition | MatchupPageDefinition | BasicRulePageDefinition;

const basicRulePages: ReadonlyArray<BasicRulePageDefinition> = [
  {
    type: SectionType.BASIC_RULE,
    rules: [
      '相手を攻撃して点を積み上げ先に5点以上獲得したら勝利',
      'ゲーム開始時点で両プレイヤーは0点と1マナを持つ',
      '各ラウンドの思考時間は10秒',
    ],
  },
  {
    type: SectionType.BASIC_RULE,
    rules: [
      '同一の試合について、切断した場合に復帰できるのは最大で1回',
      '行動選択はクリックだけではなく横一列に並んだカードについてそれぞれA・S・K・Lキーでも可能',
      '相手が5点以上に達する前に諦める場合は白旗アイコンのボタンを押す',
    ],
  },
];

const howToPlayPages: ReadonlyArray<HowToPlayPageDefinition> = [
  ...basicRulePages,
  ...Object.values(PlayerChoice).map<ChoiceEffectPageDefinition>((choice) => ({
    type: SectionType.CHOICE_EFFECT,
    choice: choice,
    description: choiceDescriptions.get(choice) ?? [],
  })),
  ...fp.map<MatchupPageDefinition>(({ winner, loser }) => ({
    type: SectionType.MATCHUP,
    winner,
    loser,
  })),
];

function HowToPlayScreen() {
  // 配列内では0始まり、画面表示では1始まりとして扱う。
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPageDefinition = howToPlayPages[currentPageIndex];
  const currentPage = currentPageIndex + 1;
  const totalPages = howToPlayPages.length;

  const goToPreviousPage = () => {
    setCurrentPageIndex((pageIndex) => Math.max(0, pageIndex - 1));
  };

  const goToNextPage = () => {
    setCurrentPageIndex((pageIndex) => Math.min(totalPages - 1, pageIndex + 1));
  };

  const pagingProps = {
    currentPage,
    totalPages,
    onPreviousPage: goToPreviousPage,
    onNextPage: goToNextPage,
  };

  return (
    <SidebarScreenLayout>
      {currentPageDefinition.type === SectionType.BASIC_RULE ? (
        <BasicRulePage
          pageNo={currentPageIndex + 1}
          rules={currentPageDefinition.rules}
          {...pagingProps}
        />
      ) : currentPageDefinition.type === SectionType.CHOICE_EFFECT ? (
        <ChoiceEffectPage
          cardName={currentPageDefinition.choice.name}
          iconSrc={currentPageDefinition.choice.iconPath}
          description={currentPageDefinition.description}
          {...pagingProps}
        />
      ) : (
        <MatchupPage
          pageNo={
            currentPageIndex -
            (basicRulePages.length + choiceDescriptions.size) +
            1
          }
          winnerIconSrc={currentPageDefinition.winner.iconPath}
          winnerName={currentPageDefinition.winner.name}
          loserIconSrc={currentPageDefinition.loser.iconPath}
          loserName={currentPageDefinition.loser.name}
          {...pagingProps}
        />
      )}
    </SidebarScreenLayout>
  );
}

export default HowToPlayScreen;
