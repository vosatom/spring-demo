import {
  useTransition,
  animated,
  useSpring,
  config,
  useSpringRef,
  Controller,
  easings,
  type Lookup,
} from '@react-spring/web';
import { type RefObject, useEffect, useRef, useState } from 'react';
import type {
  CommonGestureState,
  DragBounds,
  FullGestureState,
  State,
} from '@use-gesture/react';
import { createUseGesture, dragAction } from '@use-gesture/react';
import { useStackStore } from '../stores/useStackStore';
import { View } from './View';
import * as screens from './screens';
import clsx from 'clsx';
import { isTouchDevice } from './utils/isTouchDevice';
import { SharedContextProvider } from './SharedElement';

const useGesture = createUseGesture([dragAction]);

const IS_TOUCH_DEVICE = isTouchDevice();

useStackStore.setState({
  views: new Map([
    ['home', { title: 'Home', component: screens.Home }],
    ['settings', { title: 'Settings', component: screens.Settings }],
    ['wifi', { title: 'Wi-Fi', component: screens.Wifi }],
  ]),
});

const PERCENT_PREV = -0.5;
const PERCENT_CURRENT = 0;
const PERCENT_NEXT = 1;

const DURATION = 200;

const calculateBounds: (
  offset: [number, number],
  boundElement: RefObject<HTMLElement | null>,
  targetElement?: RefObject<HTMLElement | null>
) => (state: State['drag']) => DragBounds =
  (offset = [0, 0], boundElement, targetElement) =>
  (state) => {
    if (!state) {
      return {};
    }
    const boundRect = (
      boundElement?.current ?? window.document.body
    ).getBoundingClientRect();
    const targetRect = (
      (targetElement?.current ?? state.currentTarget) as HTMLElement
    ).getBoundingClientRect();

    return {
      top: boundRect.top - targetRect.top + offset[1] + state.offset[1],
      right: boundRect.right - targetRect.right - offset[0] + state.offset[0],
      bottom:
        boundRect.bottom - targetRect.bottom - offset[1] + state.offset[1],
      left: boundRect.left - targetRect.left + offset[0] + state.offset[0],
    };
  };

export const Widget = ({ show }: { show: boolean }) => {
  const viewsStack = useStackStore();

  const direction = viewsStack.currentViewIndex > viewsStack.prevViewIndex;
  const springRef = useSpringRef();
  const transitions = useTransition(viewsStack.stack, {
    from: {
      x: direction ? PERCENT_NEXT : PERCENT_PREV,
    },
    enter: { x: PERCENT_CURRENT },
    update: (_item, index) =>
      viewsStack.currentViewIndex === index
        ? { x: PERCENT_CURRENT }
        : {
            x:
              viewsStack.currentViewIndex > index ? PERCENT_PREV : PERCENT_NEXT,
          },
    leave: {
      x: direction ? PERCENT_PREV : PERCENT_NEXT,
    },
    initial: null,
    config: { duration: DURATION, easings: easings.easeInOutExpo },
    ref: springRef,
  });

  const showProps = useSpring({
    opacity: show ? 1 : 0,
    scale: show ? 1 : 0.95,
    config: { duration: DURATION, easings: easings.easeInOutBack },
  });

  const [props, api] = useSpring(() => ({
    x: 50,
    y: 50,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  }));

  const bodyRef = useRef<HTMLElement>(window.document.body);
  const dataRef = useRef({
    shouldBackDrag: false,
    backDragActive: false,
    startRect: { x: 0, y: 0, width: 0, height: 0 },
  });
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const bind = useGesture(
    {
      onDrag: (state) => {
        const data = dataRef.current;
        const [x, y] = state.offset;

        if (state.first) {
          const target = state.event.target as HTMLElement;
          if (isTargetDraggable(target)) {
            state.cancel();
            return;
          }
        }

        if (springRef.current) {
          handleBackdrag(state, data, springRef.current, () => {
            viewsStack.popView();
          });

          if (data.backDragActive) return;
        }

        if (state.active) {
          api.start({
            x,
            y,
            immediate: state.down,
            config: config.stiff,
          });
        }

        if (state.active) {
          api.start({ scale: 1.05 });
          setDragging(true);
        } else {
          api.start({ scale: 1 });
          setDragging(false);
        }
      },
    },
    {
      drag: {
        bounds: (state) => {
          return !state || checkShouldBackdrag(dataRef.current, state)
            ? {}
            : calculateBounds([10, 10], bodyRef, ref)(state);
        },
        pointer: { capture: false },
        from: () => [props.x.get(), props.y.get()],
        delay: IS_TOUCH_DEVICE,
      },
    }
  );

  useEffect(() => {
    springRef.start();
  }, [springRef, viewsStack.stack]);

  return (
    <animated.div
      className="max-w-96 w-full bg-black h-96 absolute overflow-hidden rounded-xl will-change-transform select-none touch-none scrollbar-dark"
      ref={ref}
      {...bind()}
      style={{
        ...props,
        ...showProps,
        boxShadow: dragging
          ? '0 10px 20px rgba(0, 0, 0, 0.5)'
          : '0 0 0 rgba(0, 0, 0, 0.5)',
        transition: 'box-shadow 0.2s',
        visibility: show ? 'visible' : 'hidden',
        cursor: dragging ? 'grabbing' : 'grab',
      }}
    >
      <div className="flex justify-center py-2">
        <div
          className={clsx(
            'w-16 h-1 rounded-full transition-[background-color] bg-white/30',
            dragging && 'bg-white/50'
          )}
        />
      </div>

      <SharedContextProvider>
        {transitions((style, view) => {
          const viewData = viewsStack.views.get(view.id);

          if (!viewData) return null;
          return (
            <View style={style} title={viewData.title} view={view}>
              <viewData.component />
            </View>
          );
        })}
      </SharedContextProvider>
    </animated.div>
  );
};

interface BackdragData {
  shouldBackDrag: boolean;
  backDragActive: boolean;
  startRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

function handleBackdrag(
  state: FullGestureState<'drag'>,
  data: BackdragData,
  springRef: Controller<Lookup<number>>[],
  handlePop: () => void
) {
  const [x] = state.offset;

  if (state.first) {
    checkShouldBackdrag(data, state);
  }

  if (data.shouldBackDrag) {
    const width = data.startRect.width;
    const prevX = Math.min(Math.max(0, x - state.lastOffset[0]), width);
    const percentage = prevX / width;

    if (state.active) {
      if (springRef.length > 1) {
        data.backDragActive = true;

        springRef[springRef.length - 2].start({
          x: (percentage - 1) / 2,
          immediate: true,
        });

        springRef[springRef.length - 1].start({
          x: percentage,
          immediate: true,
        });
      }
    } else if (state.last && data.backDragActive) {
      data.backDragActive = false;
      state.cancel();

      if (
        percentage > 0.7 ||
        (state.velocity[0] > 0.5 && state.direction[0] > 0)
      ) {
        handlePop();
      } else {
        springRef[springRef.length - 2].start({
          x: PERCENT_PREV,
        });
        springRef[springRef.length - 1].start({
          x: PERCENT_CURRENT,
        });
      }
    }

    if (state.last) {
      data.shouldBackDrag = false;
    }
  }
}

function checkShouldBackdrag(data: BackdragData, state: CommonGestureState) {
  data.startRect = (state.currentTarget as HTMLElement).getBoundingClientRect();
  data.shouldBackDrag = state.initial[0] - data.startRect.x < 20;
  return data.shouldBackDrag;
}

function isTargetDraggable(target: HTMLElement) {
  return (
    target.closest('.js-no-drag') ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.tagName === 'BUTTON' ||
    target.tagName === 'A'
  );
}
