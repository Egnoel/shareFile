import { sizeInMb } from '@/lib/sizeInMb';
import { IFile } from '@/lib/types';
import Image from 'next/image';
import React, { FunctionComponent } from 'react';

const RenderFile: FunctionComponent<{ file: IFile }> = ({ file }) => {
  return (
    <div className="flex items-center w-full p-4 my-2">
      <Image
        src="/images/photo.png"
        alt=""
        className="object-contain"
        height={14}
        width={14}
      />
      <span className="mx-2">{file.name}</span>
      <span className="ml-auto">{sizeInMb(file.sizeInBytes)}</span>
    </div>
  );
};

export default RenderFile;
