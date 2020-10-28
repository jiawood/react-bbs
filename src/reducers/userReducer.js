const initState = {
  isLogined: false,
  loginedUser: {

  }
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case "set-isLogined":
      return {
        ...state,
        isLogined: action.payload
      }
    case "set-loginedUser":
      return {
        ...state,
        loginedUser: action.payload
      }
    default:
      return state;
  }
};

export default userReducer;
