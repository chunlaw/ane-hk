import AneHk, { Hospital, AVAILABLE_HOSPITALS } from "ane-hk"
import { WaitMsg } from "ane-hk/dist/types"
import { format } from "date-fns"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import path from "path"

const today = new Date();
const yesterday = new Date();
const lastWeek = new Date();
yesterday.setDate(yesterday.getDate() - 1);
lastWeek.setDate(lastWeek.getDate() - 7);
const aneHk = new AneHk()

const getCalculatedWaitTime = 
  (date: Date, hospital: Hospital) => {
    return aneHk
      .getLast24HoursForParticularDate(date, hospital as Hospital)
      .then((r) =>
        Promise.all(
          r.map(([time]) =>
            aneHk
              .calculateWaitTime(new Date(time), hospital as Hospital)
              .then((v) => [time, v] as [string, WaitMsg | undefined]),
          ),
        ),
      );
  }

const setDashboardCache = async () => {
  const output = {
    calculatedWaitTime: {},
    calculatedYesterdayWaitTime: {},
    calculatedLastWeekWaitTime: {},
    lastUpdateTime: null,
  }
  await Promise.all(
    AVAILABLE_HOSPITALS.en.map((hosp) =>
      getCalculatedWaitTime(today, hosp as Hospital).then((tr) => ({
        hosp,
        res: format(
          new Date(tr.filter(([_, v]) => v !== undefined)[0][0]),
          "hh:mm a",
        ),
        _load: tr
      })),
    ),
  ).then((res) => {
    output.calculatedWaitTime = res.reduce(
        (acc, { hosp, res }) => {
          acc[hosp] = res;
          return acc;
        },
        {},
      )
    output.lastUpdateTime = res[0]._load[0][0]
  });

  await Promise.all(
    AVAILABLE_HOSPITALS.en.map((hosp) =>
      getCalculatedWaitTime(yesterday, hosp as Hospital).then((yr) => ({
        hosp,
        res: yr[0][1],
      })),
    ),
  ).then((res) => {
    output.calculatedYesterdayWaitTime = res.reduce(
        (acc, { hosp, res }) => {
          acc[hosp] = res;
          return acc;
        },
        {}
      )
  });

  await Promise.all(
    AVAILABLE_HOSPITALS.en.map((hosp) =>
      getCalculatedWaitTime(lastWeek, hosp as Hospital).then((yr) => ({
        hosp,
        res: yr[0][1],
      })),
    ),
  ).then((res) => {
    output.calculatedLastWeekWaitTime = res.reduce(
        (acc, { hosp, res }) => {
          acc[hosp] = res;
          return acc;
        },
        {}
      )
  });

  return output
}

const directory = "precompute"
if ( !existsSync(directory) ) {
  mkdirSync(directory, {recursive: true})
}

setDashboardCache()
  .then(result => {
    writeFileSync(path.join(directory, "cache.json"), 
      JSON.stringify(result)
    )
  }).then(() => {
    Promise.all(
      AVAILABLE_HOSPITALS.en.map((hospital) => {
        const today = new Date();
        const yesterday = new Date();
        const lastWeek = new Date();
        yesterday.setDate(today.getDate() - 1);
        lastWeek.setDate(today.getDate() - 7);
        Promise.all([
          getCalculatedWaitTime(today, hospital as Hospital),
          getCalculatedWaitTime(yesterday, hospital as Hospital),
          getCalculatedWaitTime(lastWeek, hospital as Hospital),
        ]).then(([tr, yr, lwr]) => {
          writeFileSync(path.join(directory, `${hospital.replace(/ /g, "_")}.json`), 
            JSON.stringify({
              calculatedWaitTimes: tr,
              calculatedYesterdayWaitTimes: yr,
              calculatedLastWeekWaitTimes: lwr,
            })
          )
        });
      })
    )
  })