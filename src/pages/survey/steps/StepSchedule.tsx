import type { SurveyFormData } from '../../../types/survey';
import QuestionCard from '../components/QuestionCard';
import { SingleSelect } from '../components/FormComponents';
import {
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
      <QuestionCard
        label="Q11. 朝何時から並べますか？"
        note="朝ゲート前で並ぶのはじっと待つだけですが、アトラクションの待ち列はずっと歩くので疲れ方が全然違います。また、途中合流はできませんのでご注意ください。"
      >
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
