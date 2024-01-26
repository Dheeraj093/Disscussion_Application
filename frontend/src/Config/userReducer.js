// userReducer.js
const initialState = {
  user: null,
  isAuthenticated: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export const setUser = (user) => ({
  type: 'SET_USER',
  payload: user,
});

export const logout = () => ({
  type: 'LOGOUT',
});

export default userReducer;
