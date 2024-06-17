import { ConfigService } from '@nestjs/config';

function checkRespose(res: Response): Promise<Response> {
  return res.ok ? Promise.resolve(res) : Promise.reject(res);
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
  const link = `http://${configService.get<boolean>('isDev') ? 'localhost' : 'emailservice'}:3001/auth-email`;
  return await fetch(link, {
    method: 'POST',
    body: JSON.stringify({ email, code }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(checkRespose);
}
