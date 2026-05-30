import { useEffect, useState } from 'react';
import adminStyles from './Admin.module.css';
import styles from './QuizAdminPage.module.css';
import {
  fetchAdminQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  importQuizzes,
  type QuizCreatePayload,
} from '../../api/quiz';
import type { QuizAdmin } from '../../types/quiz';
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  DIFFICULTY_LABELS,
  DIFFICULTY_ORDER,
} from '../../types/quiz';

interface QuizForm {
  code: string;
  category: string;
  categoryLabel: string;
  difficulty: string;
  question: string;
  choice0: string;
  choice1: string;
  choice2: string;
  choice3: string;
  answerIndex: number;
  explanation: string;
  needsReview: boolean;
  status: string;
}

const emptyForm: QuizForm = {
  code: '',
  category: CATEGORY_ORDER[0],
  categoryLabel: CATEGORY_LABELS[CATEGORY_ORDER[0]],
  difficulty: 'beginner',
  question: '',
  choice0: '',
  choice1: '',
  choice2: '',
  choice3: '',
  answerIndex: 0,
  explanation: '',
  needsReview: false,
  status: 'active',
};

function quizToForm(q: QuizAdmin): QuizForm {
  const choices = q.choices ?? [];
  return {
    code: q.code,
    category: q.category,
    categoryLabel: q.categoryLabel || CATEGORY_LABELS[q.category] || '',
    difficulty: q.difficulty,
    question: q.question,
    choice0: choices[0] || '',
    choice1: choices[1] || '',
    choice2: choices[2] || '',
    choice3: choices[3] || '',
    answerIndex: q.answerIndex,
    explanation: q.explanation || '',
    needsReview: !!q.needsReview,
    status: q.status || 'active',
  };
}

function formToPayload(f: QuizForm): QuizCreatePayload {
  return {
    code: f.code,
    category: f.category,
    categoryLabel: f.categoryLabel || CATEGORY_LABELS[f.category] || f.category,
    difficulty: f.difficulty,
    question: f.question,
    choices: [f.choice0, f.choice1, f.choice2, f.choice3],
    answerIndex: f.answerIndex,
    explanation: f.explanation || null,
    needsReview: f.needsReview,
    status: f.status,
  };
}

export default function QuizAdminPage() {
  const [quizzes, setQuizzes] = useState<QuizAdmin[]>([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<QuizForm>(emptyForm);

  const [importText, setImportText] = useState('');
  const [importReplace, setImportReplace] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await fetchAdminQuizzes({
        category: filterCategory || undefined,
        difficulty: filterDifficulty || undefined,
        status: filterStatus || undefined,
      });
      setQuizzes(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : '読み込み失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory, filterDifficulty, filterStatus]);

  const setField = <K extends keyof QuizForm>(key: K, val: QuizForm[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleCategoryChange = (cat: string) => {
    setForm((f) => ({
      ...f,
      category: cat,
      categoryLabel: CATEGORY_LABELS[cat] || f.categoryLabel,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const payload = formToPayload(form);
      if (editId !== null) {
        await updateQuiz(editId, payload);
        setMessage('更新しました');
      } else {
        const res = await createQuiz(payload);
        setMessage(`追加しました (id=${res.id})`);
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失敗');
    }
  };

  const startEdit = (q: QuizAdmin) => {
    setForm(quizToForm(q));
    setEditId(q.id);
    setShowForm(true);
    setMessage('');
    setError('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('このクイズを削除しますか？')) return;
    try {
      await deleteQuiz(id);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : '削除失敗');
    }
  };

  const handleImport = async () => {
    setError('');
    setMessage('');
    let data: QuizCreatePayload[];
    try {
      const parsed = JSON.parse(importText);
      data = Array.isArray(parsed) ? parsed : parsed.quizzes;
      if (!Array.isArray(data)) throw new Error('配列または{quizzes:[...]}形式で入力してください');
    } catch (e) {
      setError(`JSONパース失敗: ${e instanceof Error ? e.message : ''}`);
      return;
    }
    try {
      const res = await importQuizzes(data, importReplace);
      setMessage(`インポート完了: inserted=${res.inserted} / skipped=${res.skipped}`);
      setImportText('');
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'インポート失敗');
    }
  };

  const renderStatus = (s: string) => {
    if (s === 'active') return <span className={styles.statusActive}>active</span>;
    if (s === 'deprecated') return <span className={styles.statusDeprecated}>deprecated</span>;
    return <span className={styles.statusHidden}>{s}</span>;
  };

  return (
    <div>
      <div className={adminStyles.headerRow}>
        <h2 className={adminStyles.pageTitle}>クイズ管理 ({quizzes.length}件)</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={adminStyles.btn}
            onClick={() => {
              setShowImport((v) => !v);
              setShowForm(false);
            }}
          >
            {showImport ? '閉じる' : 'JSON一括インポート'}
          </button>
          <button
            className={adminStyles.btn}
            onClick={() => {
              setForm(emptyForm);
              setEditId(null);
              setShowForm((v) => !v);
              setShowImport(false);
            }}
          >
            {showForm ? '閉じる' : '新規追加'}
          </button>
        </div>
      </div>

      {error && <p className={adminStyles.error}>{error}</p>}
      {message && <p className={adminStyles.message}>{message}</p>}

      <div className={adminStyles.filterRow}>
        <select
          className={adminStyles.input}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">カテゴリ：すべて</option>
          {CATEGORY_ORDER.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
        <select
          className={adminStyles.input}
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
        >
          <option value="">難易度：すべて</option>
          {DIFFICULTY_ORDER.map((d) => (
            <option key={d} value={d}>
              {DIFFICULTY_LABELS[d]}
            </option>
          ))}
        </select>
        <select
          className={adminStyles.input}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">ステータス：すべて</option>
          <option value="active">active</option>
          <option value="hidden">hidden</option>
          <option value="deprecated">deprecated</option>
        </select>
      </div>

      {showImport && (
        <div className={styles.importSection}>
          <h3 className={styles.importTitle}>JSON一括インポート</h3>
          <p className={styles.importHint}>
            配列形式（[ {'{'} ... {'}'} , ... ]）または {'{'} "quizzes": [...] {'}'} 形式で貼り付けてください。
          </p>
          <textarea
            className={styles.importTextarea}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='[{"code":"A1","category":"attraction_basic","categoryLabel":"...","difficulty":"beginner","question":"...","choices":["..","..","..",".."],"answerIndex":0,"explanation":"..."}]'
          />
          <div className={styles.importControls}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={importReplace}
                onChange={(e) => setImportReplace(e.target.checked)}
              />
              既存を全削除して投入 (replace=true)
            </label>
            <button className={adminStyles.btn} onClick={handleImport} disabled={!importText.trim()}>
              Import
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <form className={adminStyles.eventForm} onSubmit={handleSubmit}>
          <div className={adminStyles.formGrid}>
            <label>
              code
              <input
                type="text"
                className={adminStyles.input}
                value={form.code}
                onChange={(e) => setField('code', e.target.value)}
                required
              />
            </label>
            <label>
              カテゴリ
              <select
                className={adminStyles.input}
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {CATEGORY_ORDER.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              カテゴリラベル
              <input
                type="text"
                className={adminStyles.input}
                value={form.categoryLabel}
                onChange={(e) => setField('categoryLabel', e.target.value)}
              />
            </label>
            <label>
              難易度
              <select
                className={adminStyles.input}
                value={form.difficulty}
                onChange={(e) => setField('difficulty', e.target.value)}
              >
                {DIFFICULTY_ORDER.map((d) => (
                  <option key={d} value={d}>
                    {DIFFICULTY_LABELS[d]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              ステータス
              <select
                className={adminStyles.input}
                value={form.status}
                onChange={(e) => setField('status', e.target.value)}
              >
                <option value="active">active</option>
                <option value="hidden">hidden</option>
                <option value="deprecated">deprecated</option>
              </select>
            </label>
            <label>
              正解 (0-3)
              <select
                className={adminStyles.input}
                value={form.answerIndex}
                onChange={(e) => setField('answerIndex', Number(e.target.value))}
              >
                <option value={0}>A (0)</option>
                <option value={1}>B (1)</option>
                <option value={2}>C (2)</option>
                <option value={3}>D (3)</option>
              </select>
            </label>
          </div>

          <label>
            問題文
            <textarea
              className={adminStyles.textarea}
              value={form.question}
              onChange={(e) => setField('question', e.target.value)}
              required
            />
          </label>

          <div className={styles.choicesGrid}>
            <label className={styles.choiceField}>
              選択肢 A
              <input
                type="text"
                className={adminStyles.input}
                value={form.choice0}
                onChange={(e) => setField('choice0', e.target.value)}
                required
              />
            </label>
            <label className={styles.choiceField}>
              選択肢 B
              <input
                type="text"
                className={adminStyles.input}
                value={form.choice1}
                onChange={(e) => setField('choice1', e.target.value)}
                required
              />
            </label>
            <label className={styles.choiceField}>
              選択肢 C
              <input
                type="text"
                className={adminStyles.input}
                value={form.choice2}
                onChange={(e) => setField('choice2', e.target.value)}
                required
              />
            </label>
            <label className={styles.choiceField}>
              選択肢 D
              <input
                type="text"
                className={adminStyles.input}
                value={form.choice3}
                onChange={(e) => setField('choice3', e.target.value)}
                required
              />
            </label>
          </div>

          <label>
            解説（任意）
            <textarea
              className={adminStyles.textarea}
              value={form.explanation}
              onChange={(e) => setField('explanation', e.target.value)}
            />
          </label>

          <label className={styles.checkboxLabel} style={{ marginTop: 8 }}>
            <input
              type="checkbox"
              checked={form.needsReview}
              onChange={(e) => setField('needsReview', e.target.checked)}
            />
            要確認フラグを立てる
          </label>

          <button type="submit" className={adminStyles.submitBtn}>
            {editId !== null ? '更新' : '追加'}
          </button>
        </form>
      )}

      {loading ? (
        <p className={adminStyles.empty}>読み込み中...</p>
      ) : quizzes.length === 0 ? (
        <p className={adminStyles.empty}>クイズがありません</p>
      ) : (
        <table className={adminStyles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>code</th>
              <th>カテゴリ</th>
              <th>難易度</th>
              <th>問題</th>
              <th>ステータス</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((q) => (
              <tr key={q.id}>
                <td>{q.id}</td>
                <td>{q.code}</td>
                <td>{q.categoryLabel || CATEGORY_LABELS[q.category] || q.category}</td>
                <td>{DIFFICULTY_LABELS[q.difficulty] || q.difficulty}</td>
                <td className={styles.questionCell} title={q.question}>
                  {q.question}
                  {q.needsReview && <span className={styles.reviewBadge}>要確認</span>}
                </td>
                <td>{renderStatus(q.status)}</td>
                <td>
                  <button className={adminStyles.linkBtn} onClick={() => startEdit(q)}>
                    編集
                  </button>
                  <button className={adminStyles.deleteBtn} onClick={() => handleDelete(q.id)}>
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
