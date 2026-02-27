import Image from "next/image";

type Props = {
  imgUrl: string;
  imgKey: string;
};
const ImageDisplay = ({ imgUrl, imgKey }: Props) => {
  return (
    <div className="relative group w-[100px] mx-auto">
      <div className="">
        <Image
          src={
            imgUrl
              ? imgUrl
              : `https://maroon-quiet-crab-480.mypinata.cloud/ipfs/${imgKey}`
          }
          alt="Uploaded Image"
          width={100}
          height={100}
          className="rounded-lg object-cover w-full h-full"
        />
      </div>
    </div>
  );
};
export default ImageDisplay;
