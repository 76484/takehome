import { expect } from "chai";
import { isSameDay, isSameWeek, isAcceptableLoad } from "./lib";

describe("isSameDay", () => {
  it("should be false when different days", () => {
    expect(isSameDay("2000-01-01T00:00:00Z", "2000-01-02T00:00:00Z")).to.be
      .false;

    expect(isSameDay("2000-01-02T12:49:12Z", "2000-01-03T03:08:20Z")).to.be
      .false;
  });

  it("should be false when day changes", () => {
    expect(isSameDay("2000-01-01T23:59:59Z", "2000-02-01T00:00:00Z")).to.be
      .false;
  });

  it("should be true when same year, month, day utc", () => {
    expect(isSameDay("2000-01-01T00:00:00Z", "2000-01-01T23:59:59Z")).to.be
      .true;
  });
});

describe("isSameWeek", () => {
  it("should be false when comparing sunday to following monday", () => {
    expect(isSameWeek("2020-11-01T00:00:00Z", "2020-11-02T00:00:00Z")).to.be
      .false;
  });

  it("should be false when same month/day but different years", () => {
    expect(isSameWeek("2000-01-05T03:12:34Z", "2001-01-05T03:12:34Z")).to.be
      .false;
  });

  it("should be true when same year, month, day utc", () => {
    expect(isSameWeek("2000-01-01T00:00:00Z", "2000-01-01T23:59:59Z")).to.be
      .true;
  });
});

describe("isAcceptableLoad", () => {
  it("should be false if 3 accepted loads have been added on same day", () => {
    expect(
      isAcceptableLoad(
        [
          {
            id: "1",
            customer_id: "1",
            load_amount: "$1.00",
            time: "2000-01-01T00:00:00Z",
            accepted: true,
          },
          {
            id: "2",
            customer_id: "1",
            load_amount: "$2.00",
            time: "2000-01-01T00:00:01Z",
            accepted: true,
          },
          {
            id: "3",
            customer_id: "1",
            load_amount: "$3.00",
            time: "2000-01-01T00:00:03Z",
            accepted: true,
          },
        ],
        {
          id: "4",
          customer_id: "1",
          load_amount: "$4.00",
          time: "2000-01-01T00:00:04Z",
        }
      )
    ).to.be.false;
  });

  it("should be false if new total for day would exceed $5,000", () => {
    expect(
      isAcceptableLoad(
        [
          {
            id: "1",
            customer_id: "1",
            load_amount: "$5000.00",
            time: "2000-01-01T00:00:00Z",
            accepted: true,
          },
        ],
        {
          id: "1",
          customer_id: "1",
          load_amount: "$1.00",
          time: "2000-01-01T00:00:01Z",
        }
      )
    ).to.be.false;

    expect(
      isAcceptableLoad([], {
        id: "1",
        customer_id: "1",
        load_amount: "$5001.00",
        time: "2000-01-01T00:00:00Z",
        accepted: true,
      })
    ).to.be.false;
  });

  it("should be true if new total for day would not exceed $5,0000", () => {
    expect(
      isAcceptableLoad([], {
        id: "1",
        customer_id: "1",
        load_amount: "$100.00",
        time: "2000-01-01T00:00:00Z",
      })
    ).to.be.true;

    expect(
      isAcceptableLoad(
        [
          {
            id: "1",
            customer_id: "1",
            load_amount: "$4999.00",
            time: "2000-01-01T00:00:00Z",
            accepted: true,
          },
        ],
        {
          id: "2",
          customer_id: "1",
          load_amount: "$1.00",
          time: "2000-01-01T00:00:01Z",
          accepted: true,
        }
      )
    ).to.be.true;
  });

  it("should be false if new total for week would exceed $20,000", () => {
    expect(
      isAcceptableLoad(
        [
          {
            id: "1",
            customer_id: "1",
            load_amount: "$20000.00",
            time: "2000-01-03T00:00:00Z",
            accepted: true,
          },
        ],
        {
          id: "2",
          customer_id: "1",
          load_amount: "$1.00",
          time: "2000-01-04T00:00:00Z",
        }
      )
    ).to.be.false;
  });

  it("should be true if new total for week would not exceed $20,0000", () => {
    expect(
      isAcceptableLoad(
        [
          {
            id: "1",
            customer_id: "1",
            load_amount: "$5000.00",
            time: "2000-01-03T00:00:00Z",
            accepted: true,
          },
          {
            id: "2",
            customer_id: "1",
            load_amount: "$5000.00",
            time: "2000-01-04T00:00:00Z",
            accepted: true,
          },
          {
            id: "3",
            customer_id: "1",
            load_amount: "$5000.00",
            time: "2000-01-05T00:00:00Z",
            accepted: true,
          },
          {
            id: "4",
            customer_id: "1",
            load_amount: "$4999.00",
            time: "2000-01-06T00:00:00Z",
            accepted: true,
          },
        ],
        {
          id: "5",
          customer_id: "1",
          load_amount: "$1.00",
          time: "2000-01-07T00:00:00Z",
        }
      )
    ).to.be.true;
  });

  it("should include only accepted requests when totalling", () => {
    expect(
      isAcceptableLoad(
        [
          {
            id: "1",
            customer_id: "1",
            load_amount: "$20001.00",
            time: "2000-01-01T00:00:00Z",
            accepted: false,
          },
          {
            id: "2",
            customer_id: "1",
            load_amount: "$50.00",
            time: "2000-01-01T00:00:01Z",
            accepted: true,
          },
        ],
        {
          id: "3",
          customer_id: "1",
          load_amount: "$50.00",
          time: "2000-01-01T00:00:03Z",
        }
      )
    ).to.be.true;
  });
});
