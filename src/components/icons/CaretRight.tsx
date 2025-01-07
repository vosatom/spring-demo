import clsx from 'clsx';

import type { IconProps } from './types';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const CaretRight = ({ title, titleId, ...props }: IconProps & SVGRProps) => (
  <svg
    className={clsx('caret-right__svg-icon-phosphor')}
    fill="currentColor"
    viewBox="0 0 256 256"
    width={props.size}
    height={props.size}
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="m181.66 133.66-80 80a8 8 0 0 1-11.32-11.32L164.69 128 90.34 53.66a8 8 0 0 1 11.32-11.32l80 80a8 8 0 0 1 0 11.32Z" />
  </svg>
);
export default CaretRight;
