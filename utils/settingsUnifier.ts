export default function settingsUnifier(setting: any) {
  const result: ISettings = {};
  for (let i = 0; i < setting.length; i++) {
    result[String(setting[i].key) as keyof ISettings] = setting[i].value;
  }

  return result;
}
