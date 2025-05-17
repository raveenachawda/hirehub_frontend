import { createSlice } from "@reduxjs/toolkit";





const companySlice = createSlice({
    name:"company",
    initialState:{
        singleCompany:null,
        companies:[],
        joinedCompanies:[],
        searchCompanyByText:"",
    },
    reducers:{
        // actions
        setSingleCompany:(state,action) => {
            state.singleCompany = action.payload;
        },
        setCompanies:(state,action) => {
            state.companies = action.payload;
        },
        setJoinedCompanies:(state,action) => {
            state.joinedCompanies = action.payload;
        },
        setSearchCompanyByText:(state,action) => {
            state.searchCompanyByText = action.payload;
        },
        
    }
});
export const {setSingleCompany,setCompanies,setJoinedCompanies,setSearchCompanyByText} = companySlice.actions;
export default companySlice.reducer;