import moment from "moment-timezone"
import { mkdirSync, writeFileSync } from "fs"
import path from "path";

fetch("https://www.ha.org.hk/opendata/aed/aedwtdata-en.json")
  .then(r => r.json())
  .then(({updateTime, waitTime}) => {
    const logMoment = moment.tz(updateTime, "D/M/YYYY hh:mma", true, "Asia/Hong_Kong").tz("Asia/Hong_Kong");
    mkdirSync(path.join(process.cwd(), "dist", logMoment.format("kkmm")), {recursive: true})
    waitTime.forEach(({hospName, topWait}) => {
      writeFileSync(
        path.join(
          process.cwd(), 
          "dist", 
          logMoment.format("kkmm"),
          `${hospName.replace(/ /g, "-")}.json`
        ),
        JSON.stringify(topWait)
      );
    });
  })