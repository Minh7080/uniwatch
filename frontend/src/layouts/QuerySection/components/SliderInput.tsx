import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import type { Dispatch, SetStateAction } from 'react';
import DisalableInput, { type DisalableInputProps } from './DisalableInput';

export type SliderInputProps = DisalableInputProps & {
  value: number,
  setValue: Dispatch<SetStateAction<number>>,
};

export default function SliderInput
  ({ label, checked, onClick, value, setValue }: SliderInputProps) {
  return (
    <DisalableInput 
      className='flex gap-4' 
      label={label} 
      checked={checked} 
      onClick={onClick}
    >
      <Slider
        disabled={!checked}
        className='mb-2 grow'
        max={1} min={0} step={0.1}
        value={[value]}
        onValueChange={([value]) => setValue(value)}
      />
      <Input
        type='number'
        className='shrink w-18 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
        value={value}
        max={1}
        min={0}
        onChange={e => {
          const value = e.target.value;

          // Allow empty input or valid intermediate states like "0."
          if (value === '' || value === '.' || value === '0.') {
            setValue(parseFloat(value));
            return;
          }

          const num = parseFloat(value);

          // Only validate if it's a complete number
          if (!isNaN(num) && num >= 0 && num <= 1) {
            setValue(parseFloat(value));
          }
        }}
        onBlur={e => {
          // Clean up on blur - ensure it's a valid number
          const num = parseFloat(e.target.value);
          if (isNaN(num) || num < 0) {
            setValue(0);
          } else if (num > 1) {
            setValue(1);
          }
        }}
        disabled={!checked}
      />
    </DisalableInput>
  );
};
