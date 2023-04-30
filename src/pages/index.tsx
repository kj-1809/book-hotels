// import { type NextPage } from "next";
// import Head from "next/head";
// import Link from "next/link";
// import { signIn, signOut, useSession } from "next-auth/react";
// import { api } from "~/utils/api";
import { Card } from "~/components/Card";
import { prisma } from "~/server/db";
import { Prisma } from "@prisma/client";

const tonedHotelObject = Prisma.validator<Prisma.HotelArgs>()({
  select: {
    id: true,
    name: true,
    price: true,
    info: true,
  },
});

type tonedHotel = Prisma.HotelGetPayload<typeof tonedHotelObject>

interface Props {
  hotels:  tonedHotel[];
}

const Home: React.FC<Props> = ({ hotels }) => {
  console.log("hotels : ", hotels);
  return (
    <div className="grid grid-cols-1 gap-6 p-7 sm:grid-cols-2 lg:grid-cols-3">
      {hotels.map((hotel) => {
        return (
          <Card
            name={hotel.name}
            info={hotel.info}
            price={hotel.price}
            key={hotel.id}
            id = {hotel.id}
          />
        );
      })}
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const hotels = await prisma.hotel.findMany({
    select: {
      name: true,
      id: true,
      info: true,
      price: true,
    },
  });
  return {
    props: { hotels },
  };
};
