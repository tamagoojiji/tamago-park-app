import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuizPage.module.css';
import { fetchQuizzes, submitAnswer } from '../api/quiz';
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  DIFFICULTY_LABELS,
  DIFFICULTY_ORDER,
  type Quiz,
  type QuizDifficulty,
} from '../types/quiz';
import { useAuth } from '../contexts/AuthContext';

type Phase = 'mode-select' | 'in-progress' | 'result';
type ModeView = 'main' | 'category' | 'difficulty';

interface AnswerRecord {
  quiz: Quiz;
  selectedIndex: number;
  isCorrect: boolean;
}

const QUIZ_LIMIT = 10;

export default function QuizPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [phase, setPhase] = useState<Phase>('mode-select');
  const [modeView, setModeView] = useState<ModeView>('main');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const startQuiz = async (params: { category?: string; difficulty?: QuizDifficulty }) => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchQuizzes({
        category: params.category,
        difficulty: params.difficulty,
        limit: QUIZ_LIMIT,
        random: true,
      });
      if (list.length === 0) {
        setError('クイズが見つかりませんでした');
        setLoading(false);
        return;
      }
      setQuizzes(list);
      setCurrentIndex(0);
      setSelectedIndex(null);
      setAnswers([]);
      setPhase('in-progress');
    } catch (e) {
      setError(e instanceof Error ? e.message : '読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const currentQuiz = quizzes[currentIndex];

  const handleChoice = (idx: number) => {
    if (selectedIndex !== null || !currentQuiz) return;
    setSelectedIndex(idx);
    const isCorrect = idx === currentQuiz.answerIndex;
    setAnswers((prev) => [...prev, { quiz: currentQuiz, selectedIndex: idx, isCorrect }]);

    // 結果送信（失敗しても画面は止めない）
    if (token) {
      submitAnswer(currentQuiz.id, idx, token).catch(() => {
        // サーバー記録失敗は無視
      });
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= quizzes.length) {
      setPhase('result');
      return;
    }
    setCurrentIndex(currentIndex + 1);
    setSelectedIndex(null);
  };

  const handleRetry = () => {
    setPhase('mode-select');
    setModeView('main');
    setQuizzes([]);
    setAnswers([]);
    setCurrentIndex(0);
    setSelectedIndex(null);
  };

  // ======== render ========

  if (loading) {
    return (
      <main className={styles.container}>
        <p className={styles.loading}>読み込み中...</p>
      </main>
    );
  }

  if (phase === 'mode-select') {
    return (
      <main className={styles.container}>
        <h2 className={styles.title}>USJクイズ</h2>
        <p className={styles.subtitle}>10問チャレンジで何問正解できる？</p>

        {error && <p className={styles.errorBox}>{error}</p>}

        {modeView === 'main' && (
          <div className={styles.modeSection}>
            <button
              type="button"
              className={`${styles.modeCard} ${styles.modeCardAccent}`}
              onClick={() => startQuiz({})}
            >
              <span className={styles.modeCardIcon}>🎲</span>
              <div>
                <div className={styles.modeCardTitle}>ランダム10問チャレンジ</div>
                <div className={styles.modeCardSub}>全カテゴリから10問</div>
              </div>
            </button>

            <button
              type="button"
              className={styles.modeCard}
              onClick={() => setModeView('category')}
            >
              <span className={styles.modeCardIcon}>📚</span>
              <div>
                <div className={styles.modeCardTitle}>カテゴリ別</div>
                <div className={styles.modeCardSub}>10カテゴリから選ぶ</div>
              </div>
            </button>

            <button
              type="button"
              className={styles.modeCard}
              onClick={() => setModeView('difficulty')}
            >
              <span className={styles.modeCardIcon}>🎯</span>
              <div>
                <div className={styles.modeCardTitle}>難易度別</div>
                <div className={styles.modeCardSub}>初級・中級・上級</div>
              </div>
            </button>

            <button className={styles.backButton} onClick={() => navigate('/')}>
              ← ホームに戻る
            </button>
          </div>
        )}

        {modeView === 'category' && (
          <div className={styles.modeSection}>
            <h3 className={styles.modeSectionTitle}>カテゴリを選んでください</h3>
            <div className={styles.chipGrid}>
              {CATEGORY_ORDER.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={styles.chip}
                  onClick={() => startQuiz({ category: cat })}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
            <button className={styles.backButton} onClick={() => setModeView('main')}>
              ← 戻る
            </button>
          </div>
        )}

        {modeView === 'difficulty' && (
          <div className={styles.modeSection}>
            <h3 className={styles.modeSectionTitle}>難易度を選んでください</h3>
            <div className={styles.chipGrid}>
              {DIFFICULTY_ORDER.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`${styles.chip} ${styles.chipDifficulty}`}
                  onClick={() => startQuiz({ difficulty: d })}
                >
                  {DIFFICULTY_LABELS[d]}
                </button>
              ))}
            </div>
            <button className={styles.backButton} onClick={() => setModeView('main')}>
              ← 戻る
            </button>
          </div>
        )}
      </main>
    );
  }

  if (phase === 'in-progress' && currentQuiz) {
    const answered = selectedIndex !== null;
    const isCorrect = answered && selectedIndex === currentQuiz.answerIndex;
    const progressPct = ((currentIndex + (answered ? 1 : 0)) / quizzes.length) * 100;

    return (
      <main className={styles.container}>
        <div className={styles.progressRow}>
          <span>
            {currentIndex + 1} / {quizzes.length}
          </span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
          </div>
          <span>{answers.filter((a) => a.isCorrect).length}問正解</span>
        </div>

        <div className={styles.questionCard}>
          <div className={styles.metaRow}>
            <span className={`${styles.metaBadge} ${styles.metaBadgePrimary}`}>
              {currentQuiz.categoryLabel || CATEGORY_LABELS[currentQuiz.category] || currentQuiz.category}
            </span>
            <span className={`${styles.metaBadge} ${styles.metaBadgeAccent}`}>
              {DIFFICULTY_LABELS[currentQuiz.difficulty] || currentQuiz.difficulty}
            </span>
          </div>
          <p className={styles.question}>{currentQuiz.question}</p>
        </div>

        <div className={styles.choices}>
          {currentQuiz.choices.map((choice, idx) => {
            let cls = styles.choice;
            if (answered) {
              if (idx === currentQuiz.answerIndex) cls = `${styles.choice} ${styles.choiceCorrect}`;
              else if (idx === selectedIndex) cls = `${styles.choice} ${styles.choiceWrong}`;
            }
            return (
              <button
                key={idx}
                type="button"
                className={cls}
                onClick={() => handleChoice(idx)}
                disabled={answered}
              >
                <span className={styles.choiceLabel}>{['A', 'B', 'C', 'D'][idx]}</span>
                <span>{choice}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <>
            <div
              className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}
            >
              <div className={styles.feedbackTitle}>
                {isCorrect ? '正解！' : '不正解'}
              </div>
              {currentQuiz.explanation && (
                <div className={styles.feedbackBody}>{currentQuiz.explanation}</div>
              )}
            </div>
            <button type="button" className={styles.nextButton} onClick={handleNext}>
              {currentIndex + 1 >= quizzes.length ? '結果を見る' : '次の問題へ →'}
            </button>
          </>
        )}
      </main>
    );
  }

  if (phase === 'result') {
    const total = answers.length;
    const correct = answers.filter((a) => a.isCorrect).length;
    const rate = total > 0 ? Math.round((correct / total) * 100) : 0;

    // カテゴリ別集計
    const byCategory = new Map<string, { label: string; correct: number; total: number }>();
    for (const a of answers) {
      const key = a.quiz.category;
      const label = a.quiz.categoryLabel || CATEGORY_LABELS[key] || key;
      const cur = byCategory.get(key) || { label, correct: 0, total: 0 };
      cur.total += 1;
      if (a.isCorrect) cur.correct += 1;
      byCategory.set(key, cur);
    }

    // 難易度別集計
    const byDifficulty = new Map<string, { correct: number; total: number }>();
    for (const a of answers) {
      const cur = byDifficulty.get(a.quiz.difficulty) || { correct: 0, total: 0 };
      cur.total += 1;
      if (a.isCorrect) cur.correct += 1;
      byDifficulty.set(a.quiz.difficulty, cur);
    }

    return (
      <main className={styles.container}>
        <div className={styles.resultCard}>
          <div className={styles.resultLabel}>結果</div>
          <div className={styles.resultScore}>
            {correct}
            <span className={styles.resultScoreUnit}>/ {total}問正解</span>
          </div>
          <div className={styles.resultRate}>正答率 {rate}%</div>
        </div>

        {byCategory.size > 0 && (
          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>カテゴリ別</h3>
            {Array.from(byCategory.entries()).map(([key, v]) => (
              <div key={key} className={styles.breakdownRow}>
                <span>{v.label}</span>
                <span>
                  {v.correct}/{v.total}
                </span>
              </div>
            ))}
          </div>
        )}

        {byDifficulty.size > 0 && (
          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>難易度別</h3>
            {DIFFICULTY_ORDER.filter((d) => byDifficulty.has(d)).map((d) => {
              const v = byDifficulty.get(d)!;
              return (
                <div key={d} className={styles.breakdownRow}>
                  <span>{DIFFICULTY_LABELS[d]}</span>
                  <span>
                    {v.correct}/{v.total}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className={styles.actionRow}>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.actionSecondary}`}
            onClick={() => navigate('/')}
          >
            ホームへ
          </button>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.actionPrimary}`}
            onClick={handleRetry}
          >
            もう一度
          </button>
        </div>
      </main>
    );
  }

  return null;
}
