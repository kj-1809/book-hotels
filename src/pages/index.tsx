// import { type NextPage } from "next";
// import Head from "next/head";
// import Link from "next/link";
// import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Card } from "~/components/Card";
import { prisma } from "~/server/db";
import { Prisma, Hotel } from "@prisma/client";
import { getServerAuthSession } from "~/server/auth";
import { GetServerSideProps } from "next";
import homepageImage from "../../public/homepage.jpg";
import Image from "next/image";
import { useState } from "react";

type HotelWithImages = Hotel & {
  imageUrls: {
    url: string
  }[]
}

interface Props {
  hotels: (Hotel & {
    imageUrls : {
      url : string
    }[]
  })[]
}

const Home: React.FC<Props> = ({ hotels }) => {
  const [searchText, setSearchText] = useState("");
  const [isSearchOn, setIsSearchOn] = useState(false);
  const q = api.hotel.search.useQuery(searchText, {
    enabled: false,
  });
  const [loading , setLoading] = useState(false)

  async function handleSearch() {
    setLoading(true)
    const foundHotels = await q.refetch();
    setLoading(false)
    console.log(foundHotels);
    if (foundHotels.data) {
      setSearchedHotels(foundHotels.data);
      setIsSearchOn(true);
    }
  }

  const [searchedHotels, setSearchedHotels] = useState<HotelWithImages[]>([]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex flex-col">
      <div className="relative overflow-hidden flex justify-center items-center">
        <Image
          src={homepageImage}
          alt="homeimg"
          className="h-96 w-full object-cover"
        />
        <div className="absolute flex w-screen flex-row justify-center">
          <input
            className="mx-4 w-full rounded-3xl px-4 py-4 focus:outline-none md:w-1/2 font-medium"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            className="mr-4 rounded-3xl bg-primary px-4 py-4 text-white"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 p-7 sm:grid-cols-2 lg:grid-cols-3">
        {!isSearchOn
          ? hotels.map((hotel) => {
              return (
                <Card
                  name={hotel.name}
                  info={hotel.info}
                  price={hotel.price}
                  key={hotel.id}
                  id={hotel.id}
                  imgUrl={hotel.imageUrls[0]?.url || ""}
                />
              );
            })
          : searchedHotels.map((hotel) => {
              return (
                <Card
                  name={hotel.name}
                  info={hotel.info}
                  price={hotel.price}
                  key={hotel.id}
                  id={hotel.id}
                  imgUrl={hotel.imageUrls[0]?.url || ""}
                />
              );
            })}
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const hotels = await prisma.hotel.findMany({
    include : {
      imageUrls : true
    }
  });

  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  });

  return {
    props: { hotels },
  };
};
