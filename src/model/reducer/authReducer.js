import { ActionTypes } from "../action-type";


const initialState = {
    status : "loading", //fulfill
    user : null,
}

export const authReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_CURRENT_USER:
            return {
                status : "fulfill",
                user: payload,
            }
        case ActionTypes.LOGOUT_AUTH:
            return {
                status:"loading",
                user:null,
            }
        case ActionTypes.SET_WHOLESALE_STORE_FLAG:
            return {
                ...state,
                user: {
                    ...state.user,
                    hasRegisteredWholesaleStore: payload
                }
            }
        
        default:
            return state;
    }
}