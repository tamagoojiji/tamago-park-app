import type { ReactNode } from 'react';
import styles from './QuestionCard.module.css';

interface Props {
  label: string;
  required?: boolean;
  note?: string;
  children: ReactNode;
}

export default function QuestionCard({ label, required, note, children }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>
        {label}
        {required && <span className={styles.required}>*必須</span>}
      </div>
      {children}
      {note && <div className={styles.note}>{note}</div>}
    </div>
  );
}
