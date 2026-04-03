import type { SurveyFormData } from '../../../types/survey';
import QuestionCard from '../components/QuestionCard';
import { SingleSelect, MultiSelect } from '../components/FormComponents';
import {
  ACCOMMODATION_OPTIONS,
  TRANSPORTATION_OPTIONS,
  TICKET_OPTIONS,
  EXPRESS_PASS_OPTIONS,
} from '../../../data/survey-options';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
}

export default function StepLogistics({ data, onChange }: Props) {
  return (
    <>
      <QuestionCard label="Q6. 宿泊施設はどこですか？">
        <SingleSelect
          name="accommodation"
          options={ACCOMMODATION_OPTIONS}
          value={data.accommodation}
          onChange={(v) => onChange({ accommodation: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q7. ユニバへ来る手段は？">
        <SingleSelect
          name="transportation"
          options={TRANSPORTATION_OPTIONS}
          value={data.transportation}
          onChange={(v) => onChange({ transportation: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q8. チケットは何を購入されてますか？">
        <MultiSelect
          name="tickets"
          options={TICKET_OPTIONS.map((o) => ({ value: o }))}
          values={data.tickets}
          onChange={(v) => onChange({ tickets: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q9. エクスプレスパス購入は？">
        <SingleSelect
          name="express_pass"
          options={EXPRESS_PASS_OPTIONS}
          value={data.express_pass}
          onChange={(v) => onChange({ express_pass: v })}
        />
      </QuestionCard>
    </>
  );
}
