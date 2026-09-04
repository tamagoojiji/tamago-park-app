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
  YOYAKUNORI_ATTRACTIONS,
  applySeasonalVariants,
} from '../../../data/survey-options';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
  closures: ClosureEntry[];
}

// 商標記号・空白の差を吸収して名称を比較する（closures.json は™なし表記）
const normName = (s: string) => s.replace(/[™®\s]/g, '');

// アトラクションの身長制限を取得
function getRestriction(name: string): HeightRestriction | undefined {
  return heightRestrictions.find(
    (r) => name.includes(r.name) || r.name.includes(name.replace(/～.*$/, '').trim())
  );
}

export default function StepAttractions({ data, onChange, closures }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const thrillOptions = useMemo(() => applySeasonalVariants(THRILL_ATTRACTION_OPTIONS, today), [today]);
  const kidsOptions = useMemo(() => applySeasonalVariants(KIDS_ATTRACTION_OPTIONS, today), [today]);

  const closedNames = useMemo(
    () => new Set(closures.map((c) => normName(c.name))),
    [closures]
  );

  // アトラクション選択肢にバッジを付与（休止中は一番下へ）
  const buildOptions = (opts: readonly string[], showYoyakunori = false, useWithAdult = false): MultiSelectOption[] => {
    const mapped = opts.map((name) => {
      const isClosed = closedNames.has(normName(name));
      const restriction = getRestriction(name);
      const isYoyakunori = showYoyakunori && YOYAKUNORI_ATTRACTIONS.has(name);
      const displayLabel = isYoyakunori ? `${name}（よやくのり対象）` : name;

      // バッジ: 休止中 > 身長制限（常に表示）
      const heightBadge = restriction
        ? useWithAdult
          ? restriction.withAdultMin > 0
            ? `身長${restriction.withAdultMin}cm〜`
            : restriction.note || '制限なし'
          : restriction.withAdultMin === 0 && restriction.aloneMin > 0
            ? '付き添いあれば制限なし'
            : restriction.aloneMin > 0 && restriction.withAdultMin > 0 && restriction.withAdultMin < restriction.aloneMin
              ? `身長${restriction.aloneMin}cm〜\n付き添いありの場合\n${restriction.withAdultMin}cm〜`
              : restriction.aloneMin > 0
                ? `身長${restriction.aloneMin}cm〜`
                : undefined
        : undefined;

      return {
        value: name,
        label: displayLabel,
        disabled: isClosed,
        badge: isClosed ? '休止中' : heightBadge,
        badgeType: isClosed ? 'closed' as const : heightBadge ? 'active' as const : undefined,
        image: restriction?.image,
      };
    });
    return mapped.sort((a, b) => (a.disabled ? 1 : 0) - (b.disabled ? 1 : 0));
  };

  return (
    <>
      <QuestionCard label="Q13. どのキャラクターが好きですか？（複数選択可）">
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
          options={buildOptions(thrillOptions)}
          values={data.thrill_attractions}
          onChange={(v) => onChange({ thrill_attractions: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q16. このアトラクションは外せない！（キッズ系）">
        <div style={{
          background: '#E3F0FC', borderRadius: 'var(--radius-sm)',
          padding: '8px 12px', marginBottom: 10, fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary-dark)',
        }}>
          ※ 同伴者（中学生以上）ありの場合の身長制限です
        </div>
        <MultiSelect
          name="kids_attractions"
          options={buildOptions(kidsOptions, true, true)}
          values={data.kids_attractions}
          onChange={(v) => onChange({ kids_attractions: v })}
        />
      </QuestionCard>
    </>
  );
}
