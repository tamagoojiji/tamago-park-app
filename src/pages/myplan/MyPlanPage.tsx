import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { myplanApi } from '../../api/myplan';
import type { MyPlan, MyPlanAttraction, MyPlanShow } from '../../types/myplan';
import { DRAFT_KEY } from '../../types/myplan';
import { heightRestrictions } from '../../data/height-restrictions';
import PlanProgressBar from './components/PlanProgressBar';
import StepDateSelect from './components/StepDateSelect';
import StepAttractionSelect from './components/StepAttractionSelect';
import StepShowSelect from './components/StepShowSelect';
import StepShowTimeSelect from './components/StepShowTimeSelect';
import StepScheduleEditor from './components/StepScheduleEditor';
import StepConfirm from './components/StepConfirm';
import styles from './MyPlanPage.module.css';

function loadDraft(editId?: number) {
  if (editId) return null;
  const saved = localStorage.getItem(DRAFT_KEY);
  if (!saved) return null;
  try {
    const draft = JSON.parse(saved);
    if (draft.date) return draft;
  } catch { /* ignore */ }
  return null;
}

export default function MyPlanPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit') ? Number(searchParams.get('edit')) : undefined;

  const draft = loadDraft(editId);
  const [step, setStep] = useState(0);
  const [date, setDate] = useState(draft?.date || '');
  const [openTime, setOpenTime] = useState(draft?.openTime || '09:00');
  const [closeTime, setCloseTime] = useState(draft?.closeTime || '21:00');
  const [selectedAttractions, setSelectedAttractions] = useState<string[]>(draft?.selectedAttractions || []);
  const [attractions, setAttractions] = useState<MyPlanAttraction[]>(draft?.attractions || []);
  const [selectedShows, setSelectedShows] = useState<string[]>(draft?.selectedShows || []);
  const [showSchedule, setShowSchedule] = useState<MyPlanShow[]>(draft?.showSchedule || []);
  const [memo, setMemo] = useState(draft?.memo || '');
  const [savedId, setSavedId] = useState<number | undefined>(editId);

  // 編集モード: 既存プランを読み込み
  useEffect(() => {
    if (!editId || !token) return;
    myplanApi.get(token, editId).then((plan) => {
      setDate(plan.date);
      setOpenTime(plan.openTime);
      setCloseTime(plan.closeTime);
      setAttractions(plan.attractions);
      setSelectedAttractions(plan.attractions.map((a) => a.name));
      setShowSchedule(plan.shows);
      setSelectedShows(plan.shows.map((s) => s.name));
      setMemo(plan.memo || '');
    }).catch(() => {});
  }, [editId, token]);

  // 下書き保存（localStorage）
  useEffect(() => {
    if (!date) return;
    const draftData = { date, openTime, closeTime, selectedAttractions, attractions, selectedShows, showSchedule, memo };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
  }, [date, openTime, closeTime, selectedAttractions, attractions, selectedShows, showSchedule, memo]);

  const handleDateChange = useCallback((d: string, open: string, close: string) => {
    setDate(d);
    setOpenTime(open);
    setCloseTime(close);
  }, []);

  // アトラクション選択が変わったらattractions配列を同期
  const handleAttractionSelectionChange = useCallback((names: string[]) => {
    setSelectedAttractions(names);
    setAttractions((prev) => {
      const existing = new Map(prev.map((a) => [a.name, a]));
      return names.map((name) => {
        if (existing.has(name)) return existing.get(name)!;
        const data = heightRestrictions.find((h) => h.name === name);
        return {
          name,
          area: data?.area || '',
          image: data?.image || '',
          startTime: '',
          durationMinutes: 60,
        };
      });
    });
  }, []);

  const handleSaved = (id: number) => {
    setSavedId(id);
    localStorage.removeItem(DRAFT_KEY);
  };

  const buildPlan = (): MyPlan => ({
    date,
    attractions,
    shows: showSchedule,
    openTime,
    closeTime,
    memo: memo || undefined,
  });

  const canProceed = (): boolean => {
    if (step === 0) return !!date;
    return true;
  };

  const handleNext = () => {
    if (step < 5) {
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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>マイプラン作成</h1>

        <PlanProgressBar currentStep={step} />

        {step === 0 && date && (
          <div className={styles.draftNotice}>
            下書きは自動保存されます。ブラウザのデータ消去や長期間未アクセスで下書きが消える場合があります。
          </div>
        )}

        <div className={styles.stepContent} key={step}>
          {step === 0 && (
            <StepDateSelect date={date} onChange={handleDateChange} />
          )}
          {step === 1 && (
            <StepAttractionSelect
              date={date}
              selected={selectedAttractions}
              onChange={handleAttractionSelectionChange}
            />
          )}
          {step === 2 && (
            <StepShowSelect
              date={date}
              selected={selectedShows}
              onChange={setSelectedShows}
            />
          )}
          {step === 3 && (
            <StepShowTimeSelect
              date={date}
              selectedShowNames={selectedShows}
              showSchedule={showSchedule}
              onChange={setShowSchedule}
            />
          )}
          {step === 4 && (
            <>
              <StepScheduleEditor
                openTime={openTime}
                closeTime={closeTime}
                attractions={attractions}
                shows={showSchedule}
                onChangeAttractions={setAttractions}
                onChangeShows={setShowSchedule}
              />
              <div className={styles.memoSection}>
                <label className={styles.memoLabel}>メモ（任意）</label>
                <textarea
                  className={styles.memoInput}
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="持ち物、待ち合わせ場所など..."
                  rows={3}
                />
              </div>
            </>
          )}
          {step === 5 && (
            <StepConfirm
              plan={buildPlan()}
              editingId={savedId}
              onSaved={handleSaved}
              onGoBack={() => setStep(4)}
            />
          )}
        </div>

        {step < 5 && (
          <div className={styles.navButtons}>
            {step > 0 && (
              <button type="button" className={styles.prevButton} onClick={handlePrev}>
                戻る
              </button>
            )}
            <button
              type="button"
              className={styles.nextButton}
              onClick={handleNext}
              disabled={!canProceed()}
            >
              次へ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
