import type { SurveyFormData, PartyInfo } from '../../../types/survey';
import QuestionCard from '../components/QuestionCard';
import { TextInput, NumberGrid } from '../components/FormComponents';
import { PARTY_CATEGORIES } from '../../../data/survey-options';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
}

export default function StepPartyInfo({ data, onChange }: Props) {
  const handlePartyChange = (key: string, value: number) => {
    onChange({ party: { ...data.party, [key]: value } as PartyInfo });
  };

  return (
    <>
      <QuestionCard label="Q4. 参加する人は何人？" required>
        <NumberGrid
          categories={PARTY_CATEGORIES.map((c) => ({ key: c.key, label: c.label }))}
          values={data.party as unknown as Record<string, number>}
          onChange={handlePartyChange}
        />
      </QuestionCard>

      <QuestionCard label="Q5. おこさんの身長は？" note="お子さんがいない場合は空欄でOK。複数のお子さんがいる場合はそれぞれ記入してください。">
        <TextInput
          value={data.child_heights}
          onChange={(v) => onChange({ child_heights: v })}
          placeholder="例: 110cm, 95cm"
        />
      </QuestionCard>
    </>
  );
}
