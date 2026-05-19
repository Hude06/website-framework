import { Container, Button } from '../../lib/ui';
import type { FormBlock as FormBlockType } from '../../lib/types';
import block from './Block.module.css';
import styles from './FormBlock.module.css';

export function FormBlock({ block: b }: { block: FormBlockType }) {
  return (
    <div className={block.block}>
      <Container width="default">
        <form
          className={styles.form}
          action={b.action ?? '#'}
          method="post"
        >
          {b.heading && <h2 className={styles.heading}>{b.heading}</h2>}
          {b.fields.map((field) => (
            <label key={field.name} className={styles.field}>
              <span className={styles.label}>
                {field.label}
                {field.required && <span className={styles.required}>*</span>}
              </span>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  required={field.required}
                  placeholder={field.placeholder}
                  className={styles.textarea}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  placeholder={field.placeholder}
                  className={styles.input}
                />
              )}
            </label>
          ))}
          <div className={styles.submitRow}>
            <Button type="submit" variant="primary" size="lg">
              {b.submitLabel ?? 'Submit'}
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}
