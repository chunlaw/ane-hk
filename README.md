# ANE Hong Kong

API to extract the historical A&E waiting time starting from March 15, 2024.

## Install

```bash
npm i ane-hk
```

or

```bash
yarn add ane-hk
```

### Usage

__Initialization__

```typescript
import AneHk from ""

const aneHk = new AneHk();
```

__Get the latest waiting time for a specific hospital.__

```typescript
getLatestWaitingTime( hospital: Hospital ): Promise<Partial<Record<string, WaitMsg | undefined>>>

// Example: aneHk.getLatestWaitingTime("Alice Ho Miu Ling Nethersole Hospital"));
```

__Get the waiting time for a hospital in the specific date time.__
```typescript
getWaitingTime( targetDate: Date, hospital: Hospital ): : Promise<Partial<Record<string, WaitMsg | undefined>>>;

// Example: aneHk.getWaitingTime(new Date("2024-05-01 18:03:49", "Alice Ho Miu Ling Nethersole Hospital"));
```

__Get the waiting time for a hospital in the specific date time with imputation.__
```typescript
calculateWaitTime( targetDate: Date, hospital: Hospital ): : Promise<Partial<Record<string, WaitMsg | undefined>>>;

// Example: aneHk.calculateWaitTime(new Date("2024-05-01 18:03:49", "Alice Ho Miu Ling Nethersole Hospital"));
```
Note that not all waiting time could be recorded by the API, imputation will be done if no data is crawled. `undefined` will be returned for date time in the future, or data before the March 15, 2024.

__Get the last 24 hours waiting time for a hospital in a specific date time.__

```typescript
async getLast24HoursForParticularDate( targetDate: Date, hospital: Hospital, imputed: boolean = true ): Promise<Array<[string, WaitMsg | undefined]>>

// Example: aneHk.async getLast24HoursForParticularDate(new Date("2024-05-01 18:03:49", "Alice Ho Miu Ling Nethersole Hospital"));
```
Note that not all waiting time could be recorded by the API, imputation is here as an option to fill up the missing waiting time.


__Get the last 24 hours waiting time for a hospital in a specific date time.__

```typescript
async getLast24HoursForParticularDate( targetDate: Date, hospital: Hospital, imputed: boolean = true ): Promise<Array<[string, WaitMsg | undefined]>>

// Example: aneHk.async getLast24HoursForParticularDate(new Date("2024-05-01 18:03:49", "Alice Ho Miu Ling Nethersole Hospital"));
```
Note that not all waiting time could be recorded by the API, imputation is here as an option to fill up the missing waiting time.

### Coverage

The package covers public A&Es listed as below

- Alice Ho Miu Ling Nethersole Hospital
- Caritas Medical Centre
- Kwong Wah Hospital
- North District Hospital
- North Lantau Hospital
- Princess Margaret Hospital
- Pok Oi Hospital
- Prince of Wales Hospital
- Pamela Youde Nethersole Eastern Hospital
- Queen Elizabeth Hospital
- Queen Mary Hospital
- Ruttonjee Hospital
- St John Hospital
- Tseung Kwan O Hospital
- Tuen Mun Hospital
- Tin Shui Wai Hospital
- United Christian Hospital
- Yan Chai Hospital