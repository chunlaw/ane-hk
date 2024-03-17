import { POSSIBLE_WAIT_MSG } from "./constants"
import { DayTimePoint, Hospital, WaitMsg } from "./types"

export default class AneHk {
  private cache: Record<Hospital, Record<string, Partial<Record<DayTimePoint, number>>>>

  constructor () {
    this.cache = {
      "Alice Ho Miu Ling Nethersole Hospital": {},
      "Caritas Medical Centre": {},
      "Kwong Wah Hospital": {},
      "North District Hospital": {},
      "North Lantau Hospital": {},
      "Princess Margaret Hospital": {},
      "Pok Oi Hospital": {},
      "Prince of Wales Hospital": {},
      "Pamela Youde Nethersole Eastern Hospital": {},
      "Queen Elizabeth Hospital": {},
      "Queen Mary Hospital": {},
      "Ruttonjee Hospital": {},
      "St John Hospital": {},
      "Tseung Kwan O Hospital": {},
      "Tuen Mun Hospital": {},
      "Tin Shui Wai Hospital": {},
      "United Christian Hospital": {},
      "Yan Chai Hospital": {},
    }
  }

  getWaitingTime(year: number | string, month: number | string, day: number | string, hospital: Hospital ): Promise<Partial<Record<DayTimePoint, string>>> {
    const hospitalKey = hospital;
    month = String(month).padStart(2, '0')
    day = String(day).padStart(2, '0')
    const key = `${year}${month}${day}`

    const parseRet = (obj: Partial<Record<DayTimePoint, number>>) => (
      Object.entries(obj)
        .reduce((acc, [time, v]) => {
          acc[time as DayTimePoint] = v !== -1 ? POSSIBLE_WAIT_MSG[v] : ""
          return acc
        }, {} as Partial<Record<DayTimePoint, WaitMsg>>)
    )

    if ( this.cache[hospitalKey][key] && this.cache[hospital][key]["23:45"] ) {
      return Promise.resolve(
        parseRet(this.cache[hospitalKey][key])
      )
    }
    return (
      fetch(`https://raw.githubusercontent.com/chunlaw/ane-hk/data/${year}/${month}/${day}/${hospital.replace(/ /g, "-")}.tsv`)
        .then(r => {
          if ( r.status !== 200 ) {
            throw "not found"
          }
          return r.text()
        })
        .then(txt => {
          const ret = txt.split("\n").slice(1).reduce((acc, entry) => {
            const [time, msg] = entry.split("\t");
            if ( time ) acc[time.slice(-5) as DayTimePoint] = POSSIBLE_WAIT_MSG.indexOf(msg as WaitMsg)
            return acc
          }, {} as Partial<Record<DayTimePoint, number>>)
          this.cache[hospitalKey][key] = ret
          return parseRet(ret)
        })
        .catch(e => {
          this.cache[hospitalKey][key] = {}
          return {}
        })
    )
  }

  getLast24Hours( hospital: Hospital ): Promise<Array<[DayTimePoint, string]>> {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate()-1)
    console.log(today.getDate(), yesterday.getDate())
    return Promise.all([
      this.getWaitingTime(today.getFullYear(), today.getMonth()+1, today.getDate(), hospital),
      this.getWaitingTime(yesterday.getFullYear(), yesterday.getMonth()+1, yesterday.getDate(), hospital)
    ]).then(([todayTw, yesterdayTw]) => {
      return [...Object.entries(yesterdayTw), ...Object.entries(todayTw)].slice(-96) as Array<[DayTimePoint, string]>
    })
  }
}