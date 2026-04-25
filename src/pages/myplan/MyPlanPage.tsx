import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { myplanApi } from '../../api/myplan';
import type { MyPlan, MyPlanAttraction, MyPlanShow } from '../../types/myplan';
import { DRAFT_KEY, defaultPlanName } from '../../types/myplan';
import { heightRestrictions } from '../../data/height-restrictions';
import PlanProgressBar from './components/PlanProgressBar';
import StepDateSelect from './components/StepDateSelect';
import StepAttractionSelect from './components/StepAttractionSelect';
import StepShowSelect from './components/StepShowSelect';
import StepShowTimeSelect from './components/StepShowTimeSelect';
import StepScheduleEditor from './components/StepScheduleEditor';
import StepConfirm from './components/StepConfirm';
import styles from './MyPlanPage.module.css';

interface DraftData {
  date: string;
  openTime: string;
  closeTime: string;
  selectedAttractions: string[];
  attractions: MyPlanAttraction[];
  selectedShows: string[];
  showSchedule: MyPlanShow[];
  planName: string;
  memo: string;
}

function loadDraft(editId?: number): DraftData | null {
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

  const [pendingDraft, setPendingDraft] = useState<DraftData | null>(() => loadDraft(editId));
  const [step, setStep] = useState(0);
  const [date, setDate] = useState('');
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('21:00');
  const [selectedAttractions, setSelectedAttractions] = useState<string[]>([]);
  const [attractions, setAttractions] = useState<MyPlanAttraction[]>([]);
  const [selectedShows, setSelectedShows] = useState<string[]>([]);
  const [showSchedule, setShowSchedule] = useState<MyPlanShow[]>([]);
  const [planName, setPlanName] = useState('');
  const [memo, setMemo] = useState('');
  const [savedId, setSavedId] = useState<number | undefined>(editId);

  const handleResumeDraft = () => {
    if (!pendingDraft) return;
    setDate(pendingDraft.date || '');
    setOpenTime(pendingDraft.openTime || '09:00');
    setCloseTime(pendingDraft.closeTime || '21:00');
    setSelectedAttractions(pendingDraft.selectedAttractions || []);
    setAttractions(pendingDraft.attractions || []);
    setSelectedShows(pendingDraft.selectedShows || []);
    setShowSchedule(pendingDraft.showSchedule || []);
    setPlanName(pendingDraft.planName || '');
    setMemo(pendingDraft.memo || '');
    setPendingDraft(null);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setPendingDraft(null);
  };

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
      setPlanName(plan.name || defaultPlanName(plan.date));
      setMemo(plan.memo || '');
    }).catch(() => {});
  }, [editId, token]);

  // 下書き保存（localStorage）
  useEffect(() => {
    if (!date || pendingDraft) return;
    const draftData = { date, openTime, closeTime, selectedAttractions, attractions, selectedShows, showSchedule, planName, memo };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
  }, [date, openTime, closeTime, selectedAttractions, attractions, selectedShows, showSchedule, planName, memo, pendingDraft]);

  const handleDateChange = useCallback((d: string, open: string, close: string) => {
    setDate(d);
    setOpenTime(open);
    setCloseTime(close);
    if (!planName || planName === defaultPlanName(date)) {
      setPlanName(defaultPlanName(d));
    }
  }, [planName, date]);

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
    name: planName || defaultPlanName(date),
    date,
    attractions,
    shows: showSchedule,
    openTime,
    closeTime,
    memo: memo || undefined,
  });

  const canProceed = (): boolean => {
    if (pendingDraft) return false;
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

        {pendingDraft && step === 0 && (
          <div className={styles.draftPrompt}>
            <p className={styles.draftPromptText}>
              前回作成途中のプラン（{pendingDraft.date}）が残っています。続きから再開しますか？
            </p>
            <div className={styles.draftPromptButtons}>
              <button
                type="button"
                className={styles.draftPromptDiscard}
                onClick={handleDiscardDraft}
              >
                新しく作る
              </button>
              <button
                type="button"
                className={styles.draftPromptResume}
                onClick={handleResumeDraft}
              >
                続きから再開
              </button>
            </div>
          </div>
        )}

        {!pendingDraft && step === 0 && date && (
          <div className={styles.draftNotice}>
            下書きは自動保存されます。ブラウザのデータ消去や長期間未アクセスで下書きが消える場合があります。
          </div>
        )}

        <div className={styles.stepContent} key={step}>
          {step === 0 && !pendingDraft && (
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
                <label className={styles.memoLabel}>プラン名</label>
                <input
                  type="text"
                  className={styles.memoInput}
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="例: 2026年4月5日パークプラン"
                />
              </div>
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
