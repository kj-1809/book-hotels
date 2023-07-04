import Image from "next/image";
import { Offer } from "~/components/Offer";
import { Book } from "~/components/Book";
import { prisma } from "~/server/db";
import { GetServerSideProps } from "next";
import { Amenity, Hotel, ImageUrl } from "@prisma/client";
import { api } from "~/utils/api";
import { getServerAuthSession } from "~/server/auth";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { MdLocationOn } from "react-icons/md";

interface Props {
  hotel: Hotel & {
    amenities: Amenity[];
    imageUrls: ImageUrl[];
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
      postBooking.mutate(
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
          onSuccess: (data) => {
            toast.success("Successfully Booked Hotel !");
            console.log(data);
            router.push("/");
          },
          onError: (e) => {
            toast.error("Some error occured !");
            console.log("error :: ", e);
          },
        }
      );
    } else {
      toast.error("Please provide complete data!");
    }
  };

  return (
    <div className="flex flex-col px-3 py-12 sm:px-8 sm:py-16">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold sm:text-4xl">{hotel.name}</h1>
          <h1 className="my-2 text-lg sm:text-2xl">{hotel.info}</h1>
        </div>
        <div className="mr-2 flex items-center">
          <MdLocationOn className="text-xl" />
          <h1 className="ml-2 flex">{hotel.location}</h1>
        </div>
      </div>

      <div className="my-6 grid h-[28rem] grid-cols-2 gap-2">
        <div className="relative col-span-2 sm:col-span-1">
          <Image
            src={hotel.imageUrls[0]?.url || ""}
            alt="hotel-img"
            className="rounded-3xl sm:rounded-none sm:rounded-l-3xl "
            fill={true}
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-2 sm:col-span-1">
          <div className="relative">
            <Image
              src={hotel.imageUrls[1]?.url || ""}
              alt="hotel-img"
              className="rounded-3xl sm:rounded-none"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="relative">
            <Image
              src={hotel.imageUrls[2]?.url || ""}
              alt="hotel-img"
              className="rounded-3xl sm:rounded-none sm:rounded-tr-3xl"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="relative">
            <Image
              src={hotel.imageUrls[3]?.url || ""}
              alt="hotel-img"
              className="rounded-3xl sm:rounded-none"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="relative">
            <Image
              src={hotel.imageUrls[4]?.url || ""}
              alt="hotel-img"
              className="rounded-3xl sm:rounded-none sm:rounded-br-3xl"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <h1 className="text-xl font-semibold sm:text-2xl">
            What this hotel offers
          </h1>
          <hr className="mb-4 mt-3" />
          {hotel.amenities.map((amenity) => (
            <Offer title={amenity.title} key={amenity.id} />
          ))}
          <h1 className="mt-8 text-xl font-semibold sm:text-2xl">
            Description
          </h1>
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
      imageUrls: true,
    },
  });
  console.log("Hotel : ", hotel);
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res });

  return {
    props: {
      hotel,
      userId: session?.user?.userId || null,
    },
  };
};
