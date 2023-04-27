import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/logo.png";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight : "600"
})
export const Navbar = () => {
  return (
    <div className="flex flex-row items-center justify-between px-5 py-2">
      <div className="p-2">
        <Image alt="logo" src={Logo} height={50} width={100} />
      </div>
      <div className="p-2">
        <Link href="/hotels" className="m-5">
          Hotels
        </Link>
        <Link href="/login" className = {montserrat.className}>Login</Link>
      </div>
    </div>
  );
};
