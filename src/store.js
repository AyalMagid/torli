import { TreatmentReducer } from './reducers/TreatmentReducer';
import { ModalReducer } from './reducers/ModalReducers';
import { StepperReducer } from './reducers/StepperReducer';
import { CalendarReducer } from './reducers/CalendarReducer';
import { UserReducer } from './reducers/UserReducer';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    TreatmentReducer,
    CalendarReducer,
    StepperReducer,
    UserReducer,
    ModalReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));