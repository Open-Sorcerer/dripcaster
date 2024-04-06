'use client';
import {Card} from '@/components';
import axios from 'axios';
import {NextPage} from 'next';
import Head from 'next/head';
import {useEffect, useState} from 'react';

let data = JSON.stringify({
  query: `{
  ownershipTransferreds(first: 5) {
    id
    previousOwner
    newOwner
    blockNumber
  }
  productCreateds(first: 5) {
    id
    creator
    product
    blockNumber
  }
}`,
  variables: {},
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://api.studio.thegraph.com/query/37601/onlyframesv3/v0.1',
  headers: {
    'Content-Type': 'application/json',
    Cookie:
      '__cf_bm=IbNdTRLZCgpC4nXRkRQy_tuhmbBMdas3fmkjm2DiJfk-1711267853-1.0.1.1-uljFti8Q56RcpolToLdMjgLe.zINnWDiA4UiQKnN.YiBzgvQ.pvbe6_.x09v3uXZno2_LKLHr6ntnIv1hyt4JA',
  },
  data: data,
};

const Discover: NextPage = () => {
  const [products, setProducts] = useState([]);
  const [productsAddresses, setProductsAddresses] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    axios
      .request(config)
      .then((response) => {
        setProductsAddresses(response.data.data.productCreateds);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Discover</title>
        <meta name="description" content="onlyframes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex flex-col w-full pt-36 pb-20 md:pt-32 md:pb-6 lg:py-28 px-10 md:px-24">
        <h1 className="text-2xl md:text-3xl text-gray-200 font-primary font-medium">
          Explore digital products 🛰️
        </h1>
        {isLoading ? (
          <div className="flex flex-col mt-5 w-fit bg-[#141414] bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-xl shadow-md p-6">
            <div className="animate-pulse flex flex-col space-x-4">
              <div className="rounded-xl bg-neutral-700/80 h-48 w-[12rem]"></div>
              <div className="block h-4 mt-5 items-start bg-gray-400 rounded w-3/4"></div>
              <div className="flex flex-row justify-between mt-2">
                <div className="h-6 w-16 bg-gray-300/80 rounded"></div>
                <div className="h-8 w-20 bg-primary/50 rounded-lg"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
            {products.length === 0 ? (
              <p className="text-teal-400 text-lg">No products listed yet.</p>
            ) : (
              products.map((data, index) => (
                // <Card
                //   key={index}
                //   name={data.name}
                //   price={data.price}
                //   image={data.image}
                //   label={'Buy Now'}
                // />
                <></>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Discover;
