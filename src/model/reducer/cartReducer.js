import { ActionTypes } from "../action-type";

const initialState = {
	status: "loading", //fulfill
	cart: null,
	checkout: null,
};

export const cartReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case ActionTypes.SET_CART:
			return {
				...state,
				status: "fulfill",
				cart: payload,
			};
		case ActionTypes.SET_CART_CHECKOUT:
			return {
				...state,
				status: "fulfill",
				checkout: {
					...payload,
					taxes: payload.sub_total * 0.05,
					total_amount: payload.total_amount + payload.sub_total * 0.05,
				},
			};
		default:
			return state;
	}
};
