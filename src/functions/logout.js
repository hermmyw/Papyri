import * as docCookies from 'doc-cookies';

var handleLogout = (user) => {
    console.log("logging out");

    const promise = new Promise(() => {
        if (docCookies.hasItem('token')) {
            console.log("removing token");
            docCookies.removeItem('token', '/');
            localStorage.clear();
        }
    });

    promise.then(user.props.history.push('/'));
}

export default handleLogout;