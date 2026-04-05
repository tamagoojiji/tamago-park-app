import { useState } from 'react';
import type { MyPlan } from '../../../types/myplan';
import { useAuth } from '../../../contexts/AuthContext';
import { myplanApi } from '../../../api/myplan';
import { exportToPng, exportToPdf } from '../utils/pdfExport';
import TimelineView from './TimelineView';
import styles from './components.module.css';

interface Props {
  plan: MyPlan;
  editingId?: number;
  onSaved: (id: number) => void;
  onGoBack: () => void;
}

export default function StepConfirm({ plan, editingId, onSaved, onGoBack }: Props) {
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        await myplanApi.update(token, editingId, plan);
        onSaved(editingId);
      } else {
        const res = await myplanApi.create(token, plan);
        onSaved(res.id);
      }
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPng = async () => {
    try {
      await exportToPng('myplan-timeline', `USJプラン_${plan.date}.png`);
    } catch {
      setError('画像の生成に失敗しました');
    }
  };

  const handleExportPdf = async () => {
    try {
      await exportToPdf('myplan-timeline', `USJプラン_${plan.date}.pdf`);
    } catch {
      setError('PDFの生成に失敗しました');
    }
  };

  return (
    <div className={styles.stepSection}>
      <h2 className={styles.stepTitle}>プラン確認</h2>

      <div className={styles.confirmPlanName}>{plan.name}</div>
      <div className={styles.confirmHeader}>
        <div className={styles.confirmDate}>📅 {plan.date}</div>
        <div className={styles.confirmHours}>🕐 {plan.openTime}〜{plan.closeTime}</div>
      </div>

      <div className={styles.confirmStats}>
        <span>🎢 アトラクション {plan.attractions.filter((a) => a.startTime).length}件</span>
        <span>🎭 ショー {plan.shows.length}件</span>
      </div>

      <TimelineView
        id="myplan-timeline"
        openTime={plan.openTime}
        closeTime={plan.closeTime}
        attractions={plan.attractions.filter((a) => a.startTime)}
        shows={plan.shows}
      />

      {plan.memo && (
        <div className={styles.confirmMemo}>
          <strong>メモ:</strong> {plan.memo}
        </div>
      )}

      {saved && (
        <div className={styles.savedNotice}>
          プランを保存しました！
          <p className={styles.savedWarning}>
            サーバーの障害やメンテナンスでデータが失われる場合があります。<br />
            大切なプランは画像やPDFでも保存することをおすすめします。
          </p>
        </div>
      )}

      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.confirmActions}>
        {!saved && (
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '保存中...' : editingId ? '更新する' : '保存する'}
          </button>
        )}
        <button className={styles.exportButton} onClick={handleExportPng}>
          📷 画像で保存
        </button>
        <button className={styles.exportButton} onClick={handleExportPdf}>
          📄 PDFで保存
        </button>
        <button className={styles.backEditButton} onClick={onGoBack}>
          ← 戻って編集
        </button>
      </div>
    </div>
  );
}
