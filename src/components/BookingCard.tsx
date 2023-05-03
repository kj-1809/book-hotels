import { Booking } from "@prisma/client";
export const BookingCard: React.FC<Booking> = ({
  checkIn,
  checkOut,
  id,
  guests,
  hotelId,
  rooms,
  total,
  userId,
}) => {
  return (
    <div className="grid w-full grid-cols-2 rounded-xl p-4 shadow-md">
      <div>
        <h1>Booking Id</h1>
        <h1>Check In</h1>
        <h1>Check Out</h1>
        <h1>Guests</h1>
        <h1>Hotel</h1>
        <h1>Rooms</h1>
        <h1>Total Price</h1>
      </div>
      <div>
        <div>{id}</div>
        <div>{new Date(checkIn).toLocaleDateString()}</div>
        <div>{new Date(checkOut).toLocaleDateString()}</div>
        <div>{guests}</div>
        <div>{hotelId}</div>
        <div>{rooms}</div>
        <div>{total}</div>
      </div>
    </div>
  );
};
