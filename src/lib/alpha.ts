/** Case-insensitive label order for every subject (and other) picker. */
export function compareLabel(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

export function alphaByLabel<T extends { label: string }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => compareLabel(a.label, b.label));
}
