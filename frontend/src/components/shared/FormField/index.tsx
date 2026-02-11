import type { ReactNode } from "react";
import styles from "./FormField.module.css";

type FormFieldProps = {
  label: string;
  counter?: string;
  error?: string;
  children: ReactNode;
};

export default function FormField({
  label,
  counter,
  error,
  children,
}: FormFieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
      <div className={styles.errorContainer}>
        {counter && <span className={styles.counter}>{counter}</span>}
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </label>
  );
}
