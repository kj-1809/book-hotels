import { Booking } from "@prisma/client";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";
import { BookingCard } from "~/components/BookingCard";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

interface Props {
  bookings: (Booking & {
    hotel: {
      name: string;
    };
  })[];
}

const Bookings: React.FC<Props> = ({ bookings }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold">Bookings</h1>
      {bookings.map((booking) => {
        return (
          <BookingCard
            checkIn={booking.checkIn}
            checkOut={booking.checkOut}
            guests={booking.guests}
            rooms={booking.rooms}
            hotelId={booking.hotel.name}
            key={booking.id}
            total={booking.total}
            userId={booking.userId}
            id={booking.id}
            createdAt={booking.createdAt}
          />
        );
      })}
    </div>
  );
};
export default Bookings;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  });
  if (!session) {
    return {
      redirect: {
        to: "/",
        permanent: true,
      },
    };
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: session?.user.userId,
    },
    include: {
      hotel: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    props: {
      bookings: JSON.parse(JSON.stringify(bookings)),
    },
  };
};
