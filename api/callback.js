// Vercel serverless funkcia: /api/callback
// Druhý krok OAuth prihlásenia - GitHub sem presmeruje späť s dočasným
// kódom, ktorý vymeníme za skutočný prístupový token a pošleme ho
// Decap CMS oknu, ktoré prihlásenie spustilo.

export default async function handler(req, res) {
  const { code } = req.query;
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      res.status(400).send(`OAuth chyba: ${tokenData.error_description || tokenData.error}`);
      return;
    }

    const token = tokenData.access_token;
    const script = `
      <script>
        (function() {
          function receiveMessage(e) {
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({ token }).replace(/'/g, "\\'")}',
              e.origin
            );
            window.removeEventListener('message', receiveMessage, false);
          }
          window.addEventListener('message', receiveMessage, false);
          window.opener.postMessage('authorizing:github', '*');
        })();
      </script>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(script);
  } catch (err) {
    res.status(500).send('Chyba pri prihlasovaní: ' + err.message);
  }
}
