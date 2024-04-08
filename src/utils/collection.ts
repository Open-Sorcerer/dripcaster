import {
  createSignerFromKeypair,
  generateSigner,
  PublicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createV1, createCollectionV1 } from "@metaplex-foundation/mpl-core";
import { secretKey } from "../../secretKey";

const umi = createUmi(
  "https://devnet.helius-rpc.com/?api-key=b8faf699-a3b6-4697-9a58-31d044390459",
);

const myKeypair = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(secretKey));

const myKeypairSigner = createSignerFromKeypair(umi, myKeypair);

umi.use(signerIdentity(myKeypairSigner));

interface createCollectionProps {
  creator: PublicKey;
  name: string;
  metadataUrl: string;
}

export async function createCollection({ creator, name, metadataUrl }: createCollectionProps) {
  const collectionSigner = generateSigner(umi);
  console.log("Collection Address", collectionSigner.publicKey.toString());
  const result = await createCollectionV1(umi, {
    collection: collectionSigner,
    name: name,
    uri: metadataUrl,
  }).sendAndConfirm(umi);
  console.log("Collection", result);
  return collectionSigner.publicKey.toString();
}

interface createNFTProps {
  collectionAddress: PublicKey;
  newOwner: PublicKey;
  metadataUrl: string;
  name: string;
}

export async function createNFTOfCollection({
  collectionAddress,
  newOwner,
  metadataUrl,
  name,
}: createNFTProps) {
  const asset = generateSigner(umi);
  const result = await createV1(umi, {
    asset: asset,
    name: name,
    uri: metadataUrl,
    collection: collectionAddress,
    owner: newOwner,
  }).sendAndConfirm(umi);
  console.log("NFT", result);
  return result;
}
