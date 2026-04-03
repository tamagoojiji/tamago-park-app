import styles from './FormComponents.module.css';

// --- TextInput ---
interface TextInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export function TextInput({ value, onChange, placeholder, multiline }: TextInputProps) {
  if (multiline) {
    return (
      <textarea
        className={`${styles.textInput} ${styles.textarea}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    );
  }
  return (
    <input
      type="text"
      className={styles.textInput}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

// --- DateInput ---
interface DateInputProps {
  value: string;
  onChange: (v: string) => void;
}

export function DateInput({ value, onChange }: DateInputProps) {
  return (
    <input
      type="date"
      className={styles.textInput}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// --- SingleSelect ---
interface SingleSelectProps {
  name: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}

export function SingleSelect({ name, options, value, onChange }: SingleSelectProps) {
  return (
    <div className={styles.radioGroup}>
      {options.map((opt) => (
        <div key={opt} className={styles.radioOption}>
          <input
            type="radio"
            id={`${name}-${opt}`}
            name={name}
            className={styles.radioInput}
            checked={value === opt}
            onChange={() => onChange(opt)}
          />
          <label htmlFor={`${name}-${opt}`} className={styles.radioLabel}>
            <span className={styles.radioDot} />
            {opt}
          </label>
        </div>
      ))}
    </div>
  );
}

// --- MultiSelect ---
export interface MultiSelectOption {
  value: string;
  label?: string;
  disabled?: boolean;
  badge?: string;
  badgeType?: 'closed' | 'height' | 'active';
}

interface MultiSelectProps {
  name: string;
  options: MultiSelectOption[];
  values: string[];
  onChange: (v: string[]) => void;
}

export function MultiSelect({ name, options, values, onChange }: MultiSelectProps) {
  const toggle = (val: string) => {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  return (
    <div className={styles.checkGroup}>
      {options.map((opt) => {
        const label = opt.label || opt.value;
        return (
          <div key={opt.value} className={styles.checkOption}>
            <input
              type="checkbox"
              id={`${name}-${opt.value}`}
              className={styles.checkInput}
              checked={values.includes(opt.value)}
              onChange={() => !opt.disabled && toggle(opt.value)}
              disabled={opt.disabled}
            />
            <label
              htmlFor={`${name}-${opt.value}`}
              className={`${styles.checkLabel} ${opt.disabled ? styles.checkLabelDisabled : ''}`}
            >
              <span className={styles.checkBox}>✓</span>
              {label}
              {opt.badge && (
                <span
                  className={`${styles.badge} ${
                    opt.badgeType === 'closed'
                      ? styles.badgeClosed
                      : opt.badgeType === 'height'
                        ? styles.badgeHeight
                        : styles.badgeActive
                  }`}
                >
                  {opt.badge}
                </span>
              )}
            </label>
          </div>
        );
      })}
    </div>
  );
}

// --- NumberGrid ---
interface NumberGridProps {
  categories: { key: string; label: string }[];
  values: Record<string, number>;
  onChange: (key: string, value: number) => void;
  max?: number;
}

export function NumberGrid({ categories, values, onChange, max = 10 }: NumberGridProps) {
  return (
    <div className={styles.numberGrid}>
      {categories.map(({ key, label }) => {
        const val = values[key] || 0;
        return (
          <div key={key} className={styles.numberRow}>
            <span className={styles.numberLabel}>{label}</span>
            <div className={styles.numberControls}>
              <button
                type="button"
                className={styles.numberButton}
                onClick={() => onChange(key, Math.max(0, val - 1))}
                disabled={val <= 0}
              >
                -
              </button>
              <span className={styles.numberValue}>{val}</span>
              <button
                type="button"
                className={styles.numberButton}
                onClick={() => onChange(key, Math.min(max, val + 1))}
                disabled={val >= max}
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
