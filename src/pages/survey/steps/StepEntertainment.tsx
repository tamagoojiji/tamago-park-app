import { useMemo, useState } from 'react';
import type { SurveyFormData } from '../../../types/survey';
import type { ShowData } from '../../../api/shows';
import QuestionCard from '../components/QuestionCard';
import { MultiSelect, type MultiSelectOption } from '../components/FormComponents';
import { SHOW_OPTIONS, SEASONAL_SHOW_OPTIONS, GREETING_OPTIONS } from '../../../data/survey-options';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
  shows: ShowData[];
  showsLoaded: boolean;
}

// 常設ショー名のセット（部分一致判定用）
const PERMANENT_NAMES = new Set<string>(SHOW_OPTIONS);

// API未掲載の常設ショー（バッジ判定を免除）
const API_EXEMPT_SHOWS = new Set<string>();

function isPermanent(showName: string): boolean {
  if (PERMANENT_NAMES.has(showName)) return true;
  for (const perm of PERMANENT_NAMES) {
    if (showName.includes(perm) || perm.includes(showName)) return true;
  }
  return false;
}

const JURASSIC_PREFIX = 'ジュラシック・ワールド';
const JURASSIC_GROUP_LABEL = 'ジュラシック・ワールド：恐竜のグリーティングとショー';

export default function StepEntertainment({ data, onChange, shows, showsLoaded }: Props) {
  const [jurassicOpen, setJurassicOpen] = useState(false);
  // 常設ショー選択肢にステータスバッジを付与
  const showOptions: MultiSelectOption[] = useMemo(() => {
    if (shows.length === 0) return SHOW_OPTIONS.map((name) => ({ value: name }));

    return SHOW_OPTIONS.map((name) => {
      if (API_EXEMPT_SHOWS.has(name)) return { value: name };
      const isActive = shows.some(s => s.name.includes(name) || name.includes(s.name));
      return {
        value: name,
        badge: isActive ? undefined : 'この日は公演なし',
        badgeType: isActive ? undefined : 'closed' as const,
      };
    });
  }, [shows]);

  // 季節系: ジュラシック系を分離、残りは通常表示
  const { seasonalOptions, jurassicOptions } = useMemo(() => {
    const apiOnlyShows = shows
      .filter((s) => !isPermanent(s.name) && !SEASONAL_SHOW_OPTIONS.some(opt => s.name.includes(opt) || opt.includes(s.name)))
      .map((s) => s.name);

    const allNames = [...SEASONAL_SHOW_OPTIONS, ...apiOnlyShows];

    const buildOption = (name: string): MultiSelectOption => {
      if (!showsLoaded || shows.length === 0) return { value: name };
      const baseName = name.replace(/（[^）]+）$/, '');
      const isActive = shows.some(s => s.name.includes(baseName) || baseName.includes(s.name));
      return {
        value: name,
        badge: isActive ? undefined : 'この日は公演なし',
        badgeType: isActive ? undefined : 'closed' as const,
      };
    };

    const seasonal: MultiSelectOption[] = [];
    const jurassic: MultiSelectOption[] = [];
    for (const name of allNames) {
      if (name.startsWith(JURASSIC_PREFIX)) {
        jurassic.push(buildOption(name));
      } else {
        seasonal.push(buildOption(name));
      }
    }
    return { seasonalOptions: seasonal, jurassicOptions: jurassic };
  }, [shows, showsLoaded]);

  const permanentActiveCount = useMemo(
    () => shows.filter((s) => isPermanent(s.name)).length,
    [shows]
  );

  return (
    <>
      <QuestionCard
        label="Q17. ショーやパレードは見たい？（常設）"
        note={shows.length > 0 ? `来園日に${permanentActiveCount}件の常設ショーが公演予定` : undefined}
      >
        <MultiSelect
          name="shows"
          options={showOptions}
          values={data.shows}
          onChange={(v) => onChange({ shows: v })}
        />
      </QuestionCard>

      <QuestionCard
        label="Q18. ショーやパレードは見たい？（季節・期間限定）"
      >
        <MultiSelect
          name="seasonal_events"
          options={seasonalOptions}
          values={data.seasonal_events}
          onChange={(v) => onChange({ seasonal_events: v })}
        />
        <div
          onClick={() => setJurassicOpen(!jurassicOpen)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', marginTop: 4,
            background: 'var(--color-bg-card, #fff)', borderRadius: 'var(--radius-sm)',
            border: '1.5px solid var(--color-border, #ddd)', cursor: 'pointer',
            fontWeight: 600, fontSize: 'var(--text-sm)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {JURASSIC_GROUP_LABEL}
            {data.seasonal_events.some(v => v.startsWith(JURASSIC_PREFIX)) && (
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)' }}>
                {data.seasonal_events.filter(v => v.startsWith(JURASSIC_PREFIX)).length}件選択中
              </span>
            )}
          </span>
          <span style={{ transition: 'transform 0.2s', transform: jurassicOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </div>
        {jurassicOpen && (
          <div style={{ marginTop: 4 }}>
            <MultiSelect
              name="seasonal_events_jurassic"
              options={jurassicOptions}
              values={data.seasonal_events}
              onChange={(v) => {
                const nonJurassic = data.seasonal_events.filter(e => !e.startsWith(JURASSIC_PREFIX));
                const jurassicSelected = v.filter(e => e.startsWith(JURASSIC_PREFIX));
                onChange({ seasonal_events: [...nonJurassic, ...jurassicSelected] });
              }}
            />
          </div>
        )}
      </QuestionCard>

      <QuestionCard label="Q19. グリーティングは参加したい？">
        <MultiSelect
          name="greetings"
          options={GREETING_OPTIONS.map((o) => ({ value: o }))}
          values={data.greetings}
          onChange={(v) => onChange({ greetings: v })}
        />
      </QuestionCard>
    </>
  );
}
