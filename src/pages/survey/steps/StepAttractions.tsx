import { useMemo } from 'react';
import type { SurveyFormData } from '../../../types/survey';
import type { ClosureEntry } from '../../../data/closures';
import type { HeightRestriction } from '../../../data/height-restrictions';
import { heightRestrictions } from '../../../data/height-restrictions';
import QuestionCard from '../components/QuestionCard';
import { MultiSelect, type MultiSelectOption } from '../components/FormComponents';
import {
  CHARACTER_OPTIONS,
  MAIN_ACTIVITY_OPTIONS,
  THRILL_ATTRACTION_OPTIONS,
  KIDS_ATTRACTION_OPTIONS,
} from '../../../data/survey-options';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
  closures: ClosureEntry[];
}

// 身長をパースしてリスト化（"110cm, 95cm" → [110, 95]）
function parseHeights(text: string): number[] {
  const nums = text.match(/\d+/g);
  return nums ? nums.map(Number) : [];
}

// アトラクションの身長制限を取得
function getRestriction(name: string): HeightRestriction | undefined {
  return heightRestrictions.find(
    (r) => name.includes(r.name) || r.name.includes(name.replace(/～.*$/, '').trim())
  );
}

export default function StepAttractions({ data, onChange, closures }: Props) {
  const childHeights = useMemo(() => parseHeights(data.child_heights), [data.child_heights]);
  const minChildHeight = childHeights.length > 0 ? Math.min(...childHeights) : null;

  const closedNames = useMemo(
    () => new Set(closures.map((c) => c.name)),
    [closures]
  );

  // アトラクション選択肢にバッジを付与
  const buildOptions = (opts: readonly string[]): MultiSelectOption[] =>
    opts.map((name) => {
      const isClosed = closedNames.has(name);
      const restriction = getRestriction(name);
      const minRequired = restriction
        ? Math.min(restriction.aloneMin || 999, restriction.withAdultMin || 999)
        : 0;
      const heightWarning = minChildHeight !== null && minRequired > 0 && minChildHeight < minRequired;

      return {
        value: name,
        disabled: isClosed,
        badge: isClosed
          ? '休止中'
          : heightWarning
            ? `身長${minRequired}cm〜`
            : undefined,
        badgeType: isClosed ? 'closed' as const : heightWarning ? 'height' as const : undefined,
      };
    });

  return (
    <>
      <QuestionCard label="Q13. どのキャラクターが好きですか？">
        <MultiSelect
          name="characters"
          options={CHARACTER_OPTIONS.map((o) => ({ value: o }))}
          values={data.favorite_characters}
          onChange={(v) => onChange({ favorite_characters: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q14. なにをメインで遊びたい？">
        <MultiSelect
          name="main_activities"
          options={MAIN_ACTIVITY_OPTIONS.map((o) => ({ value: o }))}
          values={data.main_activities}
          onChange={(v) => onChange({ main_activities: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q15. このアトラクションは外せない！（絶叫系）" note={closures.length > 0 ? `来園日に${closures.length}件のアトラクションが休止中です` : undefined}>
        <MultiSelect
          name="thrill_attractions"
          options={buildOptions(THRILL_ATTRACTION_OPTIONS)}
          values={data.thrill_attractions}
          onChange={(v) => onChange({ thrill_attractions: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q16. このアトラクションは外せない！（キッズ系）">
        <MultiSelect
          name="kids_attractions"
          options={buildOptions(KIDS_ATTRACTION_OPTIONS)}
          values={data.kids_attractions}
          onChange={(v) => onChange({ kids_attractions: v })}
        />
      </QuestionCard>
    </>
  );
}
