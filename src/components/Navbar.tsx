import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/logo.png";
import { useSession } from "next-auth/react";

export const Navbar = () => {
  const userId = true;
  const session = useSession();
  return (
    <div className="flex flex-row items-center justify-between px-5 py-2 shadow-sm">
      <div className="p-2">
        <Link href="/">
          <Image alt="logo" src={Logo} height={50} width={100} />
        </Link>
      </div>
      <div className="p-1 sm:p-2">
        {/* <Link
          href="/hotels/"
          className="m-2 sm:m-4 font-sans font-semibold opacity-60"
        >
          Hotels
        </Link> */}
        {session.data?.user.role === "ADMIN" && (
          <Link
            href="/hotels/addhotel"
            className="m-2 font-sans font-semibold opacity-60 sm:m-4"
          >
            Add Hotel 
          </Link>
        )}
        {!session.data?.user.userId && (
          <Link
            href="/api/auth/signin"
            className="m-2 font-sans font-semibold opacity-60 sm:m-4"
          >
            Login
          </Link>
        )}
        {session.data?.user.userId && (
          <Link
            href="/bookings"
            className="m-2 font-sans font-semibold opacity-60 sm:m-4"
          >
            My Bookings
          </Link>
        )}
      </div>
    </div>
  );
};
