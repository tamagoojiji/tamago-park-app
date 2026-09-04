import { useMemo } from 'react';
import type { SurveyFormData } from '../../../types/survey';
import QuestionCard from '../components/QuestionCard';
import { SingleSelect, MultiSelect, TextInput, OtherComment, type MultiSelectOption } from '../components/FormComponents';
import {
  MORNING_MEAL_OPTIONS,
  LUNCH_OPTIONS,
  DINNER_OPTIONS,
  FOOD_TYPE_OPTIONS,
} from '../../../data/survey-options';
import { activeCollabMenus, activeCollabStores, collabValue, COLLAB_PREFIX } from '../../../data/collab-menus';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
  visitDate: string;
}

const FOOD_TYPE_TRIGGER = ['食べ歩き', '簡単なレストラン'];

const subLabelStyle = { fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-sub)', marginBottom: 8 } as const;

// 来園日に食べられるコラボ飯を店舗ごとの見出し付きで並べる
function CollabMenuSelect({
  name,
  visitDate,
  values,
  onChange,
}: {
  name: string;
  visitDate: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const menus = useMemo(() => activeCollabMenus(visitDate), [visitDate]);
  const stores = useMemo(() => activeCollabStores(visitDate), [visitDate]);

  return (
    <div style={{ marginTop: 12 }}>
      <div style={subLabelStyle}>来園日に食べられるコラボ飯（複数選択OK）</div>
      {stores.map((store) => {
        const storeMenus = menus.filter((m) => m.store === store.key);
        const storeValues = storeMenus.map((m) => collabValue(m));
        const options: MultiSelectOption[] = storeMenus.map((m) => ({
          value: collabValue(m),
          label: m.menu,
          badge: m.price,
          badgeType: m.price ? ('active' as const) : undefined,
        }));
        return (
          <div key={store.key}>
            <div style={{ ...subLabelStyle, marginTop: 10 }}>{store.title}</div>
            {store.note && (
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-sub)', marginBottom: 8 }}>
                {store.note}
              </div>
            )}
            <MultiSelect
              name={`${name}_${store.key}`}
              options={options}
              values={values.filter((v) => storeValues.includes(v))}
              onChange={(v) => onChange([...values.filter((e) => !storeValues.includes(e)), ...v])}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function StepDining({ data, onChange, visitDate }: Props) {
  const showLunchFoodTypes = FOOD_TYPE_TRIGGER.includes(data.lunch);
  const showDinnerFoodTypes = FOOD_TYPE_TRIGGER.includes(data.dinner);

  const collabMenus = useMemo(() => activeCollabMenus(visitDate), [visitDate]);

  // ジャンル選択の変更。「コラボ飯」を外したらコラボ飯の選択も一緒に落とす
  const handleFoodTypes = (key: 'lunch_food_types' | 'dinner_food_types') => (v: string[]) => {
    const next = v.includes('コラボ飯') ? v : v.filter((e) => !e.startsWith(COLLAB_PREFIX));
    onChange({ [key]: next } as Partial<SurveyFormData>);
  };

  // コラボ飯の選択。ジャンル選択（プレフィックスなし）と合成して同じ配列に保存
  const handleCollab = (key: 'lunch_food_types' | 'dinner_food_types') => (v: string[]) => {
    const base = data[key].filter((e) => !e.startsWith(COLLAB_PREFIX));
    const selected = v.filter((e) => e.startsWith(COLLAB_PREFIX));
    onChange({ [key]: [...base, ...selected] } as Partial<SurveyFormData>);
  };

  const collabValues = (key: 'lunch_food_types' | 'dinner_food_types') =>
    data[key].filter((e) => e.startsWith(COLLAB_PREFIX));

  return (
    <>
      <QuestionCard label="Q21. モーニングはどうする？（荷物検査場を通過するときには、食べ物の持ち込みは禁止です）">
        <SingleSelect
          name="morning_meal"
          options={MORNING_MEAL_OPTIONS}
          value={data.morning_meal}
          onChange={(v) => onChange({ morning_meal: v })}
        />
        <OtherComment fieldName="morning_meal" data={data} onChange={onChange} show={data.morning_meal === 'その他'} />
      </QuestionCard>

      <QuestionCard label="Q22. ランチはどうする？">
        <SingleSelect
          name="lunch"
          options={LUNCH_OPTIONS}
          value={data.lunch}
          onChange={(v) => onChange({ lunch: v })}
        />
        {showLunchFoodTypes && (
          <div style={{ marginTop: 12 }}>
            <div style={subLabelStyle}>
              ランチ何系がいい？（複数選択OK）
            </div>
            <MultiSelect
              name="lunch_food_types"
              options={FOOD_TYPE_OPTIONS.map((o) => ({ value: o }))}
              values={data.lunch_food_types}
              onChange={handleFoodTypes('lunch_food_types')}
            />
            {data.lunch_food_types.includes('コラボ飯') && collabMenus.length > 0 && (
              <CollabMenuSelect
                name="lunch_collab"
                visitDate={visitDate}
                values={collabValues('lunch_food_types')}
                onChange={handleCollab('lunch_food_types')}
              />
            )}
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

      <QuestionCard label="Q23. ディナーはどうする？">
        <SingleSelect
          name="dinner"
          options={DINNER_OPTIONS}
          value={data.dinner}
          onChange={(v) => onChange({ dinner: v })}
        />
        {showDinnerFoodTypes && (
          <div style={{ marginTop: 12 }}>
            <div style={subLabelStyle}>
              ディナー何系がいい？（複数選択OK）
            </div>
            <MultiSelect
              name="dinner_food_types"
              options={FOOD_TYPE_OPTIONS.map((o) => ({ value: o }))}
              values={data.dinner_food_types}
              onChange={handleFoodTypes('dinner_food_types')}
            />
            {data.dinner_food_types.includes('コラボ飯') && collabMenus.length > 0 && (
              <CollabMenuSelect
                name="dinner_collab"
                visitDate={visitDate}
                values={collabValues('dinner_food_types')}
                onChange={handleCollab('dinner_food_types')}
              />
            )}
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

      <QuestionCard label="Q24. 食べ物の好みは？">
        <TextInput
          value={data.food_preferences}
          onChange={(v) => onChange({ food_preferences: v })}
          placeholder="例: 和食が好き、辛いものはNG"
          multiline
        />
      </QuestionCard>

      <QuestionCard label="Q25. 食べ物のアレルギーありますか？">
        <TextInput
          value={data.allergies}
          onChange={(v) => onChange({ allergies: v })}
          placeholder="例: 卵アレルギー、なし"
        />
      </QuestionCard>
    </>
  );
}
