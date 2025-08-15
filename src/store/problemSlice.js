import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api/v1";

// Async thunk for fetching problem data
export const fetchProblem = createAsyncThunk(
  "problem/fetchProblem",
  async ({ id, language }) => {
    const res = await fetch(`${API_BASE}/problems/${id}`);
    if (!res.ok) throw new Error("Failed to load problem");
    const data = await res.json();
    const problemData = data?.data || data?.problem || data;

    // Find code stub for current language
    const stub = problemData.codeStubs?.find((s) => s.language === language);
    const userCode = stub?.userSnippet || "";

    return { ...problemData, userCode };
  }
);

const problemSlice = createSlice({
  name: "problem",
  initialState: {
    data: null,
    loading: true,
    error: null,
    userCode: "",
    language: "JAVA",
  },
  reducers: {
    setUserCode: (state, action) => {
      state.userCode = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      // Update user code based on new language
      if (state.data?.codeStubs) {
        const stub = state.data.codeStubs.find(
          (s) => s.language === action.payload
        );
        if (stub?.userSnippet) {
          state.userCode = stub.userSnippet;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.userCode = action.payload.userCode;
      })
      .addCase(fetchProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setUserCode, setLanguage } = problemSlice.actions;
export default problemSlice.reducer;
