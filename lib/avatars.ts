// Curated avatar presets - DiceBear "avataaars", tuned to the Wash&eat DA
// (warm brand backgrounds, rounded). 5 féminins + 5 masculins.

export type Avatar = { id: string; gender: 'f' | 'm'; url: string };

const BG = ['fbddce', 'e1efd9', 'fbe6c6', 'fbe3cc', 'dcecf6']; // brand softs

function build(
  id: string,
  gender: 'f' | 'm',
  seed: string,
  top: string,
  extra: string,
  bg: string,
): Avatar {
  const p = new URLSearchParams({
    seed,
    top,
    backgroundColor: bg,
    radius: '50',
  });
  const url = `https://api.dicebear.com/9.x/avataaars/svg?${p.toString()}&${extra}`;
  return { id, gender, url };
}

export const AVATARS: Avatar[] = [
  // Féminins - cheveux longs / attachés, sans barbe
  build('f1', 'f', 'Louna', 'straight02', 'facialHairProbability=0&hairColor=6c4545', BG[0]),
  build('f2', 'f', 'Ava', 'bob', 'facialHairProbability=0&hairColor=2c1b18', BG[1]),
  build('f3', 'f', 'Nina', 'curly', 'facialHairProbability=0&hairColor=a55728', BG[2]),
  build('f4', 'f', 'Mila', 'bun', 'facialHairProbability=0&hairColor=b58143', BG[3]),
  build('f5', 'f', 'Sofia', 'longButNotTooLong', 'facialHairProbability=0&hairColor=4a312c', BG[4]),
  // Masculins - cheveux courts, parfois barbe
  build('m1', 'm', 'Noah', 'shortFlat', 'facialHairProbability=0&hairColor=2c1b18', BG[1]),
  build('m2', 'm', 'Liam', 'shortWaved', 'facialHair=beardLight&facialHairProbability=100&facialHairColor=2c1b18&hairColor=724133', BG[2]),
  build('m3', 'm', 'Adam', 'theCaesar', 'facialHairProbability=0&hairColor=090806', BG[0]),
  build('m4', 'm', 'Elias', 'shortRound', 'facialHair=beardMedium&facialHairProbability=100&facialHairColor=724133&hairColor=724133', BG[3]),
  build('m5', 'm', 'Gabriel', 'frizzle', 'facialHairProbability=0&hairColor=b58143', BG[4]),
];

export function avatarUrl(id: string | null | undefined): string | null {
  if (!id) return null;
  return AVATARS.find((a) => a.id === id)?.url ?? null;
}
