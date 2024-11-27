import { createSlice } from '@reduxjs/toolkit';

export const dashboardSlice = createSlice({
  name: 'rendercomponet',
  initialState: {
    selectedComponent: { component: 'Dashboard'},
    propsdata : {props : ''},
  },
  reducers: {
    setSelectedComponent: (state, action) => {
      console.log(action, "-nb")
      if (action.payload.menu_pk === 1){
        state.selectedComponent  = { component: 'Dashboard'}
        state.propsdata = {props: action.payload.menu_pk}
      }  
        if (action.payload.menu_pk === 2){
          state.selectedComponent  = { component: 'User'}
          state.propsdata = {props: action.payload.menu_pk}
        }    
        if (action.payload.menu_pk === 9){
          state.selectedComponent  = { component: 'StockReport'}
          state.propsdata = {props: action.payload.menu_pk}
        } 
        if (action.payload.menu_pk === 10){
          state.selectedComponent  = { component: 'NavOutStanding'}
          state.propsdata = {props: action.payload.menu_pk}
        }
        if (action.payload.menu_pk === 5){
          state.selectedComponent  = { component: 'SalesAnalysis'}
          state.propsdata = {props: action.payload.menu_pk}
        } 
        if (action.payload.menu_pk === 11){
          state.selectedComponent  = { component: 'Frame'}
          state.propsdata = {props: action.payload.menu_pk}
        } 
        if (action.payload.menu_pk === 12){
          state.selectedComponent  = { component: 'CustomerPo'}
          state.propsdata = {props: action.payload.menu_pk}
        }
        if (action.payload.menu_pk === 13){
          state.selectedComponent  = { component: 'OrderEntry'}
          state.propsdata = {props: action.payload.menu_pk}
        }
        if (action.payload.menu_pk === 15){
          state.selectedComponent  = { component: 'PartyOutstanding'}
          state.propsdata = {props: action.payload.menu_pk}
        }
        if (action.payload.menu_pk === 16){
          state.selectedComponent  = { component: 'PendingOrder'}
          state.propsdata = {props: action.payload.menu_pk}
        }
        if (action.payload.menu_pk === 18){
          state.selectedComponent  = { component: 'LuckyWeavesPendingOrder'}
          state.propsdata = {props: action.payload.menu_pk}
        }
        if (action.payload.menu_pk === 19){
          state.selectedComponent  = { component: 'FrameLuckyWeaves'}
          state.propsdata = {props: action.payload.menu_pk}
        }
    },
  },
});

export const { setSelectedComponent } = dashboardSlice.actions;

export const selectSelectedComponent = state => state.dashboard.selectedComponent;

export default dashboardSlice.reducer;
