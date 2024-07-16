import { ConfigService } from '@nestjs/config';
import { checkRespose } from './fetchChecker';

export async function sendMessageToAdmin(
  message: string,
  configService: ConfigService,
): Promise<Response> {
  const isDev = configService.get<boolean>('isDev');
  const domain = `${isDev ? 'localhost:3002' : 'tgbotservice:3000'}`;
  const link = `http://${domain}/sendMessageToAdmin`;
  return await fetch(link, {
    method: 'POST',
    body: JSON.stringify({ message }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(checkRespose);
}
