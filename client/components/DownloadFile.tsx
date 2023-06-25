import Image from 'next/image';
import React from 'react';

interface DownloadOptions {
  downloadLink: string;
}

const DownloadFile = ({ downloadLink }: DownloadOptions) => {
  return (
    <div className="p-1">
      <h1 className="my-2 text-lg font-medium">
        You can copy the link and share it .
      </h1>
      <div className="flex space-x-3">
        <span className="break-all">{downloadLink}</span>
        <Image
          src="/images/copy.png"
          alt="uploaded"
          className="object-contain cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(downloadLink);
          }}
          height={18}
          width={18}
        />
      </div>
    </div>
  );
};

export default DownloadFile;
