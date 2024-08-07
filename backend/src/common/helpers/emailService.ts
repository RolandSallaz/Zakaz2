import { ConfigService } from '@nestjs/config';
import { checkRespose } from './fetchChecker';

export async function sendEmailCode(
  {
    email,
    code,
  }: {
    email: string;
    code: number;
  },
  configService: ConfigService,
): Promise<Response> {
  const isDev = configService.get<boolean>('isDev');
  const domain = `${isDev ? 'localhost:3001' : 'emailservice:3000'}`;
  const link = `http://${domain}/auth-email`;
  return await fetch(link, {
    method: 'POST',
    body: JSON.stringify({ email, code }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(checkRespose);
}
