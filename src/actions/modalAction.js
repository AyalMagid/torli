export function updateIsModalOpen(isModalOpen) {
    return async dispatch => {
      try {
        dispatch(_updateIsModalOpen(isModalOpen));
      } catch (err) {
        console.log('modalAction: err in updateIsModalOpen', err);
      };
    }
  }
  
  export function _updateIsModalOpen(isModalOpen) {
    return {
      type: 'UPDATE_IS_MODAL_OPEN',
      isModalOpen
    };
  }