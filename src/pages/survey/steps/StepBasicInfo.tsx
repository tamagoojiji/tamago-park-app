import type { SurveyFormData } from '../../../types/survey';
import QuestionCard from '../components/QuestionCard';
import { TextInput, DateInput, SingleSelect } from '../components/FormComponents';
import { SERVICE_TYPES } from '../../../data/survey-options';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
}

export default function StepBasicInfo({ data, onChange }: Props) {
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

      <QuestionCard label="Q3. いつ遊びに来る予定？（初日を記載）" required>
        <DateInput
          value={data.visit_date}
          onChange={(v) => onChange({ visit_date: v })}
        />
      </QuestionCard>
    </>
  );
}
