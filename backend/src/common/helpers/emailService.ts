function checkRespose(res: Response): Promise<boolean> {
  return res.ok ? Promise.resolve(true) : Promise.reject(false);
}

export async function sendEmailCode({
  email,
  code,
}: {
  email: string;
  code: number;
}): Promise<boolean> {
  const link = 'http://emailservice:3001/auth-email';
  console.log(link);
  return await fetch(link, {
    method: 'POST',
    body: JSON.stringify({ email, code }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(checkRespose);
}
