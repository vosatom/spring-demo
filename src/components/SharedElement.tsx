import { SpringValue, animated } from '@react-spring/web';
import React, {
  useContext,
  useRef,
  useState,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

const SharedContext = React.createContext<{
  portalRef: MutableRefObject<HTMLDivElement | null>;
  parentRef: HTMLDivElement | null;
  setParent: (ref: HTMLDivElement) => void;
  currentRef: HTMLDivElement | null;
  setCurrent: (ref: HTMLDivElement) => void;
}>({
  portalRef: { current: null },
  parentRef: null,
  setParent: () => {},
  currentRef: null,
  setCurrent: () => {},
});

const InnerViewContext = React.createContext<{
  percentage: SpringValue<number>;
  id: string;
  activeId: string;
}>({ percentage: new SpringValue(0), activeId: '', id: '' });

export const SharedContextProvider = ({
  children,
}: {
  children: { props: { children: ReactElement[] } };
}) => {
  const portalRef = useRef<HTMLDivElement>(null);
  const len = children.props.children.length;
  const prev = children.props.children[len - 2];
  const activeId = prev?.props.view.id;

  const [parentRef, setParent] = useState<HTMLDivElement | null>(null);
  const [currentRef, setCurrent] = useState<HTMLDivElement | null>(null);

  return (
    <SharedContext.Provider
      value={{
        portalRef,
        parentRef,
        setParent,
        currentRef,
        setCurrent,
      }}
    >
      {children.props.children.map((child) => {
        return (
          <InnerViewContext.Provider
            key={child.key}
            value={{
              percentage: child.props.style.x,
              activeId,
              id: child.props.view.id,
            }}
          >
            {child}
          </InnerViewContext.Provider>
        );
      })}

      <div ref={portalRef} style={{ position: 'relative' }} />
    </SharedContext.Provider>
  );
};

const getRect = (ref: HTMLDivElement | null) => {
  if (!ref) return { top: 0, left: 0, width: 0, height: 0 };
  return {
    top: ref?.offsetTop,
    left: ref?.offsetLeft,
    width: ref?.offsetWidth,
    height: ref?.offsetHeight,
  };
};

export const SharedElement = ({
  id,
  children,
}: {
  id: string;
  children?: ReactNode;
}) => {
  const context = useContext(SharedContext);
  const context2 = useContext(InnerViewContext);
  const enabled = context2.activeId === id;
  const isFromPrevView = id === context2.id;
  const portalTarget = context.portalRef.current ?? document.body;

  if (!enabled || !portalTarget) {
    return children;
  }

  const percentage = context2.percentage;

  const currentRect = getRect(context.currentRef);
  const targetRect = getRect(context.parentRef);

  const thisRect = isFromPrevView ? targetRect : currentRect;
  const otherRect = isFromPrevView ? currentRect : targetRect;

  const scaleX = otherRect?.width / thisRect?.width;
  const scaleY = otherRect?.height / thisRect?.height;

  const from = isFromPrevView ? [0, -0.5] : [0, 1];

  return (
    <animated.div
      ref={isFromPrevView ? context.setParent : context.setCurrent}
      style={{
        display: 'inline-block',
        opacity: percentage.to((p) => (p === 0 ? 1 : 0)),
      }}
    >
      {children}
      {createPortal(
        <animated.div
          style={{
            opacity: isFromPrevView
              ? percentage.to((p) => (p === 0 ? 0 : (p + 0.5) / 0.5))
              : percentage.to((p) => (p === 0 ? 0 : 1 - p)),

            ...thisRect,

            position: 'absolute',
            pointerEvents: 'none',
            transformOrigin: '0 0',

            x: percentage.to(from, [0, otherRect.left - thisRect.left]),
            y: percentage.to(from, [0, otherRect.top - thisRect.top]),
            scaleX: percentage.to(from, [1, scaleX]),
            scaleY: percentage.to(from, [1, scaleY]),
          }}
        >
          {children}
        </animated.div>,
        portalTarget
      )}
    </animated.div>
  );
};
