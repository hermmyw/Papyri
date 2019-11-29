// set localstorage variable and go to 
var handleQuizClick = (user, qid) => {
    console.log("quizID: " + qid);
    localStorage.setItem('quizID', qid);

    // go to specific quiz view for user
    let userRole = localStorage.getItem('user');
    let userID = user.props.match.params.userid;
    let classID = user.props.match.params.classid;

    var newLink = `/${userRole}/quiz/${userID}/${classID}/${qid}`;
    console.log(newLink);
    user.props.history.push(newLink);
}

export default handleQuizClick;