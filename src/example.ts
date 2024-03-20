import AneHk from "./AneHk";

const aneHk = new AneHk();

const curDate = new Date();

aneHk.getWaitingTime(curDate, "Prince of Wales Hospital").then(() => {
  curDate.setMinutes(curDate.getMinutes() - 30);
  aneHk.calculateWaitTime(curDate, "Prince of Wales Hospital").then((v) => {
    console.log(v);
  });
});
