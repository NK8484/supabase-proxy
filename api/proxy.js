export default async function handler(req, res) {
  const SUPABASE_URL = "https://vvysbwracbpydlthjbec.supabase.co";
  
  // URL path ကို Supabase ဆီသို့ တိုက်ရိုက်ချိတ်ဆက်ရန်
  const url = new URL(req.url, `https://${req.headers.host}`);
  const targetUrl = new URL(url.pathname + url.search, SUPABASE_URL);

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(SUPABASE_URL).host,
      },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body)
    });

    const data = await response.text();

    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
