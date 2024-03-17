import { HOSPITAL_MAP } from "./constants"
import { DayTimePoint, Hospital, HospitalZh } from "./types"

export default class AneHk {
  private cache: Record<Hospital, Record<string, Partial<Record<DayTimePoint, number>>>>
  private lang: "en" | "zh"

  constructor ({lang = "zh"}: {lang?: "en" | "zh"} = {}) {
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
    this.lang = lang
  }

  getWaitingTime(year: number | string, month: number | string, day: number | string, hospital: Hospital | HospitalZh ): Promise<Partial<Record<DayTimePoint, string>>> {
    const hospitalKey = HOSPITAL_MAP[hospital] ?? hospital as Hospital;
    month = String(month).padStart(2, '0')
    day = String(day).padStart(2, '0')
    const key = `${year}${month}${day}`

    const parseRet = (obj: Partial<Record<DayTimePoint, number>>) => (
      Object.entries(obj)
        .reduce((acc, [time, v]) => {
          acc[time as DayTimePoint] = POSSIBLE_WAIT_MSG[this.lang][v]
          return acc
        }, {} as Partial<Record<DayTimePoint, string>>)
    )

    if ( this.cache[hospitalKey][key] ) {
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
            if ( time ) acc[time.slice(-5) as DayTimePoint] = POSSIBLE_WAIT_MSG.en.indexOf(msg)
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
}

const POSSIBLE_WAIT_MSG = {
  zh: [
    "大約 1 小時",
    "超過 1 小時",
    "超過 2 小時",
    "超過 3 小時",
    "超過 4 小時",
    "超過 5 小時",
    "超過 6 小時",
    "超過 7 小時",
    "超過 8 小時",
    "超過 9 小時",
    "超過 10 小時",
    "超過 11 小時",
    "超過 12 小時",
    "超過 13 小時",
    "超過 14 小時",
  ],
  en: [
    "Around 1 hour",
    "Over 1 hour",
    "Over 2 hours",
    "Over 3 hours",
    "Over 4 hours",
    "Over 5 hours",
    "Over 6 hours",
    "Over 7 hours",
    "Over 8 hours",
    // prepare below for bufferring
    "Over 9 hours",
    "Over 10 hours",
    "Over 11 hours",
    "Over 12 hours",
    "Over 13 hours",
    "Over 14 hours",
  ]
}