import HowToPlayPageLayout, {
  type HowToPlayPagingProps,
} from './HowToPlayPageLayout';
import './ChoiceEffectPage.css';

type ChoiceEffectPageProps = HowToPlayPagingProps & {
  cardName: string;
  iconSrc: string;
  description: string;
};

function ChoiceEffectPage({
  cardName,
  iconSrc,
  description,
  ...pagingProps
}: ChoiceEffectPageProps) {
  return (
    <HowToPlayPageLayout title={cardName} {...pagingProps}>
      <div className="choice-effect-page">
        <div className="choice-effect-page__icon-area">
          <img className="choice-effect-page__icon" src={iconSrc} alt="" />
        </div>

        <p className="choice-effect-page__description">{description}</p>
      </div>
    </HowToPlayPageLayout>
  );
}

export default ChoiceEffectPage;
