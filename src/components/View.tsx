import { SpringValue, animated } from '@react-spring/web';
import type { ReactNode } from 'react';
import { useStackStore } from '../stores/useStackStore';
import CaretLeft from './icons/CaretLeft';
import { SharedElement } from './SharedElement';

interface ViewProps {
  view: { id: string; previousId?: string };
  title: string;
  style: { x: SpringValue<number>; opacity: SpringValue<number> };
  children: ReactNode;
}

export const View = ({ view, title, style, children }: ViewProps) => {
  const viewsStack = useStackStore();
  const previousView = viewsStack.getView(view.previousId);

  return (
    <animated.div
      className="w-full h-full absolute overflow-auto pb-6"
      style={{
        opacity: style.x.to((p) => (p <= -0.5 ? 0 : 1)),
        x: style.x.to((p) => `${p * 100}%`),
        boxShadow: style.x.to((p) => (p > 0 ? '0 0 40px black' : 'none')),
      }}
    >
      <div className="bg-black text-white min-h-full p-4">
        {previousView ? (
          <div
            className="text-blue-500 text-lg mb-4 cursor-pointer active:opacity-40 js-no-drag flex items-center gap-1"
            onClick={viewsStack.popView}
          >
            <animated.div style={{ opacity: style.x.to([0, 0.25], [1, 0]) }}>
              <CaretLeft size={20} />{' '}
            </animated.div>
            <SharedElement id={view.previousId ?? view.id}>
              <span className="text-blue-500 text-lg">
                {previousView.title}
              </span>
            </SharedElement>
          </div>
        ) : null}

        <div className="mb-4 js-draghandle cursor-grab">
          <SharedElement id={view.id}>
            <span className="text-2xl font-bold text-white">{title}</span>
          </SharedElement>
        </div>

        {children}
      </div>
    </animated.div>
  );
};
