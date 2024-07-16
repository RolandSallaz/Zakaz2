export function checkRespose(res: Response): Promise<Response> {
  return res.ok
    ? Promise.resolve(res)
    : res.json().then((err) => Promise.reject(err));
}
