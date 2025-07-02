import { createSlice } from "@reduxjs/toolkit";

// Get cart items from localStorage
const getCartItemsFromStorage = () => {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
};

const initialState = {
    cartItems: getCartItemsFromStorage(),
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers:{
        addToCart: (state, action) => {
            const existingItem = state.cartItems.find(item => item._id === action.payload._id);
            if(!existingItem) {
                state.cartItems.push({ ...action.payload, quantity: 1 });
            } else {
                existingItem.quantity += 1;
            }
            // Save to localStorage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems =  state.cartItems.filter(item => item._id !== action.payload._id);
            // Update localStorage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            // Clear localStorage
            localStorage.removeItem('cartItems');
        },
        incrementQuantity: (state, action) => {
            const item = state.cartItems.find(item => item._id === action.payload);
            if (item) {
                item.quantity += 1;
                // Update localStorage
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            }
        },
        decrementQuantity: (state, action) => {
            const item = state.cartItems.find(item => item._id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                // Update localStorage
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            } else if (item && item.quantity === 1) {
                state.cartItems = state.cartItems.filter(i => i._id !== action.payload);
                // Update localStorage
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            }
        }
    }
})

// export the actions   
export const {
  addToCart,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;