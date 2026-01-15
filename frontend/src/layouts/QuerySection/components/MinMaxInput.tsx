import { Input } from '@/components/ui/input';
import DisalableInput, { type DisalableInputProps } from './DisalableInput';

export default function MinMaxInput({ label, checked, onClick }: DisalableInputProps) {
  return (
    <DisalableInput 
      label={label} 
      checked={checked} 
      onClick={onClick} 
      className='flex gap-4'
    >
        <Input
          type='number'
          placeholder='Min'
          step={1}
          min={0}
          disabled={!checked}
        />

        <Input
          type='number'
          placeholder='Max'
          step={1}
          min={0}
          disabled={!checked}
        />
    </DisalableInput>
  );
};
