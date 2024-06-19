import { ConfigService } from '@nestjs/config';

function checkRespose(res: Response): Promise<Response> {
  return res.ok
    ? Promise.resolve(res)
    : res.json().then((err) => Promise.reject(err));
}

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
  console.log(link);
  return await fetch(link, {
    method: 'POST',
    body: JSON.stringify({ email, code }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(checkRespose);
}
