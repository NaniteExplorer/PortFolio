export const OWNER_OAUTH_STATE_COOKIE = "portfolio_owner_oauth_state";

export function appOrigin(req: Request) {
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}
