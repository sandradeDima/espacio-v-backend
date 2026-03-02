export function getParamString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }
  return value ?? '';
}

export function getParamInt(value: string | string[] | undefined): number {
  return Number.parseInt(getParamString(value), 10);
}
