import moment from "moment-timezone"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import path from "path";

const topWaitConvert = {
  "Around 1 hour": "< 1",
  "Over 1 hour": "> 1",
  "Over 2 hours": "> 2",
  "Over 3 hours": "> 3",
  "Over 4 hours": "> 4",
  "Over 5 hours": "> 5",
  "Over 6 hours": "> 6",
  "Over 7 hours": "> 7",
  "Over 8 hours": "> 8",
  "Over 9 hours": "> 9",
  "Over 10 hours": "> 10",
  "Over 11 hours": "> 11",
  "Over 12 hours": "> 12",
}

fetch("https://www.ha.org.hk/opendata/aed/aedwtdata-en.json")
  .then(r => r.json())
  .then(({updateTime, waitTime}) => {
    return ({
      updateTime,
      waitTime: waitTime.map(({topWait, ...v}) => ({
        ...v,
        topWait: topWaitConvert[topWait] ?? topWait
      }))
    })
  })
  .catch(() => 
    fetch("https://www.ha.org.hk/aedwt/data/aedWtData.json")
    .then(r => r.json())
    .then(({result: { hospData, timeEn}}) => ({
      updateTime: timeEn,
      waitTime: hospData.map(({hospNameEn, topWait}) => ({
        hospName: hospNameEn,
        topWait
      }))
    }))
  )
  .then(({updateTime, waitTime}) => {
    const logMoment = moment.tz(updateTime, "D/M/YYYY h:mma", true, "Asia/Hong_Kong").tz("Asia/Hong_Kong");
    const directory = path.join(process.cwd(), "dist", logMoment.format("YYYY"), logMoment.format("MM"), logMoment.format("DD") )
    if ( !existsSync(directory) ) {
      mkdirSync(directory, {recursive: true})
    }
    // no jekyll
    writeFileSync(path.join(process.cwd(), "dist", ".nojekyll"), "");

    waitTime.map(({hospName, topWait}) => {
      const filename = hospName.replace(/ /g, "-") + ".tsv";
      fetch(`https://raw.githubusercontent.com/chunlaw/ane-hk/data/${logMoment.format("YYYY")}/${logMoment.format("MM")}/${logMoment.format("DD")}/${filename}`).then(r => {
        if ( r.status === 404 ) return "UpdateTime\tTopWait\n"
        return r.text()
      }).then(content => {
        
        writeFileSync(
          path.join( directory,  filename ),
          content + `${logMoment.format("YYYY-MM-DD HH:mm")}\t${topWait}\n`
        );
      })
    })
  })