import moment from "moment-timezone"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import path from "path";
import _fetchRetry from "fetch-retry"

const fetchRetry = _fetchRetry(fetch)

fetchRetry("https://www.ha.org.hk/opendata/aed/aedwtdata-en.json", {
  retries: 3,
  retryDelay: 10000,
})
  .then(r => r.json())
  .then(async ({updateTime, waitTime}) => {
    const logMoment = moment.tz(updateTime, "D/M/YYYY h:mma", true, "Asia/Hong_Kong").tz("Asia/Hong_Kong");
    const directory = path.join(process.cwd(), "dist", logMoment.format("YYYY"), logMoment.format("MM"), logMoment.format("DD") )
    if ( !existsSync(directory) ) {
      mkdirSync(directory, {recursive: true})
    }
    // no jekyll
    writeFileSync(path.join(process.cwd(), "dist", ".nojekyll"), "");

    waitTime.map(({hospName, topWait}) => {
      const filename = hospName.replace(/ /g, "-") + ".tsv";
      fetchRetry(`https://raw.githubusercontent.com/chunlaw/ane-hk/data/${logMoment.format("YYYY")}/${logMoment.format("MM")}/${logMoment.format("DD")}/${filename}`).then(r => {
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