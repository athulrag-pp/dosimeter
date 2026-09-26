export const BASELINE_LAB: [number, number, number] = [74.0, 13.0, 18.0];

export function calculate_delta_e_76(
  lab1: [number, number, number],
  lab2: [number, number, number] = BASELINE_LAB
): number {
  const dL = lab1[0] - lab2[0];
  const da = lab1[1] - lab2[1];
  const db = lab1[2] - lab2[2];
  return Math.sqrt(dL * dL + da * da + db * db);
}
