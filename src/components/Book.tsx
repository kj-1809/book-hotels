import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface Props {
  price: number;
}
export const Book: React.FC<Props> = ({ price }) => {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [days , setDays] = useState(1)

  const checkInDateRef = useRef(null);
  const checkOutDateRef = useRef(null);
  
  console.log(typeof checkInDate)
  console.log(checkInDate)
  console.log(new Date(checkInDate))

  useEffect(() => {
    if(checkInDate && checkOutDate){
      const start = new Date(checkInDate).getTime()
      const end = new Date(checkOutDate).getTime()
      const diff = (end-start)/(24 * 60 * 60 * 1000)
      if(diff > 0){
        setDays(diff)
      }else{
        setDays(1)
      }
    }
  },[checkInDate , checkOutDate])

  return (
    <div className="mt-16 flex flex-col rounded-2xl px-5 py-10 shadow-md md:mt-0">
      <h1 className="m-2 text-3xl font-semibold">Rs. {price} /night</h1>
      <div className="text-md m-2 mt-8 flex flex-row justify-between">
        <input
          type="date"
          ref={checkInDateRef}
          onChange={(e) => setCheckInDate(e.target.value)}
        />
        <input
          type="date"
          ref={checkOutDateRef}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
      </div>
      <div className="my-4 flex flex-row justify-between">
        <input
          placeholder="Guests"
          className="m-2 mr-0 h-12 w-full rounded-l-xl border-y-2 border-l-2 border-secondary p-3 text-center"
        />
        <input
          placeholder="Rooms"
          className="m-2 ml-0 h-12 w-full rounded-r-xl border-2 border-secondary p-3 text-center"
        />
      </div>
      <div className="m-2 mt-10 flex flex-row justify-between">
        <h1>{days} Nights x {price}</h1>
        <h1>{price * 5}</h1>
      </div>

      <div className="m-2 flex flex-row justify-between">
        <h1>Service Fee</h1>
        <h1>{price * 0.1}</h1>
      </div>
      <div className="m-2 flex flex-row justify-between">
        <h1>Total</h1>
        <h1>{price * days + price * 0.1}</h1>
      </div>
      <Link href="/">
        <div className="m-2 flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-secondary">
          <h1 className="">Book Now</h1>
        </div>
      </Link>
    </div>
  );
};
