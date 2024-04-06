'use client';
import {Card} from '@/components';
import {NextPage} from 'next';
import Head from 'next/head';
import {useState} from 'react';

const products = [
  {
    name: 'Product 1',
    price: 100,
    image: '/images/product.png',
  },
  {
    name: 'Product 2',
    price: 200,
    image: '/images/product.png',
  },
  {
    name: 'Product 3',
    price: 300,
    image: '/images/product.png',
  },
  {
    name: 'Product 4',
    price: 400,
    image: '/images/product.png',
  },
  {
    name: 'Product 5',
    price: 500,
    image: '/images/product.png',
  },
  {
    name: 'Product 6',
    price: 600,
    image: '/images/product.png',
  },
  {
    name: 'Product 7',
    price: 700,
    image: '/images/product.png',
  },
  {
    name: 'Product 8',
    price: 800,
    image: '/images/product.png',
  },
  {
    name: 'Product 9',
    price: 900,
    image: '/images/product.png',
  },
  {
    name: 'Product 10',
    price: 1000,
    image: '/images/product.png',
  },
];

const Discover: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Discover</title>
        <meta name="description" content="onlyframes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex flex-col w-full pt-36 pb-20 md:pt-32 md:pb-6 lg:py-28 px-10 md:px-24">
        <h1 className="text-2xl md:text-3xl text-gray-200 font-primary font-medium">
          My Purchases 🪴
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
              <p className="text-secondary text-lg">No products listed yet.</p>
            ) : (
              products.map((data, index) => (
                <Card
                  key={index}
                  name={data.name}
                  price={data.price}
                  image={data.image}
                  label={<span>Check transaction</span>}
                  link=""
                />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Discover;
