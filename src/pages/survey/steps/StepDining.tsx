import type { SurveyFormData } from '../../../types/survey';
import QuestionCard from '../components/QuestionCard';
import { SingleSelect, MultiSelect, TextInput, OtherComment } from '../components/FormComponents';
import {
  MORNING_MEAL_OPTIONS,
  LUNCH_OPTIONS,
  DINNER_OPTIONS,
  FOOD_TYPE_OPTIONS,
} from '../../../data/survey-options';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
}

const FOOD_TYPE_TRIGGER = ['食べ歩き', '簡単なレストラン'];

export default function StepDining({ data, onChange }: Props) {
  const showLunchFoodTypes = FOOD_TYPE_TRIGGER.includes(data.lunch);
  const showDinnerFoodTypes = FOOD_TYPE_TRIGGER.includes(data.dinner);

  return (
    <>
      <QuestionCard label="Q20. モーニングはどうする？">
        <SingleSelect
          name="morning_meal"
          options={MORNING_MEAL_OPTIONS}
          value={data.morning_meal}
          onChange={(v) => onChange({ morning_meal: v })}
        />
        <OtherComment fieldName="morning_meal" data={data} onChange={onChange} show={data.morning_meal === 'その他'} />
      </QuestionCard>

      <QuestionCard label="Q21. ランチはどうする？">
        <SingleSelect
          name="lunch"
          options={LUNCH_OPTIONS}
          value={data.lunch}
          onChange={(v) => onChange({ lunch: v })}
        />
        {showLunchFoodTypes && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-sub)', marginBottom: 8 }}>
              ランチ何系がいい？（複数選択OK）
            </div>
            <MultiSelect
              name="lunch_food_types"
              options={FOOD_TYPE_OPTIONS.map((o) => ({ value: o }))}
              values={data.lunch_food_types}
              onChange={(v) => onChange({ lunch_food_types: v })}
            />
          </div>
        )}
        {data.lunch === '食べたいものあり' && (
          <div style={{ marginTop: 8 }}>
            <TextInput
              value={data.lunch_comment}
              onChange={(v) => onChange({ lunch_comment: v })}
              placeholder="食べたいものを教えてください"
            />
          </div>
        )}
        <OtherComment fieldName="lunch" data={data} onChange={onChange} show={data.lunch === 'その他'} />
      </QuestionCard>

      <QuestionCard label="Q22. ディナーはどうする？">
        <SingleSelect
          name="dinner"
          options={DINNER_OPTIONS}
          value={data.dinner}
          onChange={(v) => onChange({ dinner: v })}
        />
        {showDinnerFoodTypes && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-sub)', marginBottom: 8 }}>
              ディナー何系がいい？（複数選択OK）
            </div>
            <MultiSelect
              name="dinner_food_types"
              options={FOOD_TYPE_OPTIONS.map((o) => ({ value: o }))}
              values={data.dinner_food_types}
              onChange={(v) => onChange({ dinner_food_types: v })}
            />
          </div>
        )}
        {data.dinner === '食べたいものあり' && (
          <div style={{ marginTop: 8 }}>
            <TextInput
              value={data.dinner_comment}
              onChange={(v) => onChange({ dinner_comment: v })}
              placeholder="食べたいものを教えてください"
            />
          </div>
        )}
        <OtherComment fieldName="dinner" data={data} onChange={onChange} show={data.dinner === 'その他'} />
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
