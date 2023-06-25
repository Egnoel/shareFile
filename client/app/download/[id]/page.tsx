import RenderFile from '@/components/RenderFile';
import axios from 'axios';
import fileDownload from 'js-file-download';
import { IFile } from '@/lib/types';
import { GetServerSidePropsContext, NextPage } from 'next';
import React from 'react';
import Image from 'next/image';

const index: NextPage<{ file: IFile }> = ({
  file: { name, format, sizeInBytes, id },
}) => {
  const handleDownload = async () => {
    const { data } = await axios.get(
      `http://localhost:8000/api/files/${id}/download`,
      { responseType: 'blob' }
    );
    fileDownload(data, name);
  };

  return (
    <div className="flex flex-col items-center justify-center py-3 space-y-4 bg-gray-800 shadow-xl w-96">
      {!id ? (
        <span>oops! File does not exist. Check the url</span>
      ) : (
        <>
          <Image
            src="/images/download.png"
            alt="download"
            className="object-contain"
            height={16}
            width={16}
          />
          <h1 className="text-xl">Your file is ready to be downloaded</h1>
          <RenderFile file={{ name, format, sizeInBytes }} />
          <button className="button" onClick={handleDownload}>
            Download
          </button>
        </>
      )}
    </div>
  );
};

export default index;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  let file;
  try {
    const { data } = await axios.get(`http://localhost:8000/api/files/${id}`);
    file = data;
  } catch (error: any) {
    console.log(error.response.data);
    file = {};
  }

  return {
    props: { file },
  };
}
