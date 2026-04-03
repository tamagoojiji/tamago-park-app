import { useMemo } from 'react';
import type { SurveyFormData } from '../../../types/survey';
import type { ShowData } from '../../../api/shows';
import QuestionCard from '../components/QuestionCard';
import { MultiSelect, type MultiSelectOption } from '../components/FormComponents';
import { SHOW_OPTIONS, GREETING_OPTIONS } from '../../../data/survey-options';

interface EventEntry {
  name: string;
  start: string;
  end: string;
}

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
  shows: ShowData[];
  events: EventEntry[];
  visitDate: string;
}

export default function StepEntertainment({ data, onChange, shows, events, visitDate }: Props) {
  // 来園日に公演があるショー名のセット
  const activeShowNames = useMemo(
    () => new Set(shows.map((s) => s.name)),
    [shows]
  );

  // 常設ショー選択肢にステータスバッジを付与
  const showOptions: MultiSelectOption[] = SHOW_OPTIONS.map((name) => {
    // ショーデータが存在する場合のみ判定
    if (shows.length > 0) {
      const isActive = activeShowNames.has(name) ||
        // 部分一致でも確認
        shows.some(s => s.name.includes(name) || name.includes(s.name));
      return {
        value: name,
        badge: isActive ? undefined : 'この日は公演なし',
        badgeType: isActive ? undefined : 'closed' as const,
      };
    }
    return { value: name };
  });

  // 来園日に開催中のイベントのみ
  const activeEvents: MultiSelectOption[] = useMemo(() => {
    if (!visitDate) return events.map((e) => ({ value: e.name }));
    return events
      .filter((e) => e.start <= visitDate && e.end >= visitDate)
      .map((e) => ({ value: e.name, badge: '開催中', badgeType: 'active' as const }));
  }, [events, visitDate]);

  return (
    <>
      <QuestionCard
        label="Q17. ショーやパレードは見たい？（常設系）"
        note={shows.length > 0 ? `来園日に${shows.length}件のショーが公演予定` : undefined}
      >
        <MultiSelect
          name="shows"
          options={showOptions}
          values={data.shows}
          onChange={(v) => onChange({ shows: v })}
        />
      </QuestionCard>

      <QuestionCard
        label="Q18. ショーやパレードは見たい？（季節イベント系）"
        note={activeEvents.length > 0 ? `来園日に${activeEvents.length}件のイベントが開催中` : 'イベント情報を読み込み中...'}
      >
        <MultiSelect
          name="seasonal_events"
          options={activeEvents}
          values={data.seasonal_events}
          onChange={(v) => onChange({ seasonal_events: v })}
        />
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
