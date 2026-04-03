import type { SurveyFormData } from '../../../types/survey';
import QuestionCard from '../components/QuestionCard';
import { SingleSelect, MultiSelect, TextInput } from '../components/FormComponents';
import {
  BUDGET_OPTIONS,
  POWER_UP_BAND_OPTIONS,
  MAGIC_WAND_OPTIONS,
  CLUB_UNIVERSAL_OPTIONS,
  OFFICIAL_APP_OPTIONS,
  TICKET_REGISTERED_OPTIONS,
  UNKNOWN_TERMS_OPTIONS,
  REFERRAL_OPTIONS,
  MEET_OPTIONS,
} from '../../../data/survey-options';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
}

export default function StepExtras({ data, onChange }: Props) {
  return (
    <>
      <QuestionCard label="Q25. 課金はどこまで考えてますか？">
        <SingleSelect
          name="budget_level"
          options={BUDGET_OPTIONS}
          value={data.budget_level}
          onChange={(v) => onChange({ budget_level: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q26. パワーアップバンド購入予定ですか？">
        <SingleSelect
          name="power_up_band"
          options={POWER_UP_BAND_OPTIONS}
          value={data.power_up_band}
          onChange={(v) => onChange({ power_up_band: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q27. ハリーポッター魔法の杖購入予定ですか？">
        <SingleSelect
          name="magic_wand"
          options={MAGIC_WAND_OPTIONS}
          value={data.magic_wand}
          onChange={(v) => onChange({ magic_wand: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q28. クラブユニバーサルのアカウントは作成済みですか？">
        <SingleSelect
          name="club_universal"
          options={CLUB_UNIVERSAL_OPTIONS}
          value={data.club_universal}
          onChange={(v) => onChange({ club_universal: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q29. ユニバ公式アプリはダウンロードできていますか？">
        <SingleSelect
          name="official_app"
          options={OFFICIAL_APP_OPTIONS}
          value={data.official_app}
          onChange={(v) => onChange({ official_app: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q30. 公式アプリにチケット登録は終わっていますか？">
        <SingleSelect
          name="ticket_registered"
          options={TICKET_REGISTERED_OPTIONS}
          value={data.ticket_registered}
          onChange={(v) => onChange({ ticket_registered: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q31. 特別な要望や期待はある？">
        <TextInput
          value={data.special_requests}
          onChange={(v) => onChange({ special_requests: v })}
          placeholder="自由にお書きください"
          multiline
        />
      </QuestionCard>

      <QuestionCard label="Q32. 知らない言葉どれぐらいありますか？" note="知らない言葉を選んでください">
        <MultiSelect
          name="unknown_terms"
          options={UNKNOWN_TERMS_OPTIONS.map((o) => ({ value: o }))}
          values={data.unknown_terms}
          onChange={(v) => onChange({ unknown_terms: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q33. どこで（誰から）たまごを知りましたか？">
        <MultiSelect
          name="referral_source"
          options={REFERRAL_OPTIONS.map((o) => ({ value: o }))}
          values={data.referral_source}
          onChange={(v) => onChange({ referral_source: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q34. 当日、会っても大丈夫？">
        <SingleSelect
          name="meet_ok"
          options={MEET_OPTIONS}
          value={data.meet_ok}
          onChange={(v) => onChange({ meet_ok: v })}
        />
      </QuestionCard>
    </>
  );
}
