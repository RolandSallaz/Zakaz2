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
  return await fetch('http:/localhost:3001/auth-email', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(checkRespose);
}
