import { useMemo } from 'react';
import type { SurveyFormData, ChildHeightEntry } from '../../../types/survey';
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
  YOYAKUNORI_ATTRACTIONS,
} from '../../../data/survey-options';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
  closures: ClosureEntry[];
}

// ChildHeightEntry[] から身長数値リストを取得
function extractHeights(entries: ChildHeightEntry[]): number[] {
  return entries
    .map((e) => parseInt(e.height, 10))
    .filter((n) => !isNaN(n) && n > 0);
}

// アトラクションの身長制限を取得
function getRestriction(name: string): HeightRestriction | undefined {
  return heightRestrictions.find(
    (r) => name.includes(r.name) || r.name.includes(name.replace(/～.*$/, '').trim())
  );
}

export default function StepAttractions({ data, onChange, closures }: Props) {
  const childHeights = useMemo(() => extractHeights(data.child_heights), [data.child_heights]);
  const minChildHeight = childHeights.length > 0 ? Math.min(...childHeights) : null;

  const closedNames = useMemo(
    () => new Set(closures.map((c) => c.name)),
    [closures]
  );

  // アトラクション選択肢にバッジを付与（休止中は一番下へ）
  const buildOptions = (opts: readonly string[], showYoyakunori = false, useWithAdult = false): MultiSelectOption[] => {
    const mapped = opts.map((name) => {
      const isClosed = closedNames.has(name);
      const restriction = getRestriction(name);
      const minRequired = restriction
        ? useWithAdult
          ? (restriction.withAdultMin || 0)
          : Math.min(restriction.aloneMin || 999, restriction.withAdultMin || 999)
        : 0;
      const heightWarning = minChildHeight !== null && minRequired > 0 && minChildHeight < minRequired;
      const isYoyakunori = showYoyakunori && YOYAKUNORI_ATTRACTIONS.has(name);
      const heightLabel = useWithAdult && restriction?.withAdultMin ? ` [${restriction.withAdultMin}cm〜]` : '';
      const displayLabel = (isYoyakunori ? `${name}（よやくのり対象）` : name) + heightLabel;

      return {
        value: name,
        label: displayLabel,
        disabled: isClosed,
        badge: isClosed
          ? '休止中'
          : heightWarning
            ? `身長${minRequired}cm〜`
            : undefined,
        badgeType: isClosed ? 'closed' as const : heightWarning ? 'height' as const : undefined,
      };
    });
    return mapped.sort((a, b) => (a.disabled ? 1 : 0) - (b.disabled ? 1 : 0));
  };

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
        <div style={{
          background: '#E3F0FC', borderRadius: 'var(--radius-sm)',
          padding: '8px 12px', marginBottom: 10, fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary-dark)',
        }}>
          ※ 同伴者ありの場合の身長制限です
        </div>
        <MultiSelect
          name="kids_attractions"
          options={buildOptions(KIDS_ATTRACTION_OPTIONS, true, true)}
          values={data.kids_attractions}
          onChange={(v) => onChange({ kids_attractions: v })}
        />
      </QuestionCard>
    </>
  );
}
