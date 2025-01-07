import { createContext, type FC, type ReactNode } from 'react';

export type IconWeight =
  | 'thin'
  | 'light'
  | 'regular'
  | 'bold'
  | 'fill'
  | 'duotone';

export type PaintFunction = (color: string) => ReactNode | null;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  size?: string | number;
  weight?: IconWeight;
  mirrored?: boolean;
  testID?: string;
  duotoneColor?: string;
  duotoneOpacity?: number;
  title?: string; // SVGRProps
  titleId?: string; // SVGRProps
}

export type Icon = FC<IconProps>;

export const IconContext = createContext<IconProps>({
  color: '#000',
  size: 24,
  weight: 'regular',
  mirrored: false,
  duotoneColor: '#000',
  duotoneOpacity: 0.2,
});
