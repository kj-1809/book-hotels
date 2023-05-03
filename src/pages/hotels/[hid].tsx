import Image from "next/image";
import HotelImage from "../../../public/test.jpg";
import { Offer } from "~/components/Offer";
import { Book } from "~/components/Book";
import { prisma } from "~/server/db";
import { GetServerSideProps } from "next";
import { Amenity, Hotel } from "@prisma/client";
import { api } from "~/utils/api";
import { getServerAuthSession } from "~/server/auth";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

interface Props {
  hotel: Hotel & {
    amenities: Amenity[];
  };
  userId: string;
}

const Hotel: React.FC<Props> = ({ hotel, userId }) => {
  const postBooking = api.booking.createBooking.useMutation();
  const router = useRouter();

  const handleBooking = async (
    checkIn: string,
    checkOut: string,
    days: number,
    rooms: number,
    guests: number
  ) => {
    console.log("IN hid k");
    console.log(checkIn, checkOut, days, guests, rooms);
    const total: number = hotel.price * days * rooms;
    if (!userId) {
      router.push("/api/auth/signin");
      return;
    }
    if (checkIn && checkOut && days && guests && rooms) {
      const data = postBooking.mutate(
        {
          userId,
          checkIn,
          checkOut,
          guests,
          rooms,
          total,
          hotelId: hotel.id,
        },
        {
          onSuccess: () => {
            toast.success("Successfully Booked Hotel !");
            router.push("/");
          },
          onError: () => {
            toast.error("Some error occured !");
          },
        }
      );
    }else{
      toast.error("Please provide complete data!")
    }
  };

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
          <h1 className="mt-8 text-2xl font-semibold">Description</h1>
          <hr className="mb-4 mt-3" />
          <p>{hotel.description}</p>
        </div>
        <div className="text-xl font-semibold md:col-span-2">
          <Book price={hotel.price} onSubmit={handleBooking} />
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
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res });

  return {
    props: {
      hotel,
      userId: session?.user?.userId || null,
    },
  };
};
