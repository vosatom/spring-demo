import clsx from 'clsx';

import type { IconProps } from './types';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const CaretLeft = ({ title, titleId, ...props }: IconProps & SVGRProps) => (
  <svg
    className={clsx('caret-left__svg-icon-phosphor')}
    fill="currentColor"
    viewBox="0 0 256 256"
    width={props.size}
    height={props.size}
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M165.66 202.34a8 8 0 0 1-11.32 11.32l-80-80a8 8 0 0 1 0-11.32l80-80a8 8 0 0 1 11.32 11.32L91.31 128Z" />
  </svg>
);
export default CaretLeft;
