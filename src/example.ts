import AneHk from "./AneHk";

const aneHk = new AneHk();

const curDate = new Date();
curDate.setHours(curDate.getHours() - 96);

aneHk
  .calculateWaitTime(new Date(), "Alice Ho Miu Ling Nethersole Hospital")
  .then((v) => {
    console.log(v);
  });
