// Wash&eat loyalty program: points, grades, rewards catalog.

export const WELCOME_BONUS = 50;
export const BIRTHDAY_BONUS = 100;

export type Grade = {
  key: string;
  name: string;
  min: number;
  emoji: string;
  perk: string;   // avantage passif (réservation)
  unlock: string; // récompense de déblocage
};

export const GRADES: Grade[] = [
  { key: 'snacker', name: 'Snacker', min: 0, emoji: '🍪', perk: 'Réservation 5 min avant le lancement', unlock: '-10% sur la 1ère boisson ou snack' },
  { key: 'gourmet', name: 'Gourmet', min: 500, emoji: '🥐', perk: 'Réservation 10 min avant le lancement', unlock: '1 séchage offert (15 min)' },
  { key: 'chef', name: 'Chef', min: 1500, emoji: '👨‍🍳', perk: 'Réservation 15 min avant + -5% permanent boutique', unlock: '1 lavage standard offert' },
  { key: 'vip', name: 'Foodie VIP', min: 3000, emoji: '⭐', perk: 'Réservation 15 min + 1 café/thé offert à chaque visite', unlock: '1 doypack lessive éco + 1 formule snack' },
];

export function gradeFor(points: number): Grade {
  let g = GRADES[0];
  for (const grade of GRADES) if (points >= grade.min) g = grade;
  return g;
}

export function nextGrade(points: number): Grade | null {
  return GRADES.find((g) => g.min > points) ?? null;
}

// Progress [0..1] within the current grade towards the next.
export function gradeProgress(points: number): number {
  const cur = gradeFor(points);
  const nxt = nextGrade(points);
  if (!nxt) return 1;
  return Math.min(1, Math.max(0, (points - cur.min) / (nxt.min - cur.min)));
}

export type Reward = { key: string; cost: number; name: string; emoji: string };

export const REWARDS: Reward[] = [
  { key: 'drink', cost: 150, name: 'Café, thé ou boisson fraîche', emoji: '☕' },
  { key: 'snack', cost: 250, name: 'Snack sucré ou salé', emoji: '🍪' },
  { key: 'detergent', cost: 300, name: 'Doypack lessive & adoucissant éco', emoji: '🧴' },
  { key: 'dry', cost: 450, name: 'Cycle de séchage (15 min)', emoji: '🌀' },
  { key: 'wash', cost: 800, name: 'Cycle de lavage standard (8-10 kg)', emoji: '🧺' },
];

export function rewardByKey(key: string): Reward | undefined {
  return REWARDS.find((r) => r.key === key);
}

// Ways to earn (display only until a transaction backend exists).
export const EARN_RULES: { icon: string; label: string; value: string }[] = [
  { icon: '🪙', label: '1 € dépensé', value: '10 points' },
  { icon: '🎉', label: 'Création de compte', value: '+50 pts' },
  { icon: '🎂', label: 'Anniversaire', value: '+100 pts' },
  { icon: '🌙', label: 'Lancement en heures creuses', value: '+20 pts' },
  { icon: '🔥', label: 'Combo parfait (machine + snack)', value: '+30 pts' },
  { icon: '🤝', label: 'Parrainage validé', value: '+200 pts' },
];
