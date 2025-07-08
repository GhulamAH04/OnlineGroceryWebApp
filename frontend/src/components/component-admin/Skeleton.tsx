import React from 'react';

interface SkeletonComponentProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export default function SkeletonComponent({
  className,
  width,
  height,
}: SkeletonComponentProps) {
  return (
    <div className={`${className} animate-pulse`}>
      <div
        className="bg-gray-300"
        style={{ width: width || '100%', height: height || '100px' }}
      />
    </div>
  );
}
