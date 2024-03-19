import AneHk from "./AneHk"

const aneHk = new AneHk()

Promise.all([
  aneHk.calculateWaitTime(new Date("2024-03-18 10:00"), "Alice Ho Miu Ling Nethersole Hospital"),
  aneHk.calculateWaitTime(new Date("2024-03-18 10:15"), "Alice Ho Miu Ling Nethersole Hospital"),
  aneHk.calculateWaitTime(new Date("2024-03-18 10:30"), "Alice Ho Miu Ling Nethersole Hospital"),
  aneHk.calculateWaitTime(new Date("2024-03-18 10:45"), "Alice Ho Miu Ling Nethersole Hospital"),
  aneHk.calculateWaitTime(new Date("2024-03-18 11:00"), "Alice Ho Miu Ling Nethersole Hospital"),
  aneHk.calculateWaitTime(new Date("2024-03-18 11:15"), "Alice Ho Miu Ling Nethersole Hospital"),
  aneHk.calculateWaitTime(new Date("2024-03-18 11:30"), "Alice Ho Miu Ling Nethersole Hospital"),
  aneHk.calculateWaitTime(new Date("2024-03-18 11:45"), "Alice Ho Miu Ling Nethersole Hospital"),
  aneHk.calculateWaitTime(new Date("2024-03-18 12:00"), "Alice Ho Miu Ling Nethersole Hospital"),
  aneHk.calculateWaitTime(new Date("2024-03-18 12:15"), "Alice Ho Miu Ling Nethersole Hospital"),
  aneHk.calculateWaitTime(new Date("2024-03-18 12:30"), "Alice Ho Miu Ling Nethersole Hospital"),
  aneHk.calculateWaitTime(new Date("2024-03-18 12:45"), "Alice Ho Miu Ling Nethersole Hospital"),
])
.then(res => {
  console.log(res)
})
