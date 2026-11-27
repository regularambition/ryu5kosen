import HowToPlayPageLayout, {
  type HowToPlayPagingProps,
} from './HowToPlayPageLayout';
import './MatchupPage.css';

type CardMatchupPageProps = HowToPlayPagingProps & {
  pageNo: number;
  winnerIconSrc: string;
  winnerName: string;
  loserIconSrc: string;
  loserName: string;
};

function MatchupPage({
  pageNo,
  winnerIconSrc,
  winnerName,
  loserIconSrc,
  loserName,
  ...pagingProps
}: CardMatchupPageProps) {
  return (
    <HowToPlayPageLayout
      title={`勝敗が決まる組み合わせ${pageNo}(左右はそれぞれ勝ち・負け)`}
      {...pagingProps}
    >
      <div className="matchup-page">
        <img
          className="matchup-page__icon"
          src={winnerIconSrc}
          alt={`${winnerName}（勝ち）`}
        />
        <img
          className="matchup-page__icon"
          src={loserIconSrc}
          alt={`${loserName}（負け）`}
        />
      </div>
    </HowToPlayPageLayout>
  );
}

export default MatchupPage;
