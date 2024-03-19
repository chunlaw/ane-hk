import AneHk from "./AneHk";

const aneHk = new AneHk();

const curDate = new Date();
curDate.setMinutes(curDate.getMinutes() - 10);

aneHk
  .getWaitingTime(curDate, "Tseung Kwan O Hospital")
  .then((v) => console.log(v));
