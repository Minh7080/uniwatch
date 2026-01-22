import { Input } from '@/components/ui/input';
import DisalableInput, { type DisalableInputProps } from './DisalableInput';

export type MinMaxInputProps = DisalableInputProps & {
  minValue?: number;
  maxValue?: number;
  onMinChange?: (value: number | undefined) => void;
  onMaxChange?: (value: number | undefined) => void;
};

export default function MinMaxInput({ 
  label, 
  checked, 
  onClick, 
  minValue, 
  maxValue, 
  onMinChange, 
  onMaxChange 
}: MinMaxInputProps) {
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
        value={minValue ?? ''}
        onChange={(e) => {
          const value = e.target.value === '' ? undefined : Number(e.target.value);
          onMinChange?.(value);
        }}
      />

      <Input
        type='number'
        placeholder='Max'
        step={1}
        min={0}
        disabled={!checked}
        value={maxValue ?? ''}
        onChange={(e) => {
          const value = e.target.value === '' ? undefined : Number(e.target.value);
          onMaxChange?.(value);
        }}
      />
    </DisalableInput>
  );
};
