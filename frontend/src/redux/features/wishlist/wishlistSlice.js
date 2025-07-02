import { createSlice } from '@reduxjs/toolkit';

// Get wishlist items from localStorage
const getWishlistItemsFromStorage = () => {
    const wishlistItems = localStorage.getItem('wishlistItems');
    return wishlistItems ? JSON.parse(wishlistItems) : [];
};

const initialState = {
    items: getWishlistItemsFromStorage(),
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action) => {
            const existingItem = state.items.find(item => item._id === action.payload._id);
            if (!existingItem) {
                state.items.push(action.payload);
                // Save to localStorage
                localStorage.setItem('wishlistItems', JSON.stringify(state.items));
            }
        },
        removeFromWishlist: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload._id);
            // Update localStorage
            localStorage.setItem('wishlistItems', JSON.stringify(state.items));
        },
    }
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;