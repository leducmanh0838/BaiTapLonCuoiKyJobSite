import cookie from 'react-cookies'

export default (current, action) => {
    switch (action.type) {
        case "login":
            console.info(JSON.stringify("action.payload: ", action.payload))
            cookie.save('token', action.payload.token);
            cookie.save('current-user', action.payload.current_user);
            return action.payload.current_user;
        case "logout":
            cookie.remove('token');
            cookie.remove('current-user');
            return null;
    }
    return current;
}