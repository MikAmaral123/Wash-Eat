// Format a French phone number as the user types: "06 12 34 56 78".
// Keeps an optional leading "+" (e.g. +33 6 12 34 56 78) and groups digits in pairs.
export function formatPhone(input: string): string {
  const hasPlus = input.trimStart().startsWith('+');
  let digits = input.replace(/\D/g, '');
  // E.164 safety cap
  digits = digits.slice(0, hasPlus ? 13 : 10);
  const grouped = digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  return (hasPlus ? '+' : '') + grouped;
}
