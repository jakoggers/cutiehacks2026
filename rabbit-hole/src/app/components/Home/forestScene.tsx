import Image from "next/image";

import HeartCard from "./heartCard"

const ForestScene = () => {
  return (
    <div className="forest-scene" aria-hidden="true">
      <div className="meadow-sky" />
      <div className="meadow-treeline" />
      <div className="fir fir-left-far" />
      <div className="fir fir-right-far" />
      <div className="fir fir-left" />
      <div className="fir fir-right" />
      <div className="meadow-friend meadow-friend-left">
        <HeartCard />
        <Image src={"/bunny-cream.png"} width={28} height={27} alt="" />
      </div>
      <div className="meadow-friend meadow-friend-right">
        <HeartCard />
        <Image src={"/bunny-lilac.png"} width={30} height={26} alt="" />
      </div>
    </div>
  );
}

export default ForestScene;