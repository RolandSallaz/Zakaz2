import { ISteamData } from '@/types';

export async function steamGameFetch(
  steamId: number,
  lang: 'ru' | 'en',
): Promise<ISteamData> {
  return await fetch(
    `https://store.steampowered.com/api/appdetails?appids=${steamId}&cc=${lang}&l=russian`,
  )
    .then((res) => res.json())
    .then((res) => {
      if (res) {
        return res[steamId];
      }
    });
}
