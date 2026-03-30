import { createSlice } from "@reduxjs/toolkit";

interface FeedState {
  refreshTrigger: number;
}

const initialState: FeedState = {
  refreshTrigger: 0,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    triggerFeedRefresh: (state) => {
      state.refreshTrigger += 1;
    },
  },
});

export const { triggerFeedRefresh } = feedSlice.actions;
export default feedSlice.reducer;
