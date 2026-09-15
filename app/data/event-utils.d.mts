export function partitionEvents<T extends { date: string; endDate: string | null }>(events: T[], now: number): { upcoming: T[]; past: T[] }
