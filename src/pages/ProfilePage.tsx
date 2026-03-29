import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './ProfilePage.module.css';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 80 }, (_, i) => currentYear - i - 10);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export default function ProfilePage() {
  const { token, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string })?.from || '/';

  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [gender, setGender] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const days = useMemo(() => {
    if (!year || !month) return Array.from({ length: 31 }, (_, i) => i + 1);
    return Array.from(
      { length: getDaysInMonth(Number(year), Number(month)) },
      (_, i) => i + 1
    );
  }, [year, month]);

  const isValid = year && month && day && gender;

  const handleSubmit = async () => {
    if (!isValid || !token) return;
    setIsSubmitting(true);
    setError('');
    try {
      const birthday = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      await updateProfile(birthday, gender);
      navigate(redirectTo, { replace: true });
    } catch {
      setError('保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.confetti} />
      <div className={styles.card}>
        <div className={styles.icon}>🎯</div>
        <h1 className={styles.title}>プロフィール設定</h1>
        <p className={styles.subtitle}>
          あなたに合ったプラン提案のために<br />
          教えてください
        </p>

        <div className={styles.form}>
          {/* 生年月日 */}
          <div>
            <span className={styles.fieldLabel}>生年月日</span>
            <div className={styles.birthdaySelects}>
              <div className={styles.selectWrap}>
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">--</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <span className={styles.selectUnit}>年</span>
              <div className={styles.selectWrap}>
                <select value={month} onChange={(e) => { setMonth(e.target.value); setDay(''); }}>
                  <option value="">--</option>
                  {months.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <span className={styles.selectUnit}>月</span>
              <div className={styles.selectWrap}>
                <select value={day} onChange={(e) => setDay(e.target.value)}>
                  <option value="">--</option>
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <span className={styles.selectUnit}>日</span>
            </div>
          </div>

          {/* 性別 */}
          <div>
            <span className={styles.fieldLabel}>性別</span>
            <div className={styles.genderOptions}>
              <label className={styles.genderOption}>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className={styles.genderLabel}>👩 女性</span>
              </label>
              <label className={styles.genderOption}>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className={styles.genderLabel}>👨 男性</span>
              </label>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          {/* ボタン */}
          <div className={styles.buttons}>
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? '保存中...' : '設定する'}
            </button>
            <button
              className={styles.skipButton}
              onClick={handleSkip}
            >
              あとで設定する
            </button>
          </div>
        </div>

        <p className={styles.note}>
          ※ 入力は任意です。あとからいつでも変更できます。
        </p>
      </div>
    </div>
  );
}
