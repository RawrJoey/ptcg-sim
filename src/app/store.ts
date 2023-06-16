import gameSlice from '@/features/game/gameSlice';
import interfaceSlice from '@/features/interface/interfaceSlice';
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    game: gameSlice,
    interface: interfaceSlice
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;