//export const imageURLRegEx = /^https:\/\/34vzegrc44\.ufs\.sh\/f\/[A-Za-z0-9]/;
export const imageURLRegEx =
  /^(https:\/\/maroon-quiet-crab-480\.mypinata\.cloud\/ipfs\/|https:\/\/34vzegrc44\.ufs\.sh\/f\/)[A-Za-z0-9_-]+$/;
export const instagramReelRegex =
  /^https:\/\/www\.instagram\.com\/reel\/[A-Za-z0-9_-]+\/?$/;

export const imageBaseURL =
  "https://maroon-quiet-crab-480.mypinata.cloud/ipfs/";

export const shoutOutImages = [
  {
    label: "Male",
    value: `${imageBaseURL}bafkreihgywc4xywcruxliym6qcpm4scbnyrszfx5bb2qxiqmagugooujl4`,
    src: `${imageBaseURL}bafkreihgywc4xywcruxliym6qcpm4scbnyrszfx5bb2qxiqmagugooujl4`,
  },
  {
    label: "Female",
    value: `${imageBaseURL}bafkreicfq545pardus6si4ed3xc4gc6twvzgm4wtdox3saaajx3tnesc4e`,
    src: `${imageBaseURL}bafkreicfq545pardus6si4ed3xc4gc6twvzgm4wtdox3saaajx3tnesc4e`,
  },
];
