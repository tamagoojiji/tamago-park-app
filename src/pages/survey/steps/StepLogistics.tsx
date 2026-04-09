import type { SurveyFormData } from '../../../types/survey';
import QuestionCard from '../components/QuestionCard';
import { SingleSelect, MultiSelect, OtherComment } from '../components/FormComponents';
import {
  ACCOMMODATION_OPTIONS,
  TRANSPORTATION_OPTIONS,
  TICKET_PURCHASED_OPTIONS,
  TICKET_OPTIONS,
  EXPRESS_PASS_OPTIONS,
} from '../../../data/survey-options';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
}

export default function StepLogistics({ data, onChange }: Props) {
  const showTicketTypes = data.ticket_purchased === '購入済み' || data.ticket_purchased === 'まだ購入していない';

  return (
    <>
      <QuestionCard label="Q6. 宿泊施設はどこですか？">
        <SingleSelect
          name="accommodation"
          options={ACCOMMODATION_OPTIONS}
          value={data.accommodation}
          onChange={(v) => onChange({ accommodation: v })}
        />
        <OtherComment fieldName="accommodation" data={data} onChange={onChange} show={data.accommodation === 'その他'} />
      </QuestionCard>

      <QuestionCard label="Q7. ユニバへ来る手段は？">
        <SingleSelect
          name="transportation"
          options={TRANSPORTATION_OPTIONS}
          value={data.transportation}
          onChange={(v) => onChange({ transportation: v })}
        />
        <OtherComment fieldName="transportation" data={data} onChange={onChange} show={data.transportation === 'その他'} />
      </QuestionCard>

      <QuestionCard label="Q8. チケットはどれを購入されますか？（購入していますか）" note="悩んでいる場合は複数選択して、その他にコメントください">
        <SingleSelect
          name="ticket_purchased"
          options={TICKET_PURCHASED_OPTIONS}
          value={data.ticket_purchased}
          onChange={(v) => onChange({ ticket_purchased: v })}
        />
        {showTicketTypes && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-sub)', marginBottom: 8 }}>
              {data.ticket_purchased === '購入済み' ? 'どのチケットを購入しましたか？' : 'どのチケットにする予定ですか？'}
            </div>
            <MultiSelect
              name="tickets"
              options={TICKET_OPTIONS.map((o) => ({ value: o }))}
              values={data.tickets}
              onChange={(v) => onChange({ tickets: v })}
            />
            <OtherComment fieldName="tickets" data={data} onChange={onChange} show={data.tickets.includes('その他')} />
          </div>
        )}
      </QuestionCard>

      <QuestionCard label="Q9. エクスプレスパス購入は？">
        <SingleSelect
          name="express_pass"
          options={EXPRESS_PASS_OPTIONS}
          value={data.express_pass}
          onChange={(v) => onChange({ express_pass: v })}
        />
        <OtherComment fieldName="express_pass" data={data} onChange={onChange} show={data.express_pass === 'その他'} />
      </QuestionCard>
    </>
  );
}
