import { GraduationCap } from 'lucide-react';

export type LogoProps = {
  logoSize?: number
}

export default function Logo({ logoSize = 30 }: LogoProps) {
  return (
    <div className='bg-linear-to-r from-red-500 to-orange-500 inline-block rounded-lg p-1.5'>
      <GraduationCap size={logoSize} strokeWidth={2} />
    </div>
  );
}
