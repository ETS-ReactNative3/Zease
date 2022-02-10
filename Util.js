import { database } from "./firebase";

//takes in a UTC Time Date object, and returns the local time hours and minutes in a four digit string.
export const convertToMilitaryString = (UTCTimeDate) => {
  let hoursString = String(UTCTimeDate.getHours());
  //make sure that the hours string has 2 characters even it is less than 10
  hoursString = hoursString.length < 2 ? 0 + hoursString : hoursString;

  let minutesString = String(UTCTimeDate.getMinutes());
  //make sure that the minutes string has 2 characters even it is less than 10
  minutesString = minutesString.length < 2 ? 0 + minutesString : minutesString;

  return hoursString + minutesString;
};

//takes in a 4 digitstring in military time and returns it in AM/PM time format
export const convertToAmPm = (militaryString) => {
  let militaryHoursNum = Number(militaryString.slice(0, 2));
  let hoursString =
    militaryHoursNum > 12
      ? String(militaryHoursNum - 12)
      : String(militaryHoursNum);
  if (hoursString === "00") {
    hoursString = "12";
  }

  let minString = militaryString.slice(-2);
  let AmPm = militaryHoursNum > 11 ? "PM" : "AM";
  return `${hoursString}:${minString} ${AmPm}`;
};

//takes in an object of sleep factors and returns an array of sleep factor categories each of which can be passed to the sleepFactorCategory component
export const reformatFactors = (dbFactorsObject) => {
  const categories = [
    {
      name: "Practices",
      factors: [],
    },
    {
      name: "Tools",
      factors: [],
    },
    {
      name: "Chemicals",
      factors: [],
    },
  ];
  for (const factorId in dbFactorsObject) {
    let factor = dbFactorsObject[factorId];

    switch (dbFactorsObject[factorId].category) {
      case "practice":
        categories[0].factors.push([factor, factorId]);
        break;
      case "tool":
        categories[1].factors.push([factor, factorId]);
        break;
      case "chemical":
        categories[2].factors.push([factor, factorId]);
        break;
    }
  }

  return categories;
};

//this takes in a sleep entry.  It used the starttime and endTime properties on the entry to calculate the number of hours of sleep
export const calculateSleepLength = (entry) => {
  let startHrs = Number(entry.startTime.slice(0, 2));
  let startMin = Number(entry.startTime.slice(3));
  let sleepMinBeforeMidnight = (23 - startHrs) * 60 + (60 - startMin);
  //this line accounts for entries when they user went to sleep after midnight.
  if (startHrs < 10) {
    sleepMinBeforeMidnight = -(startHrs * 60 + startMin);
  }

  let endHrs = Number(entry.endTime.slice(0, 2));
  let endMin = Number(entry.endTime.slice(3));
  let sleepMinAfterMidnight = endHrs * 60 + endMin;

  return (sleepMinBeforeMidnight + sleepMinAfterMidnight) / 60;
};

//get the date of yesterday formatted in a string of yyyy-mm-dd
export const yesterday = () => {
  const dateObj = new Date();

  let timeZoneAdjust = -new Date().getTimezoneOffset() / 60;

  dateObj.setTime(dateObj.getTime() - (24 + timeZoneAdjust) * 60 * 60 * 1000); // Subtract 24 hours because we want to give each entry the date of the night they went to sleep (not when they logged it)

  const date = dateObj.toISOString().slice(0, 10);
  return date;
};

//takes in a date string with format of yyyy-mm-dd and returns a number with format yyyymmdd
export const getDateNumber = (dateString) => {
  let noDashString = "";
  for (let i = 0; i < dateString.length; i++) {
    if (dateString[i] !== "-") {
      noDashString += dateString[i];
    }
  }
  return Number(noDashString);
};

//takes in a date string with format of yyyy-mm-dd and returns the corresponding date object
export const getDateObj = (dateString) => {
  const year = Number(dateString.slice(0, 4));
  const month = Number(dateString.slice(5, 7));
  const day = Number(dateString.slice(-2));
  return new Date(year, month - 1, day);
};

export const seedFirebase = (userId) => {
  // Push sleep factors to firebase
  //const sleepFactorsRef = database.ref('sleepFactors');
  const sleepFactorsData = [
    // This data has already been added, so change factors or they will be duplicated
    { name: "Diphenhydramine (Benadryl)", category: "chemical" },
    { name: "Ear Plugs", category: "tool" },
  ];
  // sleepFactorsData.forEach((factor) => sleepFactorsRef.push(factor));
  // console.log("data sent to firebase");

  // Fetch sleep factors from firebase
  // let sleepFactors;
  // sleepFactorsRef.on('value', (snapshot) => {
  //   sleepFactors = snapshot.val();
  //   console.log('sleepFactors', sleepFactors);
  // });
  // console.log('sleepFactors data fetched from firebase');
  // console.log(sleepFactors);

  // Set user profile data
  // const userId = ""; // Update for user to seed
  // const userRef = database.ref(`users/${userId}`);
  // const userProfileData = {
  //   // Update data for specific user
  //   name: "",
  //   sleepGoalStart: "",
  //   sleepGoalEnd: "",
  //   userFactors: sleepFactors,
  //   logReminderOn: true,
  //   sleepReminderOn: true,
  // };
  // userRef.set(userProfileData);
  // console.log("data sent to firebase");

  // const sleepEntriesRef = database.ref(`sleepEntries/${userId}`);
  // for (let m = 1; m <= 12; m++) {
  //   for (let d = 1; d <= 30; d++) {
  //     let formatMonth = m < 10 ? `0${m}` : `${m}`;
  //     let formatDay = d < 10 ? `0${d}` : `${d}`;
  //     let hour = 1000 * 60 * 60;
  //     let startUTC = new Date();
  //     startUTC.setHours(22 + Math.random() * 3, Math.random() * 60, Math.random() * 60, 0);
  //     let endUTC = new Date();
  //     endUTC.setHours(7 + Math.random() * 3, Math.random() * 60, Math.random() * 60, 0);
  //     // console.log(startUTC)
  //     // console.log(endUTC)
  //     let selectedFactors = {};
  //     Object.entries(sleepFactors).forEach(([key, val]) => {
  //       if (Math.random() < 0.2) selectedFactors[key] = val;
  //     });

  //     const formData = {
  //       date: `2021-${formatMonth}-${formatDay}`,
  //       startTime: convertToMilitaryString(startUTC),
  //       endTime: convertToMilitaryString(endUTC),
  //       quality: Math.random() * 100,
  //       entryFactors: selectedFactors,
  //       notes: 'Seeded 2/8/21'
  //     };
  //     console.log('formData', formData);
  //     // sleepEntriesRef.push(formData);
  //   }
  // }
};

//takes in a date string of "yyyy-mm-dd" and returns string "mon, d, yyyy"
export const reformatDate = (dateString) => {
  const year = `${dateString.slice(0, 4)}`;
  const monthLookUp = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };
  const month = monthLookUp[dateString.slice(5, 7)];

  let day = dateString.slice(-2);
  //don't display a leading zero on the date
  if (day[0] === "0") {
    day = day.slice(-1);
  }
  return `${month} ${day}, ${year}`;
};

//takes in 4 digit military time string for a bed time.  returns the number of minutes since midnight on the morning when the person last woke up before bed time.
//e.g. if bed time is 11pm getBedTime("2300")=> 23*60=1380
//e.g. if bedtime is 12:30am getBedTime("0030")=> 24*60+30= 1470
export const getBedTime = (timeStr) => {
  let hours = Number(timeStr.slice(0, 2));
  if (hours < 12) {
    hours += 24;
  }
  let min = Number(timeStr.slice(-2));
  return hours * 60 + min;
};

export const getWakeTime = (timeStr) => {
  let hours = Number(timeStr.slice(0, 2));
  let min = Number(timeStr.slice(-2));
  return hours * 60 + min;
};
