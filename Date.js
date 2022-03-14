function getDate() {
    //   fetching date
    let dateTodayinWord = new Date();
    //   date formatting
    let optionDate = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };

    let day = dateTodayinWord.toLocaleDateString("en-IN", optionDate);
    return day;
}

module.exports = getDate;