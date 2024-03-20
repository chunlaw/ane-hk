import AneHk from "./AneHk";
import { WaitMsg } from "./types";

const aneHk = new AneHk();

const curDate = new Date();

aneHk
  .getLast24HoursForParticularDate(
    curDate,
    "Alice Ho Miu Ling Nethersole Hospital"
  )
  .then((r) => {
    const data = r.filter((_, idx) => idx % 4 === 0);
    return data;
  })
  .then(async (r) => {
    Promise.all(
      r.map(([time]) =>
        aneHk
          .calculateWaitTime(
            new Date(time),
            "Alice Ho Miu Ling Nethersole Hospital"
          )
          .then((v) => [time, v] as [string, WaitMsg | undefined])
      )
    ).then((res) => {
      console.log(res);
    });
  });
