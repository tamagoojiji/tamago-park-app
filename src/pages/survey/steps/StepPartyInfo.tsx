import type { SurveyFormData, PartyInfo, ChildHeightEntry } from '../../../types/survey';
import QuestionCard from '../components/QuestionCard';
import { NumberGrid, toHalfWidth } from '../components/FormComponents';
import { PARTY_CATEGORIES, ELEMENTARY_GRADE_OPTIONS, YOUNG_CHILDREN_AGE_OPTIONS } from '../../../data/survey-options';
import styles from '../components/FormComponents.module.css';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
}

function buildHeightEntries(grades: number[], ages: number[]): ChildHeightEntry[] {
  const entries: ChildHeightEntry[] = [];
  grades.forEach((g) => entries.push({ label: `小学${g}年生`, height: '' }));
  ages.forEach((a) => entries.push({ label: `${a}歳`, height: '' }));
  return entries;
}

function mergeHeights(prev: ChildHeightEntry[], next: ChildHeightEntry[]): ChildHeightEntry[] {
  return next.map((entry) => {
    const existing = prev.find((p) => p.label === entry.label);
    return existing ? { ...entry, height: existing.height } : entry;
  });
}

export default function StepPartyInfo({ data, onChange }: Props) {
  const handlePartyChange = (key: string, value: number) => {
    const newParty = { ...data.party, [key]: value } as PartyInfo;
    const patch: Partial<SurveyFormData> = { party: newParty };

    if (key === 'elementary') {
      const newGrades = adjustArray(data.elementary_grades, value);
      patch.elementary_grades = newGrades;
      const newHeights = mergeHeights(data.child_heights, buildHeightEntries(newGrades, data.young_children_ages));
      patch.child_heights = newHeights;
    }
    if (key === 'young_children') {
      const newAges = adjustArray(data.young_children_ages, value);
      patch.young_children_ages = newAges;
      const newHeights = mergeHeights(data.child_heights, buildHeightEntries(data.elementary_grades, newAges));
      patch.child_heights = newHeights;
    }

    onChange(patch);
  };

  const handleGradeChange = (index: number, grade: number) => {
    const newGrades = [...data.elementary_grades];
    newGrades[index] = grade;
    const newHeights = mergeHeights(data.child_heights, buildHeightEntries(newGrades, data.young_children_ages));
    onChange({ elementary_grades: newGrades, child_heights: newHeights });
  };

  const handleAgeChange = (index: number, age: number) => {
    const newAges = [...data.young_children_ages];
    newAges[index] = age;
    const newHeights = mergeHeights(data.child_heights, buildHeightEntries(data.elementary_grades, newAges));
    onChange({ young_children_ages: newAges, child_heights: newHeights });
  };

  const handleHeightChange = (index: number, height: string) => {
    const newHeights = [...data.child_heights];
    newHeights[index] = { ...newHeights[index], height };
    onChange({ child_heights: newHeights });
  };

  const hasChildren = data.party.elementary > 0 || data.party.young_children > 0;

  return (
    <>
      <QuestionCard label="Q4. 参加する人は何人？" required>
        <NumberGrid
          categories={PARTY_CATEGORIES.map((c) => ({ key: c.key, label: c.label }))}
          values={data.party as unknown as Record<string, number>}
          onChange={handlePartyChange}
        />

        {data.party.elementary > 0 && (
          <div style={{ marginTop: 16, padding: 12, background: '#F8F9FA', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-sub)', marginBottom: 8 }}>
              小学生の学年を選んでください
            </div>
            {data.elementary_grades.map((grade, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 'var(--text-xs)', minWidth: 50 }}>{i + 1}人目</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {ELEMENTARY_GRADE_OPTIONS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleGradeChange(i, g)}
                      style={{
                        width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                        border: `2px solid ${grade === g ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: grade === g ? '#E3F0FC' : '#fff',
                        color: grade === g ? 'var(--color-primary)' : 'var(--color-text)',
                        fontWeight: grade === g ? 700 : 500,
                        fontSize: 'var(--text-xs)', cursor: 'pointer',
                      }}
                    >
                      {g}年
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.party.young_children > 0 && (
          <div style={{ marginTop: 16, padding: 12, background: '#F8F9FA', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-sub)', marginBottom: 8 }}>
              お子さんの年齢を選んでください
            </div>
            {data.young_children_ages.map((age, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 'var(--text-xs)', minWidth: 50 }}>{i + 1}人目</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {YOUNG_CHILDREN_AGE_OPTIONS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => handleAgeChange(i, a)}
                      style={{
                        width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                        border: `2px solid ${age === a ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: age === a ? '#E3F0FC' : '#fff',
                        color: age === a ? 'var(--color-primary)' : 'var(--color-text)',
                        fontWeight: age === a ? 700 : 500,
                        fontSize: 'var(--text-xs)', cursor: 'pointer',
                      }}
                    >
                      {a}歳
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </QuestionCard>

      {hasChildren && (
        <QuestionCard label="Q5. おこさんの身長は？" note="靴を履いた身長をお願いします。アトラクションの身長制限の確認に使います">
          {data.child_heights.map((entry, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, minWidth: 80 }}>{entry.label}</span>
              <input
                type="text"
                inputMode="numeric"
                className={styles.textInput}
                value={entry.height}
                onChange={(e) => handleHeightChange(i, toHalfWidth(e.target.value))}
                placeholder="cm"
                style={{ width: 80, textAlign: 'center' }}
              />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-sub)' }}>cm</span>
            </div>
          ))}
        </QuestionCard>
      )}
    </>
  );
}

function adjustArray(arr: number[], newLength: number): number[] {
  if (newLength <= 0) return [];
  if (arr.length >= newLength) return arr.slice(0, newLength);
  return [...arr, ...Array(newLength - arr.length).fill(0)];
}
