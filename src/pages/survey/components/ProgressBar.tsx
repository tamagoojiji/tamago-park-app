import { STEPS } from '../../../types/survey';
import styles from './ProgressBar.module.css';

interface Props {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.steps}>
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`${styles.stepDot} ${
              i === currentStep ? styles.stepDotActive : i < currentStep ? styles.stepDotDone : ''
            }`}
          />
        ))}
      </div>
      <div className={styles.label}>
        <span className={styles.stepName}>
          {STEPS[currentStep].icon} {STEPS[currentStep].label}
        </span>
        <span className={styles.stepCount}>
          {currentStep + 1} / {STEPS.length}
        </span>
      </div>
    </div>
  );
}
