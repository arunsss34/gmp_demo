import { createSlice } from '@reduxjs/toolkit';

export const idSlice = createSlice({
  name: 'id',
  initialState: { agent_id: 0, party_id: 0,company:'',company_id:0 },
  reducers: {
    setId: (state, action) => {
      const { agent_id, party_id,company,company_id} = action.payload;
      state.agent_id = agent_id;
      state.party_id = party_id;
      state.company = company;
      state.company_id=company_id;
    },
  },
});

export const { setId } = idSlice.actions;

export default idSlice.reducer;
