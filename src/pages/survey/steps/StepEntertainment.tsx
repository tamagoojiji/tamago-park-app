import { useMemo } from 'react';
import type { SurveyFormData } from '../../../types/survey';
import type { ShowData } from '../../../api/shows';
import QuestionCard from '../components/QuestionCard';
import { MultiSelect, type MultiSelectOption } from '../components/FormComponents';
import {
  SHOW_OPTIONS,
  SEASONAL_SHOW_OPTIONS,
  GREETING_OPTIONS,
  HALLOWEEN_EVENT_OPTIONS,
  HALLOWEEN_GREETING,
  HALLOWEEN_PERIOD,
  activeHalloweenOptions,
} from '../../../data/survey-options';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
  shows: ShowData[];
  showsLoaded: boolean;
  visitDate: string;
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

// ハロウィーン限定イベント名のセット（通常リストとの二重表示防止・選択値の振り分け用）
const HALLOWEEN_NAMES = new Set<string>(HALLOWEEN_EVENT_OPTIONS.map((o) => o.name));

function isHalloween(showName: string): boolean {
  if (HALLOWEEN_NAMES.has(showName)) return true;
  if (showName.includes(HALLOWEEN_GREETING) || HALLOWEEN_GREETING.includes(showName)) return true;
  for (const hw of HALLOWEEN_NAMES) {
    if (showName.includes(hw) || hw.includes(showName)) return true;
  }
  return false;
}

export default function StepEntertainment({ data, onChange, shows, showsLoaded, visitDate }: Props) {
  const halloween = useMemo(() => activeHalloweenOptions(visitDate), [visitDate]);
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

  // 季節・期間限定ショー
  const seasonalOptions: MultiSelectOption[] = useMemo(() => {
    const apiOnlyShows = shows
      .filter((s) => !isPermanent(s.name) && !isHalloween(s.name) && !SEASONAL_SHOW_OPTIONS.some(opt => s.name.includes(opt) || opt.includes(s.name)))
      .map((s) => s.name);

    const allNames = [...SEASONAL_SHOW_OPTIONS, ...apiOnlyShows];

    return allNames.map((name): MultiSelectOption => {
      if (!showsLoaded || shows.length === 0) return { value: name };
      const baseName = name.replace(/（[^）]+）$/, '');
      const isActive = shows.some(s => s.name.includes(baseName) || baseName.includes(s.name));
      return {
        value: name,
        badge: isActive ? undefined : 'この日は公演なし',
        badgeType: isActive ? undefined : 'closed' as const,
      };
    });
  }, [shows, showsLoaded]);

  // ハロウィーン限定: 年齢制限バッジ優先、timetable掲載対象のみ公演なし判定
  const halloweenOptions: MultiSelectOption[] = useMemo(() => {
    return halloween.map((o): MultiSelectOption => {
      if (o.age) return { value: o.name, label: o.label, badge: o.age, badgeType: 'height' as const };
      if (!o.timetable || !showsLoaded || shows.length === 0) return { value: o.name, label: o.label };
      const isActive = shows.some(s => s.name.includes(o.name) || o.name.includes(s.name));
      return {
        value: o.name,
        label: o.label,
        badge: isActive ? undefined : 'この日は公演なし',
        badgeType: isActive ? undefined : 'closed' as const,
      };
    });
  }, [halloween, shows, showsLoaded]);

  // グリーティング: ハロウィーン期間中はミニオンの直後にベロウィーンを挿入
  const greetingOptions: MultiSelectOption[] = useMemo(() => {
    const inHalloween = !!visitDate && visitDate >= HALLOWEEN_PERIOD.start && visitDate <= HALLOWEEN_PERIOD.end;
    const names: string[] = [];
    for (const o of GREETING_OPTIONS) {
      names.push(o);
      if (inHalloween && o === 'ミニオン') names.push(HALLOWEEN_GREETING);
    }
    return names.map((name) => ({ value: name }));
  }, [visitDate]);

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
      </QuestionCard>

      {halloween.length > 0 && (
        <QuestionCard label="Q19. ハロウィーン・ホラー・ナイトのイベントは参加したい？（9/11〜11/8）">
          <MultiSelect
            name="seasonal_events_halloween"
            options={halloweenOptions}
            values={data.seasonal_events}
            onChange={(v) => {
              const nonHalloween = data.seasonal_events.filter(e => !HALLOWEEN_NAMES.has(e));
              const halloweenSelected = v.filter(e => HALLOWEEN_NAMES.has(e));
              onChange({ seasonal_events: [...nonHalloween, ...halloweenSelected] });
            }}
          />
        </QuestionCard>
      )}

      <QuestionCard label="Q20. グリーティングは参加したい？">
        <MultiSelect
          name="greetings"
          options={greetingOptions}
          values={data.greetings}
          onChange={(v) => onChange({ greetings: v })}
        />
      </QuestionCard>
    </>
  );
}
