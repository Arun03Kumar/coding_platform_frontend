import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for publishing problem
export const publishProblem = createAsyncThunk(
  "createProblem/publishProblem",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:3001/api/v1/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to publish");
      }

      const created = await res.json();
      return created;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const createProblemSlice = createSlice({
  name: "createProblem",
  initialState: {
    // UI State
    showEditor: false,
    activeTab: "description", // description | markdown | testcases | codestub
    isEditingTitle: false,
    isPublishing: false,

    // Problem Data
    title: "Title of Problem (double click to change)",
    description: "", // markdown content from BlockNote editor
    markdownText: "", // raw markdown text from textarea
    difficulty: "easy",
    testCases: [{ input: "", output: "" }],
    codeStubs: {}, // Object with language as key: { "JAVA": { startSnippet: "", endSnippet: "", userSnippet: "" }, ... }
    currentCodeStubLanguage: "JAVA", // Currently selected language for code stub editing

    // API State
    publishError: null,
    publishSuccess: false,
  },
  reducers: {
    // UI Actions
    setShowEditor: (state, action) => {
      state.showEditor = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setIsEditingTitle: (state, action) => {
      state.isEditingTitle = action.payload;
    },

    // Problem Data Actions
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setMarkdownText: (state, action) => {
      state.markdownText = action.payload;
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload;
    },
    setTestCases: (state, action) => {
      state.testCases = action.payload;
    },
    setCodeStubs: (state, action) => {
      state.codeStubs = { ...state.codeStubs, ...action.payload };
    },
    setCurrentCodeStubLanguage: (state, action) => {
      state.currentCodeStubLanguage = action.payload;
    },
    updateCodeStubForLanguage: (state, action) => {
      const { language, codeStub } = action.payload;
      state.codeStubs[language] = { ...state.codeStubs[language], ...codeStub };
    },

    // Reset Actions
    resetForm: (state) => {
      state.title = "Title of Problem (double click to change)";
      state.description = "";
      state.markdownText = "";
      state.difficulty = "easy";
      state.testCases = [{ input: "", output: "" }];
      state.codeStubs = {};
      state.currentCodeStubLanguage = "JAVA";
      state.publishSuccess = false;
      state.publishError = null;
    },
    clearPublishState: (state) => {
      state.publishError = null;
      state.publishSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishProblem.pending, (state) => {
        state.isPublishing = true;
        state.publishError = null;
        state.publishSuccess = false;
      })
      .addCase(publishProblem.fulfilled, (state, action) => {
        state.isPublishing = false;
        state.publishSuccess = true;
        // Optionally reset form on success
        // state.title = 'Title of Problem (double click to change)';
        // state.description = '';
        // etc...
      })
      .addCase(publishProblem.rejected, (state, action) => {
        state.isPublishing = false;
        state.publishError = action.payload;
      });
  },
});

export const {
  setShowEditor,
  setActiveTab,
  setIsEditingTitle,
  setTitle,
  setDescription,
  setMarkdownText,
  setDifficulty,
  setTestCases,
  setCodeStubs,
  setCurrentCodeStubLanguage,
  updateCodeStubForLanguage,
  resetForm,
  clearPublishState,
} = createProblemSlice.actions;

export default createProblemSlice.reducer;
