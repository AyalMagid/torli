const INITIAL_STATE = {
    treatment: null,
    treatments: null,
    duration:0,
    pickedTreatmentsCount:0
}

export function TreatmentReducer(state = INITIAL_STATE, action) {

    switch (action.type) {

        case 'SET_TREATMENTS':
            return {
                ...state,
                treatments: action.treatments
            }            
        case 'SET_TREATMENT':
            return {
                ...state,
                treatment: action.treatment
            }    
        case 'REMOVE_TREATMENT':
        return {
          ...state,
          treatments: state.treatments.filter(treatment => treatment._id !== action.treatmentId)
        };     
        case 'UPDATE_TREATMENTS':
          console.log('re',action.treatments)
        return {
          ...state,
          treatments:action.treatments 
        };   
        
        case 'UPDATE_PICKED_TREATMENTS_COUNT' :
        return {
          ...state,
          pickedTreatmentsCount: state.pickedTreatmentsCount+(action.count)
        };              
        case 'UPDATE_DURATION':
        return {
          ...state,
          duration: state.duration+(action.duration)
        };              
        case 'INIT_DURATION':
        return {
          ...state,
          duration:0
        };           
      
        default:
            return state;
    }
}

