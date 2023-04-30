import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/logo.png";
import { Montserrat } from "next/font/google";

export const Navbar = () => {
  return (
    <div className="flex flex-row items-center justify-between px-5 py-2 shadow-sm">
      <div className="p-2">
        <Link href="/">
          <Image alt="logo" src={Logo} height={50} width={100} />
        </Link>
      </div>
      <div className="p-2">
        <Link href="/hotels/" className="m-4 font-sans font-semibold opacity-60">
          Hotels
        </Link>
        <Link
          href="/api/auth/signin"
          className="m-4 font-sans font-semibold opacity-60"
        >
          Login
        </Link>
      </div>
    </div>
  );
};
