import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name:"job",
    initialState:{
        allJobs:[],
        allAdminJobs:[],
        singleJob:null, 
        searchJobByText:"",
        allAppliedJobs:[],
        searchedQuery:"",
        savedJobs: [],
    },
    reducers:{
        // actions
        setAllJobs:(state,action) => {
            state.allJobs = action.payload;
        },
        setSingleJob:(state,action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs:(state,action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText:(state,action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs:(state,action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery:(state,action) => {
            state.searchedQuery = action.payload;
        },
        saveJob: (state, action) => {
            // Ensure savedJobs exists and is an array
            if (!Array.isArray(state.savedJobs)) {
                state.savedJobs = [];
            }
            
            // Check if job exists and has _id
            if (!action.payload?._id) {
                console.error('Invalid job payload:', action.payload);
                return;
            }

            // Check if job is already saved
            const isAlreadySaved = state.savedJobs.some(
                job => job._id === action.payload._id
            );
            
            if (!isAlreadySaved) {
                state.savedJobs.push(action.payload);
            }
        },
        removeSavedJob: (state, action) => {
            state.savedJobs = state.savedJobs.filter(
                job => job._id !== action.payload
            );
        },
        setSavedJobs: (state, action) => {
            state.savedJobs = action.payload;
        }
    }
});
    
    
export const {  
    setAllJobs,
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    setSearchedQuery,
    setSavedJobs,
    saveJob,          // Export new actions
    removeSavedJob,
} = jobSlice.actions;
export default jobSlice.reducer;