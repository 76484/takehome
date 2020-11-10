import { DateTime } from "luxon";
import numeral from "numeral";

const isSameDay = (isoDate1: string, isoDate2: string) => {
  const date1 = DateTime.fromISO(isoDate1).toUTC();
  const date2 = DateTime.fromISO(isoDate2).toUTC();

  return date1.startOf("day").equals(date2.startOf("day"));
};

const isSameWeek = (isoDate1: string, isoDate2: string) => {
  const date1 = DateTime.fromISO(isoDate1).toUTC();
  const date2 = DateTime.fromISO(isoDate2).toUTC();
  const weekStartDate1 = date1.minus({ days: date1.weekday - 1 });
  const weekStartDate2 = date2.minus({ days: date2.weekday - 1 });

  return weekStartDate1.startOf("day").equals(weekStartDate2.startOf("day"));
};

const isAcceptableLoadRequest = (processedLoadRequests: ProcessedLoadRequest[], loadRequest: LoadRequest) => {
  // A maximum of $5,000 can be loaded per day
  // A maximum of $20,000 can be loaded per week
  // A maximum of 3 loads can be performed per day, regardless of amount

  const sameDayAccptedRequests = processedLoadRequests.filter(
    (processedLoadRequest) =>
    processedLoadRequest.accepted && isSameDay(processedLoadRequest.time, loadRequest.time)
  );

  if (sameDayAccptedRequests.length === 3) {
    return false;
  }

  const sameDayTotal = sameDayAccptedRequests.reduce(
    (total, request) => total + numeral(request.load_amount).value(),
    0
  );

  if (sameDayTotal + numeral(loadRequest.load_amount).value() > 5000) {
    return false;
  }

  const sameWeekAccptedRequests = processedLoadRequests.filter(
    (processedLoadRequest) =>
    processedLoadRequest.accepted && isSameWeek(processedLoadRequest.time, loadRequest.time)
  );

  const sameWeekTotal = sameWeekAccptedRequests.reduce(
    (total, request) => total + numeral(request.load_amount).value(),
    0
  );

  if (sameWeekTotal + numeral(loadRequest.load_amount).value() > 20000) {
    return false;
  }

  return true;
};

export { isSameDay, isSameWeek, isAcceptableLoadRequest };
