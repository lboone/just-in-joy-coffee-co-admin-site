"use client";
import Dropzone from "@/components/layout/Dropzone";

import { useState } from "react";

export default function UploadPage() {
  const [cid, setCid] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Key to force re-render
  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment the key to force re-render
    console.log({ refreshKey });
    console.log({ cid });
  };
  return (
    <div className="max-w-xl mx-auto min-h-screen w-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">
        Upload <span className="text-blue-800">Page</span>
      </h1>
      <Dropzone setCid={setCid} handleRefresh={handleRefresh} />
    </div>
  );
}
