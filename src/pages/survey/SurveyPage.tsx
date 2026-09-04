import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import type { SurveyFormData } from '../../types/survey';
import { INITIAL_SURVEY, STEPS } from '../../types/survey';
import type { ClosureEntry } from '../../data/closures';
import { fetchParkHours } from '../../data/hours';
import { fetchClosures, getClosuresForDate } from '../../data/closures';
import type { ShowData } from '../../api/shows';
import { fetchShows } from '../../api/shows';
import { submitSurvey, getSurvey, updateSurvey } from '../../api/survey';

import ProgressBar from './components/ProgressBar';
import StepBasicInfo from './steps/StepBasicInfo';
import StepPartyInfo from './steps/StepPartyInfo';
import StepLogistics from './steps/StepLogistics';
import StepSchedule from './steps/StepSchedule';
import StepAttractions from './steps/StepAttractions';
import StepEntertainment from './steps/StepEntertainment';
import StepDining from './steps/StepDining';
import StepExtras from './steps/StepExtras';
import styles from './SurveyPage.module.css';

const DRAFT_KEY = 'tamago_survey_draft';

export default function SurveyPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editSurveyId = searchParams.get('edit');
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(!!editSurveyId);
  const [formData, setFormData] = useState<SurveyFormData>(() => {
    if (editSurveyId) return { ...INITIAL_SURVEY };
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 旧データ（visit_date: string）からの移行
        if (parsed.visit_date && !parsed.visit_dates) {
          parsed.visit_dates = [{ date: parsed.visit_date, start_time: parsed.start_time || '' }];
          delete parsed.visit_date;
          delete parsed.start_time;
        }
        // 旧PartyInfoからの移行
        if (parsed.party && ('elementary_upper' in parsed.party || 'elementary_lower' in parsed.party)) {
          const p = parsed.party;
          parsed.party = {
            adults: p.adults || 0,
            highschool: p.highschool || 0,
            middleschool: p.middleschool || 0,
            elementary: (p.elementary_upper || 0) + (p.elementary_lower || 0),
            young_children: (p.preschool || 0) + (p.toddler || 0),
          };
          // child_heights をリセット（旧形式はテキストだったため）
          if (typeof parsed.child_heights === 'string') {
            parsed.child_heights = [];
          }
        }
        return { ...INITIAL_SURVEY, ...parsed };
      } catch { /* ignore */ }
    }
    return { ...INITIAL_SURVEY };
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 編集モード: 既存回答を取得
  useEffect(() => {
    if (!editSurveyId || !token) return;
    getSurvey(token, Number(editSurveyId))
      .then((res) => {
        setFormData({ ...INITIAL_SURVEY, ...res.answers } as SurveyFormData);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : '回答の取得に失敗しました');
      })
      .finally(() => setLoading(false));
  }, [editSurveyId, token]);

  // 自動反映データ
  const [closures, setClosures] = useState<ClosureEntry[]>([]);
  const [shows, setShows] = useState<ShowData[]>([]);
  const [showsLoaded, setShowsLoaded] = useState(false);
  const fetchedDateRef = useRef('');

  // localStorage下書き保存
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  // 初日の日付を取得（データfetchに使用）
  const primaryDate = formData.visit_dates.length > 0 ? formData.visit_dates[0].date : '';

  // 来園日が変わったらデータをfetch
  useEffect(() => {
    if (!primaryDate || primaryDate === fetchedDateRef.current) return;
    fetchedDateRef.current = primaryDate;

    fetchClosures().then((data) => {
      setClosures(getClosuresForDate(data, primaryDate));
    });

    setShowsLoaded(false);
    fetchShows(primaryDate).then((result) => {
      setShows(result.shows);
      setShowsLoaded(true);
    }).catch(() => { setShows([]); setShowsLoaded(true); });
  }, [primaryDate]);


  const handleChange = useCallback((patch: Partial<SurveyFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  }, []);

  const canProceed = (): boolean => {
    if (step === 0) {
      return !!formData.name && !!formData.service_type && formData.visit_dates.length > 0 && !!formData.visit_dates[0].date;
    }
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      setTimeout(() => window.scrollTo({ top: 0 }), 0);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
      setTimeout(() => window.scrollTo({ top: 0 }), 0);
    }
  };

  const handleSubmit = async () => {
    if (!token) return;
    setSubmitting(true);
    setError('');

    try {
      // 各来園日の営業時間を付与
      const enriched = { ...formData } as Record<string, unknown>;
      const parkHoursData = await fetchParkHours();
      const parkHoursMap: Record<string, string> = {};
      for (const vd of formData.visit_dates) {
        if (vd.date && parkHoursData[vd.date]) {
          parkHoursMap[vd.date] = parkHoursData[vd.date];
        }
      }
      enriched.park_hours = parkHoursMap;

      // 選択したショー・季節イベントに、shows APIから取得した時間を紐づけ
      // 個別ショー単位で当日データを探し、見つからない場合のみ同曜日の直近公開日をフォールバック参照し「(未定)」フラグを付与
      const showTimes: Record<string, string> = {};
      const showTimesFallback: Record<string, boolean> = {};
      const selectedShows = [...formData.shows, ...formData.seasonal_events];
      if (selectedShows.length > 0 && primaryDate) {
        const primary = await fetchShows(primaryDate);
        const targetDay = new Date(primaryDate).getDay();
        const fallbackDate = primary.availableDates
          .filter((d) => new Date(d).getDay() === targetDay && d < primaryDate)
          .sort()
          .pop();

        let fallbackShows: ShowData[] | null = null;
        const loadFallback = async (): Promise<ShowData[]> => {
          if (fallbackShows !== null) return fallbackShows;
          if (!fallbackDate) { fallbackShows = []; return fallbackShows; }
          try {
            const fb = await fetchShows(fallbackDate);
            fallbackShows = fb.shows;
          } catch {
            fallbackShows = [];
          }
          return fallbackShows;
        };

        const findMatch = (list: ShowData[], name: string): ShowData | undefined =>
          list.find((s) => s.name.includes(name) || name.includes(s.name));

        for (const name of selectedShows) {
          let match = findMatch(primary.shows, name);
          let isFallback = false;
          if (!match) {
            const fb = await loadFallback();
            match = findMatch(fb, name);
            if (match) isFallback = true;
          }
          if (!match) continue;
          const parts: string[] = match.times ? [...match.times] : [];
          if (match.endTime) parts.push(`〜${match.endTime}`);
          if (parts.length > 0) {
            showTimes[name] = parts.join('・');
            if (isFallback) showTimesFallback[name] = true;
          }
        }
      }
      enriched.show_times = showTimes;
      enriched.show_times_fallback = showTimesFallback;

      let surveyId: number;
      if (editSurveyId) {
        const res = await updateSurvey(token, Number(editSurveyId), enriched);
        surveyId = res.survey_id;
      } else {
        const res = await submitSurvey(token, enriched);
        surveyId = res.survey_id;
      }
      localStorage.removeItem(DRAFT_KEY);
      navigate('/survey/complete', { state: { surveyId } });
    } catch (e) {
      setError(e instanceof Error ? e.message : '送信に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepBasicInfo data={formData} onChange={handleChange} />;
      case 1:
        return <StepPartyInfo data={formData} onChange={handleChange} />;
      case 2:
        return <StepLogistics data={formData} onChange={handleChange} />;
      case 3:
        return <StepSchedule data={formData} onChange={handleChange} />;
      case 4:
        return <StepAttractions data={formData} onChange={handleChange} closures={closures} />;
      case 5:
        return (
          <StepEntertainment
            data={formData}
            onChange={handleChange}
            shows={shows}
            showsLoaded={showsLoaded}
            visitDate={primaryDate}
          />
        );
      case 6:
        return <StepDining data={formData} onChange={handleChange} visitDate={primaryDate} />;
      case 7:
        return <StepExtras data={formData} onChange={handleChange} />;
      default:
        return null;
    }
  };

  const isLastStep = step === STEPS.length - 1;

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p style={{ textAlign: 'center', padding: '2rem' }}>回答を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{editSurveyId ? '回答の修正' : 'プランニング依頼者専用'}</h1>

        <ProgressBar currentStep={step} />

        {primaryDate && step === 0 && (
          <div className={styles.draftNotice}>
            入力内容は自動で下書き保存されます
          </div>
        )}

        <div className={styles.stepContent} key={step}>
          {renderStep()}
        </div>

        <div className={styles.navButtons}>
          {step > 0 && (
            <button type="button" className={styles.prevButton} onClick={handlePrev}>
              戻る
            </button>
          )}
          {isLastStep ? (
            <button
              type="button"
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? '送信中...' : editSurveyId ? '修正を送信する' : '回答を送信する'}
            </button>
          ) : (
            <button
              type="button"
              className={styles.nextButton}
              onClick={handleNext}
              disabled={!canProceed()}
            >
              次へ
            </button>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}
