/**
 * Representa la entrada cruda de un timestamp desde Firestore o fuentes externas.
 */
export type FirestoreTimestampInput =
  | Date
  | { seconds: number; nanoseconds: number; toDate?: () => Date }
  | string
  | number;

/**
 * Normaliza cualquier entrada de timestamp a una instancia nativa de JavaScript Date.
 * Retorna null si la entrada es inválida para evitar fallbacks silenciosos que oculten bugs.
 */
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
