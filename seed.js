const { database } = require("../firebase");

const sleepEntries = {
  BNyn1gEv5KRFmKpFwTJtPxhP5l93: {
    1: {
      date: new Date(2022, 1, 1),
      start: new Date(2022, 1, 1, 22, 30),
      end: new Date(2022, 1, 2, 7, 00),
      quality: "ok",
      factors: ["screentime", "caffeine"],
    },
    2: {
      date: new Date(2022, 1, 2),
      start: new Date(2022, 1, 2, 22, 15),
      end: new Date(2022, 1, 3, 7, 00),
      quality: "ok",
      factors: ["screentime", "caffeine"],
    },
    3: {
      date: new Date(2022, 1, 2),
      start: new Date(2022, 1, 2, 22, 10),
      end: new Date(2022, 1, 3, 7, 00),
      quality: "ok",
      factors: ["screentime", "caffeine"],
    },
  },
};

const SimpleSleepEntries = {
  1: {
    date: new Date(2022, 1, 1),
    length: 420,
    quality: "ok",
    factors: ["screentime", "caffeine"],
  },
  2: {
    date: new Date(2022, 1, 2),
    length: 430,
    quality: "ok",
    factors: ["screentime", "caffeine"],
  },
  3: {
    date: new Date(2022, 1, 3),
    length: 440,
    quality: "ok",
    factors: ["caffeine"],
  },
};

const seed = () => {
  database.ref()("simpleSleepEntries").set(SimpleSleepEntries);
};

seed();
