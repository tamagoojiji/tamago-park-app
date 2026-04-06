import type { SurveyFormData, VisitDateEntry } from '../../../types/survey';
import QuestionCard from '../components/QuestionCard';
import { TextInput, SingleSelect } from '../components/FormComponents';
import { SERVICE_TYPES, VISIT_START_TIME_OPTIONS } from '../../../data/survey-options';
import styles from '../components/FormComponents.module.css';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
}

export default function StepBasicInfo({ data, onChange }: Props) {
  const addDate = () => {
    onChange({ visit_dates: [...data.visit_dates, { date: '', start_time: '' }] });
  };

  const updateDate = (index: number, patch: Partial<VisitDateEntry>) => {
    const updated = data.visit_dates.map((entry, i) =>
      i === index ? { ...entry, ...patch } : entry
    );
    onChange({ visit_dates: updated });
  };

  const removeDate = (index: number) => {
    onChange({ visit_dates: data.visit_dates.filter((_, i) => i !== index) });
  };

  return (
    <>
      <QuestionCard label="Q1. 名前教えてください（アカウント名でOK）" required>
        <TextInput
          value={data.name}
          onChange={(v) => onChange({ name: v })}
          placeholder="例: たまご"
        />
      </QuestionCard>

      <QuestionCard label="Q2. 今回のご希望はプランニングですか？アテンドですか？" required>
        <SingleSelect
          name="service_type"
          options={SERVICE_TYPES}
          value={data.service_type}
          onChange={(v) => onChange({ service_type: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q3. いつ遊びに来る予定？" required note="複数日の場合は「日程を追加」で追加してください">
        {data.visit_dates.map((entry, index) => (
          <div key={index} style={{ marginBottom: 16, padding: 12, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: '#FAFBFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                {index === 0 ? '初日' : `${index + 1}日目`}
              </span>
              {data.visit_dates.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDate(index)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-red)', fontSize: 'var(--text-xs)', cursor: 'pointer', fontWeight: 600 }}
                >
                  削除
                </button>
              )}
            </div>
            <input
              type="date"
              className={styles.textInput}
              value={entry.date}
              onChange={(e) => updateDate(index, { date: e.target.value })}
              style={{ marginBottom: 8 }}
            />
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-sub)', marginBottom: 6 }}>何時から遊ぶ？</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {VISIT_START_TIME_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateDate(index, { start_time: opt })}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: `2px solid ${entry.start_time === opt ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: entry.start_time === opt ? '#E3F0FC' : '#fff',
                    color: entry.start_time === opt ? 'var(--color-primary)' : 'var(--color-text)',
                    fontWeight: entry.start_time === opt ? 600 : 500,
                    fontSize: 'var(--text-xs)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
        {data.visit_dates.length === 0 && (
          <button
            type="button"
            onClick={addDate}
            style={{
              width: '100%', padding: 14, border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-sm)', background: '#FAFBFC',
              color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--text-sm)',
              cursor: 'pointer',
            }}
          >
            + 日程を追加
          </button>
        )}
        {data.visit_dates.length > 0 && (
          <button
            type="button"
            onClick={addDate}
            style={{
              width: '100%', padding: 10, border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-sm)', background: '#FAFBFC',
              color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--text-xs)',
              cursor: 'pointer', marginTop: 4,
            }}
          >
            + もう1日追加
          </button>
        )}
      </QuestionCard>
    </>
  );
}
