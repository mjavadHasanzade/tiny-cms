export default function sloganssUnifier(slogans: any) {
  const result: IAny = {};
  for (let i = 0; i < slogans.length; i++) {
    result[String(slogans[i].name) as keyof IAny] = slogans[i];
  }

  return result;
}
