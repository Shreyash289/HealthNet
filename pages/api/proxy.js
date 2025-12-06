import fetch from 'node-fetch';

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { url } = req.body || {};
  if(!url) return res.status(400).json({ error: 'missing url' });
  if(!/^https?:\/\//i.test(url)) return res.status(400).json({ error: 'invalid_url' });

  try{
    const r = await fetch(url, { redirect: 'follow', timeout: 12000 });
    const status = r.status;
    const ok = r.ok;
    const text = await r.text();
    const snippet = text.slice(0, 4000);
    return res.status(200).json({ status, ok, snippet });
  } catch(err){
    return res.status(500).json({ error: 'fetch_failed', message: err.message || String(err) });
  }
}
