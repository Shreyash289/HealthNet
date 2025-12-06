import fetch from 'node-fetch';

export default async function handler(req, res){
  const { number } = req.query;
  if(!number) return res.status(400).json({ error: 'missing number param' });

  try{
    const url = `https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${encodeURIComponent(number)}`;
    const r = await fetch(url, { timeout: 12000 });
    const json = await r.json();
    return res.status(200).json(json);
  } catch(err){
    return res.status(500).json({ error: 'fetch_failed', message: err.message || String(err) });
  }
}
