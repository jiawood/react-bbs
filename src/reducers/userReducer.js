const initState = {
  isLogined: false,
  loginedUser: {
    name:'xiaiJne'
  }
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case "":
      return;
    default:
      return state;
  }
};

export default userReducer;
