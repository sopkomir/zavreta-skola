// Vercel serverless funkcia: /api/auth
// Prvý krok OAuth prihlásenia - presmeruje na GitHub, aby si užívateľ
// (vy) potvrdil prístup pre Decap CMS na úpravu repozitára.

export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const redirectUri = `https://${req.headers.host}/api/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo,user',
  });

  res.writeHead(302, { Location: `https://github.com/login/oauth/authorize?${params}` });
  res.end();
}
