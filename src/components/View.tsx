import { SpringValue, animated } from '@react-spring/web';
import type { ReactNode } from 'react';
import { useStackStore } from '../stores/useStackStore';
import CaretLeft from './icons/CaretLeft';

interface ViewProps {
  view: { id: string; previousId?: string };
  title: string;
  style: { x: SpringValue<string>; opacity: SpringValue<number> };
  children: ReactNode;
}

export const View = ({ view, title, style, children }: ViewProps) => {
  const viewsStack = useStackStore();
  const previousView = viewsStack.getView(view.previousId);

  return (
    <animated.div
      className="w-full h-full absolute overflow-auto pb-6"
      style={style}
    >
      <div className="bg-black text-white min-h-full p-4">
        {previousView ? (
          <div
            className="text-blue-500 text-lg mb-4 cursor-pointer active:opacity-40 js-no-drag flex items-center gap-1"
            onClick={viewsStack.popView}
          >
            <CaretLeft size={20} /> <span>{previousView.title}</span>
          </div>
        ) : null}

        <div className="text-2xl font-bold mb-4 js-draghandle cursor-grab">
          {title}
        </div>

        {children}
      </div>
    </animated.div>
  );
};
