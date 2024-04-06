import axios from "axios";

export default async function handler(req: any, response: any) {
  const hash = req.query.hash;
  const url = `https://gateway.pinata.cloud/ipfs/${hash}`;
  console.log(url);
  try {
    const { data } = await axios.get(url);
    return response.status(200).send(data);
  } catch (e) {
    console.log(e);
    return response.status(500).send(e);
  }
}
