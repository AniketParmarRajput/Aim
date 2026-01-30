'use client';

import { useParams } from 'next/navigation';
const Page = () => {
    const { id } = useParams();
  return (
    <div>
    <pre>{id}</pre>
    </div>
  );
};

export default Page;

