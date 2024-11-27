import { configureStore } from '@reduxjs/toolkit';
import selectedComponent from '../renderSlice';
import idReducer from '../Component/OutStanding/OutStandingSlice';

const rootReducer = {
  renderComponent: selectedComponent,
  idReducer:idReducer

};

const store = configureStore({
  reducer: rootReducer,
});

export default store;