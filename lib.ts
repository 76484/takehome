import { DateTime } from "luxon";
import numeral from "numeral";

import { LoadRequest, ProcessedLoadRequest } from "./types";

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

const isAcceptableLoad = (loadRequests: ProcessedLoadRequest[], newLoadRequest: LoadRequest) => {
  // A maximum of $5,000 can be loaded per day
  // A maximum of $20,000 can be loaded per week
  // A maximum of 3 loads can be performed per day, regardless of amount

  const sameDayRequests = loadRequests.filter(
    (loadRequest) =>
      loadRequest.accepted && isSameDay(loadRequest.time, newLoadRequest.time)
  );

  if (sameDayRequests.length === 3) {
    return false;
  }

  const sameDayTotal = sameDayRequests.reduce(
    (total, request) => total + numeral(request.load_amount).value(),
    0
  );

  if (sameDayTotal + numeral(newLoadRequest.load_amount).value() > 5000) {
    return false;
  }

  const sameWeekRequests = loadRequests.filter(
    (loadRequest) =>
      loadRequest.accepted && isSameWeek(loadRequest.time, newLoadRequest.time)
  );

  const sameWeekTotal = sameWeekRequests.reduce(
    (total, request) => total + numeral(request.load_amount).value(),
    0
  );

  if (sameWeekTotal + numeral(newLoadRequest.load_amount).value() > 20000) {
    return false;
  }

  return true;
};

export { isSameDay, isSameWeek, isAcceptableLoad };
