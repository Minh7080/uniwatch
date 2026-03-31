import { Button } from '@/components/ui/button';

type SearchButtonProps = {
  onClick?: () => void,
  disabled?: boolean,
}

export default function SearchButton({ onClick, disabled }: SearchButtonProps) {
  return (
    <Button
      variant='outline'
      className='
      grow
      relative
      overflow-hidden
      bg-linear-to-r
      from-red-500/50 to-orange-500/50
      before:absolute
      before:inset-0
      before:bg-linear-to-r
      before:from-red-500
      before:to-orange-500
      before:opacity-0
      enabled:hover:before:opacity-100
      before:transition-opacity
      before:duration-300
      '
      onClick={onClick}
      disabled={disabled}
    >
      <span className='relative z-10'>Search</span>
    </Button>
  );
}
