## Dripcast

![logo](./public/dripcast.png)

### What does it do

- It is a platform for creators to sell digital products (videos, e-books, images) via Farcaster Frames.
- Users can discover and purchase these digital assets by minting Access NFTs, which grant them access to the purchased content.

### How does it work?

- Creators list their digital products (videos, e-books, images) on the platform, which are encrypted.
- For each listed product, a new Smart Contract is launched through the Smart Contract Factory.
- Users can discover and purchase these products by minting Access NFTs through the Post Frame.
  After purchasing the Access NFT, users can view their purchased digital assets on the Viewing Page.

### How is it made

- We use Privy for Farcaster login on the website
- We check for the user's Farcaster ID's reputation score using Karma3 Labs API, if the user has enough points, they can create their products. If not, they can only purchase products. It acts as a Sybil resistance mechanism.
- The creator uploads digital assets and we encrypt them using Dynamic to provide Access Control via NFTs. Each product has a unique Smart Contract.
- Privy provides an embedded wallet for the creator's Farcaster ID, which is used to sign transactions.
- The creator can now share the buying link to his/her community via Farcaster Frames. The Frames act as a distribution channel for the creator.
- The user can purchase the product by minting an Access NFT via Farcaster Frames. The Access NFT is stored in the user's wallet and grants access to the purchased digital asset.
- The user can view the purchased digital asset on the Viewing Page, powered by Dynamic's Token Gating.
- Behind the scenes, we are using the Graph Network to index the data on the blockchain and provide a fast and efficient way to query the data.
- We are using Pinata's service to upload data to IPFS and store the metadata. We are using the Frames.js framework for creating Farcaster Frames.
- The smart contracts are deployed on Base and Optimism.

### Future Features

- Developing a mobile app for a better user experience.
- Implementing actions like commenting, rating, and sharing of digital assets on top of Farcaster.
