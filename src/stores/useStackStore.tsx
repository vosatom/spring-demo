import { create } from 'zustand';

interface ViewDefinition {
  title: string;
  component: React.FC;
}

export interface StackStore {
  prevViewIndex: number;
  currentViewIndex: number;
  stack: { id: string; previousId?: string }[];
  views: Map<string, ViewDefinition>;

  pushView: (id: string) => void;
  popView: () => void;
  getView: (id: string | undefined) => ViewDefinition | undefined;
}

export const useStackStore = create<StackStore>((set, get) => {
  const getStack = (state: StackStore, stack: StackStore['stack']) => ({
    stack,
    currentViewIndex: stack.length - 1,
    prevViewIndex: state.currentViewIndex,
  });

  return {
    prevViewIndex: -1,
    currentViewIndex: 0,
    stack: [{ id: 'home' }],
    views: new Map(),

    pushView: (id) =>
      set((state) =>
        getStack(state, [
          ...state.stack,
          { id, previousId: state.stack[state.stack.length - 1]?.id },
        ])
      ),
    popView: () =>
      set((state) => {
        return state.stack.length === 1
          ? state
          : getStack(state, state.stack.slice(0, -1));
      }),

    getView: (id) => {
      if (!id) return undefined;
      return get().views.get(id);
    },
  };
});
