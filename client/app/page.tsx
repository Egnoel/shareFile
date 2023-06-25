'use client';
import DownloadFile from '@/components/DownloadFile';
import DropZoneComponent from '@/components/DropZoneComponent';
import EmailForm from '@/components/EmailForm';
import RenderFile from '@/components/RenderFile';
import { IFile } from '@/lib/types';
import axios from 'axios';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<any | undefined>();
  const [id, setId] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [uploadState, setUploadState] = useState<
    'Uploading' | 'Upload Failed' | 'Uploaded' | 'Upload'
  >('Upload');
  const [url, setUrl] = useState('');

  const handleUpload = async () => {
    if (uploadState === 'Uploading') return;
    setUploadState('Uploading');
    const formData = new FormData();
    if (file) {
      formData.append('myFile', file);
    }
    try {
      const { data } = await axios({
        method: 'post',
        data: formData,
        url: 'http://localhost:8000/api/files/upload',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setDownloadLink(data.downloadLink);
      setId(data.id);
      setUrl(data.url);
    } catch (error: any) {
      console.log(error.response);
      setUploadState('Upload Failed');
    }
  };

  const resetComponent = () => {
    setFile(undefined);
    setDownloadLink('');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="my-4 text-3xl font-medium">
        Got a File? Share It Like Fake News
      </h1>
      <div className="flex flex-col items-center justify-center bg-gray-800 shadow-xl w-100 rounded-xl">
        {!downloadLink && <DropZoneComponent setFile={setFile} />}

        {file && (
          <RenderFile
            file={{
              format: file.type.split('/')[1],
              name: file.name,
              sizeInBytes: file.size,
            }}
          />
        )}
        {!downloadLink && file && (
          <button className="button" onClick={handleUpload}>
            {uploadState}
          </button>
        )}
        {downloadLink && (
          <div className="p-2 text-center">
            <DownloadFile downloadLink={downloadLink} />
            <EmailForm id={id} />
            <button className="button" onClick={resetComponent}>
              Upload a New File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
