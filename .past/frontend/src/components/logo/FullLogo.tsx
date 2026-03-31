import { GraduationCap } from 'lucide-react';

export type FullLogoProps = {
  logoSize?: number,
  textSize?: number,
}

export default function FullLogo({logoSize = 30, textSize = 20}: FullLogoProps) {
  return (
    <div className='flex gap-4 items-center'>
      <div className='bg-linear-to-r from-red-500 to-orange-500 rounded-lg p-1.5'>
        <GraduationCap size={logoSize} strokeWidth={2} />
      </div>
      <div className='font-semibold' style={{ fontSize: `${textSize}px` }}>
        UniWatch
      </div>
    </div>
  );
}
