import { database } from "./firebase.mjs";
// const { database } = require("./firebase");
const date1 = new Date(2022, 1, 1);
console.log("date1", date1);
const sleepEntries = {
  hJO4AAp6PuM8O8bcuowVQYbgHbi1: {
    1: {
      date: 220101,
      start: 2201012230,
      end: 2201020700,
      quality: "ok",
      factors: ["screentime", "caffeine"],
    },
    2: {
      date: 220102,
      start: new Date(2022, 1, 2, 22, 15),
      end: new Date(2022, 1, 3, 7, 0),
      quality: "ok",
      factors: ["screentime", "caffeine"],
    },
    3: {
      date: 220103,
      start: new Date(2022, 1, 3, 22, 10),
      end: new Date(2022, 1, 4, 7, 0),
      quality: "ok",
      factors: ["screentime", "caffeine"],
    },
    4: {
      date: 220104,
      start: new Date(2022, 1, 4, 22, 0),
      end: new Date(2022, 1, 5, 7, 0),
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
  database.ref("simplesleepEntries").set(SimpleSleepEntries);
};

seed();
