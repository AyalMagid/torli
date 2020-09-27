import TreatmentService from '../services/TreatmentService';


export function loadTreatments() {
  
  return async dispatch => {
    try {
      const treatments = await TreatmentService.getTreatments();
      dispatch(setTreatments(treatments));
   
    } catch (err) {
      console.log('TreatmentActions: err in loadTreatments', err);
    };
  }
}

export function setTreatments(treatments) {
  return {
    type: 'SET_TREATMENTS',
    treatments
  };
}

export function setTreatment(treatment) {
  return async dispatch => {
    try {
      await 
      dispatch((_setTreatment(treatment)));
    } catch (err) {
      console.log('TreatmentActions: err in setTreatment', err);
    }
  };
}

export function _setTreatment(treatment) {
  return {
    type: 'SET_TREATMENT',
    treatment
  };
}

export function removeTreatment(treatmentId) {
  return async dispatch => {
    try {
      await TreatmentService.remove(treatmentId);
      dispatch(_removeTreatment(treatmentId));
    } catch (err) {
      console.log('TreatmentActions: err in removeTreatment', err);
    }
  };
}

function _removeTreatment(treatmentId) {
  return {
    type: 'REMOVE_TREATMENT',
    treatmentId
  };
}

export function updateTreatments(treatments) {
  console.log(treatments)
  return async dispatch => {
    try {
      await 
      dispatch(_updateTreatments(treatments));
    } catch (err) {
      console.log('TreatmentActions: err in updateTreatments', err);
    }
  };
}

export function _updateTreatments(treatments) {
  return {
    type: 'UPDATE_TREATMENTS',
    treatments
  };
}



export function updateDuration(duration) {
  return async dispatch => {
    try {
      await 
      dispatch(_updateDuration(duration));
    } catch (err) {
      console.log('TreatmentActions: err in addDuration', err);
    }
  };
}

export function _updateDuration(duration) {
    return {
      type: 'UPDATE_DURATION',
      duration
    };
}

export function initDuration() {
  return async dispatch => {
    try {
      await 
      dispatch(_initDuration());
    } catch (err) {
      console.log('ERR WITH initDuration', err);
    }
  };
}

function _initDuration() {
  return {
    type: 'INIT_DURATION'
  };
}
