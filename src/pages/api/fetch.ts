import axios from "axios";

export default async function handler(req: any, response: any) {
  const { url } = req.query;
  try {
    const uri = await fetch(url);
    const metadata = (await uri.json()) as {
      name: string;
      description: string;
      image: string;
    };
    return response.status(200).send(metadata.image);
  } catch (e) {
    console.log(e);
    return response.status(500).send(e);
  }
}
