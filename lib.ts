import { DateTime } from "luxon";
import numeral from "numeral";

const LIMIT_DAILY_LOADS = 3;
const LIMIT_DAILY_DOLLARS = 5000;
const LIMIT_WEEKLY_DOLLARS = 20000;

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
  const sameDayAccptedRequests = processedLoadRequests.filter(
    (processedLoadRequest) =>
    processedLoadRequest.accepted && isSameDay(processedLoadRequest.time, loadRequest.time)
  );

  if (sameDayAccptedRequests.length === LIMIT_DAILY_LOADS) {
    return false;
  }

  const sameDayTotal = sameDayAccptedRequests.reduce(
    (total, request) => total + numeral(request.load_amount).value(),
    0
  );

  if (sameDayTotal + numeral(loadRequest.load_amount).value() > LIMIT_DAILY_DOLLARS) {
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

  if (sameWeekTotal + numeral(loadRequest.load_amount).value() > LIMIT_WEEKLY_DOLLARS) {
    return false;
  }

  return true;
};

export { isSameDay, isSameWeek, isAcceptableLoadRequest };
