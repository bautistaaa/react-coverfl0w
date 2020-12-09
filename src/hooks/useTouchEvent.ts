import { useCallback, useEffect, useReducer, useState } from 'react';
const TOUCH_START = 'touchStart';
const TOUCH_MOVE = 'touchMove';
const TOUCH_END = 'touchEnd';

interface State {
  start: number;
  end: number;
  isLeft: boolean;
  isRight: boolean;
  isMoving: boolean;
}

type Action =
  | { type: typeof TOUCH_END }
  | { type: typeof TOUCH_START; payload: number }
  | { type: typeof TOUCH_MOVE; payload: number };

const initialState = {
  start: 0,
  end: 0,
  isLeft: false,
  isRight: false,
  isMoving: false,
};
function reducer(state: State, action: Action) {
  switch (action.type) {
    case TOUCH_START:
      return {
        ...state,
        start: action.payload,
        isMoving: false,
      };
    case TOUCH_MOVE:
      if (state.start - action.payload > 70) {
        return {
          ...state,
          isRight: true,
          isLeft: false,
          isMoving: true,
          end: action.payload,
        };
      }
      if (state.start - action.payload < -70) {
        return {
          ...state,
          isRight: false,
          isLeft: true,
          isMoving: true,
          end: action.payload,
        };
      }
      return {
        ...state,
        isMoving: true,
        end: action.payload,
      };
    case TOUCH_END:
      return {
        ...state,
        isRight: false,
        isLeft: false,
        isMoving: false,
      };
    default:
      throw new Error();
  }
}

function useTouchEvent(): [(node: HTMLElement) => void, State] {
  const [el, setEl] = useState<HTMLElement | null>(null);
  // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const ref = useCallback((node: HTMLElement) => {
    if (node !== null) {
      setEl(node);
    }
  }, []);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (el !== null) {
      const handleTouchStart = (e: TouchEvent) => {
        dispatch({ type: TOUCH_START, payload: e.targetTouches[0].clientX });
      };
      const handleTouchMove = (e: TouchEvent) => {
        dispatch({ type: TOUCH_MOVE, payload: e.targetTouches[0].clientX });
      };
      const handleTouchEnd = () => {
        dispatch({ type: TOUCH_END });
      };

      // Add event listener
      el.addEventListener('touchstart', handleTouchStart, { passive: false });
      el.addEventListener('touchmove', handleTouchMove, { passive: false });
      el.addEventListener('touchend', handleTouchEnd, { passive: false });

      // Remove event listener on cleanup
      return () => {
        el.addEventListener('touchstart', handleTouchStart);
        el.addEventListener('touchmove', handleTouchMove);
        el.addEventListener('touchend', handleTouchEnd);
      };
    }
    return null;
  }, [el]);

  return [ref, state];
}

export default useTouchEvent;
