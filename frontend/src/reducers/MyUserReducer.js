import cookie from 'react-cookies'

export default (current, action) => {
    switch (action.type) {
        case "login":
            cookie.save('token', action.payload.token);
            cookie.save('current-user', action.payload.current_user);
            return action.payload.current_user;
        case "logout":
            cookie.remove('token');
            cookie.remove('current-use');
            return null;
    }
    return current;
}