import * as docCookies from 'doc-cookies';

const userInfoURL = "http://127.0.0.1:8000/api/user/";

var authorization = (comp) => {
    console.log("checking whether authentication exists");
    var authenticationField = "Token " + docCookies.getItem('token');
    console.log(authenticationField);
    
        fetch(userInfoURL, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'authorization':  authenticationField
            },
        })
            .then(res => {
                console.log('authorizing');
                console.log(res);
                if (res.ok) {
                    return (res.json());
                }
                
                throw Error(res.statusText);
            })
            .then(
                (result) => {
                    console.log("status:");
                    console.log(result);

                    let userType = result.user_info.is_student;
                    localStorage.setItem('userid', result.user.id);
                    localStorage.setItem('firstName', result.user.first_name);
                    localStorage.setItem('lastName', result.user.last_name);
                    localStorage.setItem('isStudent', userType);
                    localStorage.setItem('uid', result.user_info.uid);

                    if (userType) {
                        localStorage.setItem('user', 'student');
                        comp.props.history.push('/student/' + result.user.id);
                    }
                    else {
                        localStorage.setItem('user', 'instructor');
                        comp.props.history.push('/instructor/' + result.user.id);
                    }
                }
            )
            .catch (error => {
                
                docCookies.removeItem('token', '/');
                localStorage.clear();
                comp.props.history.push('/');
            })
}

export default authorization;