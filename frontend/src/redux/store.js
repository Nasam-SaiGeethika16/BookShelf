import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import { api } from './api';
import wishlistReducer from './features/wishlist/wishlistSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [api.reducerPath]: api.reducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});