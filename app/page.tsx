import Image from "next/image";
import { SearchContainer } from "./components/SearchContainer";
import Logo from "../public/hearthstone.png";

export default function Home() {
  return (
    <div className="px-[48px] py-[24px] max-w-[1024px] mx-auto pb-[256px]">
      <Image src={Logo} alt="hearthstone logo" />
      {/* <h1 className="text-[24px] font-bold">HearthStone Card Finder</h1> */}
      <SearchContainer />
    </div>
  );
}
