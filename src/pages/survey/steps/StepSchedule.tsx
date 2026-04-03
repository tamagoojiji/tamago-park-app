import type { SurveyFormData } from '../../../types/survey';
import QuestionCard from '../components/QuestionCard';
import { SingleSelect } from '../components/FormComponents';
import {
  START_TIME_OPTIONS,
  LINEUP_TIME_OPTIONS,
  END_TIME_OPTIONS,
} from '../../../data/survey-options';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
}

export default function StepSchedule({ data, onChange }: Props) {
  return (
    <>
      <QuestionCard label="Q10. 何時から遊びたい？">
        <SingleSelect
          name="start_time"
          options={START_TIME_OPTIONS}
          value={data.start_time}
          onChange={(v) => onChange({ start_time: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q11. 朝何時から並べますか？" note="オープンより早く並ぶ場合の目安です">
        <SingleSelect
          name="lineup_time"
          options={LINEUP_TIME_OPTIONS}
          value={data.lineup_time}
          onChange={(v) => onChange({ lineup_time: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q12. 何時まで遊びたい？">
        <SingleSelect
          name="end_time"
          options={END_TIME_OPTIONS}
          value={data.end_time}
          onChange={(v) => onChange({ end_time: v })}
        />
      </QuestionCard>
    </>
  );
}
