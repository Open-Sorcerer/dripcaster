export default async function handler(req: any, response: any) {
  const url = 'https://graph.cast.k3l.io/scores/global/following/handles';
  try {
    const username = req.body;
    const body = [username.replaceAll('"', '')];
    const data = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const score = await data.json();
    return response.status(200).send({
      score: score.result[0].percentile,
      rank: score.result[0].rank,
    });
  } catch (e) {
    console.log(e);
    return response.status(500).send(e);
  }
}
