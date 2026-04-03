import type { SurveyFormData } from '../../../types/survey';
import type { RestaurantInfo } from '../../../api/restaurants';
import QuestionCard from '../components/QuestionCard';
import { SingleSelect, TextInput } from '../components/FormComponents';
import {
  MORNING_MEAL_OPTIONS,
  LUNCH_OPTIONS,
  DINNER_OPTIONS,
} from '../../../data/survey-options';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
  restaurants: RestaurantInfo[];
}

export default function StepDining({ data, onChange, restaurants }: Props) {
  const openCount = restaurants.filter((r) => r.open_time).length;

  return (
    <>
      {restaurants.length > 0 && (
        <div style={{
          background: '#E3F0FC',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          marginBottom: 16,
          fontSize: 'var(--text-xs)',
          color: 'var(--color-primary-dark)',
          fontWeight: 600,
        }}>
          来園日は {openCount} 店舗が営業予定です
        </div>
      )}

      <QuestionCard label="Q20. モーニングはどうする？">
        <SingleSelect
          name="morning_meal"
          options={MORNING_MEAL_OPTIONS}
          value={data.morning_meal}
          onChange={(v) => onChange({ morning_meal: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q21. ランチはどうする？">
        <SingleSelect
          name="lunch"
          options={LUNCH_OPTIONS}
          value={data.lunch}
          onChange={(v) => onChange({ lunch: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q22. ディナーはどうする？">
        <SingleSelect
          name="dinner"
          options={DINNER_OPTIONS}
          value={data.dinner}
          onChange={(v) => onChange({ dinner: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q23. 食べ物の好みは？">
        <TextInput
          value={data.food_preferences}
          onChange={(v) => onChange({ food_preferences: v })}
          placeholder="例: 和食が好き、辛いものはNG"
          multiline
        />
      </QuestionCard>

      <QuestionCard label="Q24. 食べ物のアレルギーありますか？">
        <TextInput
          value={data.allergies}
          onChange={(v) => onChange({ allergies: v })}
          placeholder="例: 卵アレルギー、なし"
        />
      </QuestionCard>
    </>
  );
}
