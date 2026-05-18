export type FirestoreTimestampInput =
  | Date
  | { seconds: number; nanoseconds: number; toDate?: () => Date }
  | string
  | number;
/* Aca convertimos cualquier fecha de firebase a Dato normal de JS */
export function normalizeTimestamp(value: FirestoreTimestampInput | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;

  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === 'object') {
    if ('toDate' in value && typeof value.toDate === 'function') {
      return value.toDate();
    }
    if ('seconds' in value && typeof value.seconds === 'number') {
      return new Date(value.seconds * 1000);
    }
  }

  return null;
}
