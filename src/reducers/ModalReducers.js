const INITIAL_STATE = {
    isModalOpen:false
}

export function ModalReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'UPDATE_IS_MODAL_OPEN':
            return {
                ...state,
                isModalOpen: action.isModalOpen
            }
        default:
            return state;
    }
}
