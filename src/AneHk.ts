import { POSSIBLE_WAIT_MSG } from "./constants";
import { DayTimePoint, Hospital, WaitMsg } from "./types";

export default class AneHk {
  cache: Record<
    Hospital,
    Record<string, Partial<Record<DayTimePoint, WaitMsg | undefined>>>
  >;

  constructor() {
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
    };
  }

  getWaitingTime(
    targetDate: Date,
    hospital: Hospital
  ): Promise<Partial<Record<string, WaitMsg | undefined>>> {
    const _targetDate = new Date(targetDate);
    const hospitalKey = hospital;
    if (_targetDate.getMinutes() <= 15) {
      _targetDate.setMinutes(0);
    } else if (targetDate.getMinutes() <= 30) {
      _targetDate.setMinutes(15);
    } else if (targetDate.getMinutes() <= 45) {
      _targetDate.setMinutes(30);
    } else if (targetDate.getMinutes() <= 59) {
      _targetDate.setMinutes(45);
    }

    const year = _targetDate.getFullYear();
    const month = String(_targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(_targetDate.getDate()).padStart(2, "0");
    const hour = String(_targetDate.getHours()).padStart(2, "0");
    const minute = String(_targetDate.getMinutes()).padStart(2, "0");
    const key = `${_targetDate.getFullYear()}${month}${day}`;

    if (_targetDate > new Date()) {
      return Promise.resolve({
        [`${year}-${month}-${day} ${hour}:${minute}`]: undefined,
      });
    }

    const parseRet = (
      obj: Partial<Record<DayTimePoint, WaitMsg | undefined>>
    ) => ({
      [`${year}-${month}-${day} ${hour}:${minute}`]: Object.entries(obj)
        .filter(([time, v]) => {
          if (time !== `${hour}:${minute}`) return false;
          return true;
        })
        .map(([_, msg]) => msg)[0],
    });

    if (
      this.cache[hospitalKey][key] &&
      (!isToday(targetDate) ||
        `${hour}:${minute}` <=
          Object.keys(this.cache[hospitalKey][key]).slice(-1)[0])
    ) {
      return Promise.resolve(parseRet(this.cache[hospitalKey][key]));
    }

    return fetch(
      `https://raw.githubusercontent.com/chunlaw/ane-hk/data/${year}/${month}/${day}/${hospital.replace(/ /g, "-")}.tsv`
    )
      .then((r) => {
        if (r.status !== 200) {
          throw "not found";
        }
        return r.text();
      })
      .then((txt) => {
        const ret = txt
          .split("\n")
          .slice(1)
          .reduce(
            (acc, entry) => {
              const [time, msg] = entry.split("\t");
              if (time) acc[time.slice(-5) as DayTimePoint] = msg as WaitMsg;
              return acc;
            },
            {} as Partial<Record<DayTimePoint, WaitMsg>>
          );
        this.cache[hospitalKey][key] = ret;
        return parseRet(ret);
      })
      .catch((e) => {
        this.cache[hospitalKey][key] = {};
        return {
          [`${year}-${month}-${day} ${hour}:${minute}`]: undefined,
        };
      });
  }

  async getLatestWaitingTime(
    hospital: Hospital
  ): Promise<Partial<Record<string, WaitMsg | undefined>>> {
    const latestDate = new Date();
    let ret = {};
    for (let i = 0; i < 96; ++i) {
      ret = await this.getWaitingTime(new Date(latestDate), hospital);
      if (Object.values(ret)[0] !== undefined) {
        return ret;
      }
      latestDate.setMinutes(latestDate.getMinutes() - 15);
    }
    return ret;
  }

  async getLast24HoursForParticularDate(
    targetDate: Date,
    hospital: Hospital,
    imputed: boolean = true
  ): Promise<Array<[string, WaitMsg | undefined]>> {
    const datetimes: Date[] = [];
    const qDate = new Date(targetDate);
    for (let i = 0; i < 96; ++i) {
      datetimes.push(new Date(qDate));
      qDate.setMinutes(qDate.getMinutes() - 15);
    }

    const data = [];
    for (const datetime of datetimes) {
      data.push(await this.getWaitingTime(datetime, hospital));
    }

    return Promise.resolve(data.map((v) => Object.entries(v)[0])).then((v) => {
      if (!imputed) return v;
      for (let i = 94; i >= 0; --i) {
        if (imputed && v[i][1] === undefined && v[i + 1][1] !== undefined) {
          v[i][1] = v[i + 1][1];
        }
      }
      return v;
    });
  }

  calculateWaitTime(
    targetDate: Date,
    hospital: Hospital
  ): Promise<WaitMsg | undefined> {
    const tmpDate = new Date(targetDate);
    if (tmpDate.getMinutes() % 15 !== 0) {
      tmpDate.setMinutes(Math.floor(tmpDate.getMinutes() / 15) * 15);
    }
    tmpDate.setHours(tmpDate.getHours() + 24);
    return this.getLast24HoursForParticularDate(tmpDate, hospital).then(
      (entries) => {
        return entries.reduce<WaitMsg | undefined>((acc, entry) => {
          if (entry === undefined) return acc;
          const [time, msg] = entry;
          if (msg === undefined) return acc;
          const waitHourIdx = POSSIBLE_WAIT_MSG.indexOf(msg);
          if (waitHourIdx === -1) return acc;
          const waitHour = waitHourIdx + 1;
          const refDate = new Date(time.replace(" ", "T") + ":00.000+08:00");
          refDate.setHours(refDate.getHours() - waitHour);
          if (refDate >= targetDate) {
            return msg;
          }
          return acc;
        }, undefined);
      }
    );
  }

  clearCache() {
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
    };
  }
}

const isToday = (date: Date): boolean => {
  const _date = new Date(date);
  const today = new Date();
  return _date.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0);
};
