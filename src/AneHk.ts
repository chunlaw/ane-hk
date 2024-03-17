export default class AneHk {
  private cache: Record<string, Partial<Record<DayTimePoint, number>>>
  private lang: "en" | "zh"

  constructor ({lang = "zh"}: {lang?: "en" | "zh"} = {}) {
    this.cache = {}
    this.lang = lang
  }

  getWaitingTime(year: number | string, month: number | string, day: number | string, hospital: Hospital ): Promise<Partial<Record<DayTimePoint, string>>> {
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

    if ( this.cache[key] ) {
      return Promise.resolve(
        parseRet(this.cache[key])
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
          this.cache[key] = ret
          return parseRet(ret)
        })
        .catch(e => {
          console.log(e)
          this.cache[key] = {}
          return {}
        })
    )

  }
}

export type DayTimePoint = 
| "00:00" | "00:15" | "00:30" | "00:45"
| "01:00" | "01:15" | "01:30" | "01:45"
| "02:00" | "02:15" | "02:30" | "02:45"
| "03:00" | "03:15" | "03:30" | "03:45"
| "04:00" | "04:15" | "04:30" | "04:45"
| "05:00" | "05:15" | "05:30" | "05:45"
| "06:00" | "06:15" | "06:30" | "06:45"
| "07:00" | "07:15" | "07:30" | "07:45"
| "08:00" | "08:15" | "08:30" | "08:45"
| "09:00" | "09:15" | "09:30" | "09:45"
| "10:00" | "10:15" | "10:30" | "10:45"
| "11:00" | "11:15" | "11:30" | "11:45"
| "12:00" | "12:15" | "12:30" | "12:45"
| "13:00" | "13:15" | "13:30" | "13:45"
| "14:00" | "14:15" | "14:30" | "14:45"
| "15:00" | "15:15" | "15:30" | "15:45"
| "16:00" | "16:15" | "16:30" | "16:45"
| "17:00" | "17:15" | "17:30" | "17:45"
| "18:00" | "18:15" | "18:30" | "18:45"
| "19:00" | "19:15" | "19:30" | "19:45"
| "20:00" | "20:15" | "20:30" | "20:45"
| "21:00" | "21:15" | "21:30" | "21:45"
| "22:00" | "22:15" | "22:30" | "22:45"
| "23:00" | "23:15" | "23:30" | "23:45"

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

export type Hospital = 
  | "Alice Ho Miu Ling Nethersole Hospital"
  | "Caritas Medical Centre"
  | "Kwong Wah Hospital"
  | "North District Hospital"
  | "North Lantau Hospital"
  | "Princess Margaret Hospital"
  | "Pok Oi Hospital"
  | "Prince of Wales Hospital"
  | "Pamela Youde Nethersole Eastern Hospital"
  | "Queen Elizabeth Hospital"
  | "Queen Mary Hospital"
  | "Ruttonjee Hospital"
  | "St John Hospital"
  | "Tseung Kwan O Hospital"
  | "Tuen Mun Hospital"
  | "Tin Shui Wai Hospital"
  | "United Christian Hospital"
  | "Yan Chai Hospital"
