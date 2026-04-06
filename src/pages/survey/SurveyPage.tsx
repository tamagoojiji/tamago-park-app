import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { SurveyFormData } from '../../types/survey';
import { INITIAL_SURVEY, STEPS } from '../../types/survey';
import type { ClosureEntry } from '../../data/closures';
import { fetchClosures, getClosuresForDate } from '../../data/closures';
import type { ShowData } from '../../api/shows';
import { fetchShows } from '../../api/shows';
import type { RestaurantInfo } from '../../api/restaurants';
import { fetchRestaurants } from '../../api/restaurants';
import { submitSurvey } from '../../api/survey';

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

interface EventEntry {
  name: string;
  start: string;
  end: string;
}

const PW_KEY = 'tamago_survey_pw';
const SURVEY_PW = 'tamago1216';

export default function SurveyPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(PW_KEY) === 'ok');
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState('');
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<SurveyFormData>(() => {
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

  // 自動反映データ
  const [closures, setClosures] = useState<ClosureEntry[]>([]);
  const [shows, setShows] = useState<ShowData[]>([]);
  const [_restaurants, setRestaurants] = useState<RestaurantInfo[]>([]);
  const [events, setEvents] = useState<EventEntry[]>([]);
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

    fetchShows(primaryDate).then((result) => {
      setShows(result.shows);
    }).catch(() => setShows([]));

    fetchRestaurants(primaryDate).then((result) => {
      setRestaurants(result.restaurants);
    }).catch(() => setRestaurants([]));
  }, [primaryDate]);

  // イベントデータを読み込み
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/events.json`)
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]));
  }, []);

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!token) return;
    setSubmitting(true);
    setError('');

    try {
      await submitSurvey(token, formData as unknown as Record<string, unknown>);
      localStorage.removeItem(DRAFT_KEY);
      navigate('/survey/complete');
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
            events={events}
            visitDate={primaryDate}
          />
        );
      case 6:
        return <StepDining data={formData} onChange={handleChange} />;
      case 7:
        return <StepExtras data={formData} onChange={handleChange} />;
      default:
        return null;
    }
  };

  const isLastStep = step === STEPS.length - 1;

  if (!unlocked) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>プランニングアンケート</h1>
          <p style={{ textAlign: 'center', color: 'var(--color-text-sub)', fontSize: 'var(--text-sm)', marginBottom: 16 }}>
            パスワードを入力してください
          </p>
          <input
            type="password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            placeholder="パスワード"
            style={{
              width: '100%', padding: 14, border: '2px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-md)',
              boxSizing: 'border-box', marginBottom: 12,
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (pwInput === SURVEY_PW) {
                  sessionStorage.setItem(PW_KEY, 'ok');
                  setUnlocked(true);
                } else {
                  setPwError('パスワードが違います');
                }
              }
            }}
          />
          {pwError && <div className={styles.error}>{pwError}</div>}
          <button
            className={styles.nextButton}
            style={{ width: '100%', marginTop: 8 }}
            onClick={() => {
              if (pwInput === SURVEY_PW) {
                sessionStorage.setItem(PW_KEY, 'ok');
                setUnlocked(true);
              } else {
                setPwError('パスワードが違います');
              }
            }}
          >
            開く
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>プランニングアンケート</h1>

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
              {submitting ? '送信中...' : '回答を送信する'}
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
