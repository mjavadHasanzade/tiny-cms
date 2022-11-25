const formatNumber = (myNumber: number) => ("0" + myNumber).slice(-2);
const generateDate = (date: string, timeInclude?: boolean) => {
  try {
    let today = new Date(date);
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    if (timeInclude) {
      return (
        mm +
        "/" +
        dd +
        "/" +
        yyyy +
        " , " +
        formatNumber(today.getHours()) +
        ":" +
        formatNumber(today.getMinutes())
      );
    }

    return mm + "/" + dd + "/" + yyyy;
  } catch {
    return "invalid date";
  }
};

export default generateDate;
