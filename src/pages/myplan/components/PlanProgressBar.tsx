import { MYPLAN_STEPS } from '../../../types/myplan';
import styles from './components.module.css';

interface Props {
  currentStep: number;
}

export default function PlanProgressBar({ currentStep }: Props) {
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressSteps}>
        {MYPLAN_STEPS.map((_, i) => (
          <div
            key={i}
            className={`${styles.progressDot} ${
              i === currentStep ? styles.progressDotActive : i < currentStep ? styles.progressDotDone : ''
            }`}
          />
        ))}
      </div>
      <div className={styles.progressLabel}>
        <span className={styles.progressStepName}>
          {MYPLAN_STEPS[currentStep].icon} {MYPLAN_STEPS[currentStep].label}
        </span>
        <span className={styles.progressStepCount}>
          {currentStep + 1} / {MYPLAN_STEPS.length}
        </span>
      </div>
    </div>
  );
}
