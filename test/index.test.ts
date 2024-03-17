import AneHk from "../src/index"

const aneHk = new AneHk({lang: "en"})

test("expected Over 2 hours", () => {
  return aneHk.getWaitingTime(2024, 3, 15, "Alice Ho Miu Ling Nethersole Hospital")
    .then(res => {
      expect(res["00:00"] ).toBe("Over 2 hours")
    })
})