var convertDate = (isoShortDate) => {
    var newDate = new Date(isoShortDate);
    var dd = newDate.getDate();
    var mm = newDate.getMonth() + 1; //January is 0!

    var yyyy = newDate.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    } 
    if (mm < 10) {
        mm = '0' + mm;
    }

    return(mm + '/' + dd + '/' + yyyy);
}

export default convertDate;