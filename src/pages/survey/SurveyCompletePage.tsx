import { useNavigate, useLocation } from 'react-router-dom';
import styles from './SurveyCompletePage.module.css';

export default function SurveyCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const surveyId = (location.state as { surveyId?: number })?.surveyId;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>🎉</div>
        <h1 className={styles.title}>回答ありがとうございます！</h1>
        <p className={styles.message}>
          アンケートを受け付けました。<br />
          いただいた内容をもとにプランを作成します。<br />
          LINEでご連絡しますのでお待ちください。
        </p>
        <div className={styles.buttons}>
          {surveyId && (
            <button
              type="button"
              className={styles.editButton}
              onClick={() => navigate(`/survey/form?edit=${surveyId}`)}
            >
              回答を修正する
            </button>
          )}
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate('/')}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
