"use client";
import { imageBaseURL } from "@/lib/constants";
import { pinata } from "@/lib/pinata";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { FormLabel } from "../ui/form";
import ImageDisplay from "./ImageDisplay";
import Spinner from "./Spinner";

type DropzoneProps = {
  setCid: React.Dispatch<React.SetStateAction<string | null>>;
  handleRefresh: React.Dispatch<React.SetStateAction<void>>;
};
export default function Dropzone({ setCid, handleRefresh }: DropzoneProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [localCid, setLocalCid] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    if (!file) return; // Ensure there's a file to upload
    setUploading(true);
    try {
      const urlRequest = await fetch("/admin-panel/api/url"); // Fetches the temporary upload URL
      const urlResponse = await urlRequest.json(); // Parse response
      if (!file) {
        throw new Error("No file selected for upload");
      }
      const upload = await pinata.upload.public.file(file).url(urlResponse.url); // Upload the file with the signed URL
      setCid(upload.cid);
      setFileUrl(`${imageBaseURL}${upload.cid}`); // Set the external file state
      setLocalCid(upload.cid);
    } catch (error) {
      console.error("Error uploading file:", error);
      //toast.error("File upload failed");
      throw new Error("File upload failed");
    } finally {
      setUploading(false);
      handleRefresh();
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      uploadFile(acceptedFiles[0]);
    }
  }, []); // Empty dependency array to avoid unnecessary re-renders
  const rejectedFiles = useCallback((fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      const tooManyFiles = fileRejections.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );
      if (tooManyFiles) {
        toast.error("You can only upload one file at a time.");
      }
      const fileTooLarge = fileRejections.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );
      if (fileTooLarge) {
        toast.error("File size exceeds the 5MB limit.");
      }
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: rejectedFiles,
    disabled: uploading, // Disable dropzone while uploading
    maxFiles: 1,
    maxSize: 1024 * 1024 * 5,
    accept: {
      "image/*": [],
    },
    multiple: false,
  }); // 5MB max file size

  if (fileUrl) {
    return <ImageDisplay imgUrl={fileUrl} imgKey={localCid!} />;
  }

  return (
    <>
      <FormLabel>Upload Image</FormLabel>
      <div
        {...getRootProps({
          className:
            "p-16 mt-10 border-dashed border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out w-full",
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-center">Drop the files here ...</p>
        ) : (
          <div className="flex flex-col items-center gap-y-3">
            <p>Drag &apos;n&apos; drop a file here, or click to select file</p>
            <Button>
              {uploading ? (
                <div>
                  <Spinner show={uploading} className="text-white text-2xl" />
                </div>
              ) : (
                "Select File"
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
