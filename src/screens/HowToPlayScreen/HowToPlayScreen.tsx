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

const choiceDescriptions = new Map<PlayerChoice, string>([
  [PlayerChoice.CHARGE, '惑星カードの効果説明をここに記載します。'],
  [PlayerChoice.DEFENSE, '虹カードの効果説明をここに記載します。'],
  [PlayerChoice.ATTACK, '太陽カードの効果説明をここに記載します。'],
  [PlayerChoice.BEAM, 'サングラスカードの効果説明をここに記載します。'],
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
  description: string;
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
    rules: ['ルール説明1', 'ルール説明2'],
  },
  {
    type: SectionType.BASIC_RULE,
    rules: ['ルール説明3', 'ルール説明4'],
  },
];

const howToPlayPages: ReadonlyArray<HowToPlayPageDefinition> = [
  ...basicRulePages,
  ...Object.values(PlayerChoice).map<ChoiceEffectPageDefinition>((choice) => ({
    type: SectionType.CHOICE_EFFECT,
    choice: choice,
    description: choiceDescriptions.get(choice) ?? '',
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
