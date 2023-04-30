import Image from "next/image";
import HotelImage from "../../../public/test.jpg";
import { Offer } from "~/components/Offer";
import { Book } from "~/components/Book";
import { prisma } from "~/server/db";
import { GetServerSideProps } from "next";
import { Amenity, Hotel } from "@prisma/client";

interface Props {
  hotel: Hotel & {
    amenities: Amenity[];
  };
}

const Hotel: React.FC<Props> = ({ hotel }) => {
  return (
    <div className="flex flex-col px-8 py-16">
      <div className="flex flex-col">
        <h1 className="text-4xl font-semibold">{hotel.name}</h1>
        <h1 className="my-2 text-2xl">{hotel.info}</h1>
      </div>
      <div className="my-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="">
          <Image src={HotelImage} alt="hotel-img" className="rounded-l-3xl" />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          <Image src={HotelImage} alt="hotel-img" className="" />
          <Image src={HotelImage} alt="hotel-img" className="rounded-tr-3xl" />
          <Image src={HotelImage} alt="hotel-img" className="" />
          <Image src={HotelImage} alt="hotel-img" className="rounded-br-3xl" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <h1 className="text-2xl font-semibold">What this hotel offers</h1>
          <hr className="mb-4 mt-3" />
          {hotel.amenities.map((amenity) => (
            <Offer title={amenity.title} key={amenity.id} />
          ))}
          <Offer title="Wi-Fi" />
          <Offer title="Kitchen" />
          <Offer title="Free parking on premises" />
          <Offer title="Private patio or balcony" />
          <h1 className="mt-8 text-2xl font-semibold">Description</h1>
          <hr className="mb-4 mt-3" />
          <p>{hotel.description}</p>
        </div>
        <div className="text-xl font-semibold md:col-span-2">
          <Book price={hotel.price} />
        </div>
      </div>
    </div>
  );
};

export default Hotel;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const hotel = await prisma.hotel.findFirst({
    where: {
      id: ctx.params!.hid as string,
    },
    include: {
      amenities: true,
    },
  });

  return {
    props: {
      hotel,
    },
  };
};
