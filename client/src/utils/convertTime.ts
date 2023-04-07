export const convertTime = (isoDate : Date) => {
    // var dateObj = new Date(isoDate);
    // var year = dateObj.getUTCFullYear();
    // var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2);
    // var day = ("0" + dateObj.getUTCDate()).slice(-2);
    // var hours = ("0" + dateObj.getUTCHours()).slice(-2);
    // var minutes = ("0" + dateObj.getUTCMinutes()).slice(-2);
    // var seconds = ("0" + dateObj.getUTCSeconds()).slice(-2);
    // var newIsoDate =
    //     year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    // return newIsoDate;

    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate
}
