import { create, devtools } from '@shared/lib/store'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => {
        set((state) => ({ count: state.count + 1 }), false, 'counter/increment')
      },
      decrement: () => {
        set((state) => ({ count: state.count - 1 }), false, 'counter/decrement')
      },
      reset: () => {
        set({ count: 0 }, false, 'counter/reset')
      },
    }),
    { name: 'CounterStore' },
  ),
)
