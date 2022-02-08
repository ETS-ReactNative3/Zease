import { database } from "./firebase";

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

//
export const seedFirebase = (userId) => {
  // Push sleep factors to firebase
  const sleepFactorsRef = database.ref("sleepFactors");
  const sleepFactorsData = [
    // This data has already been added, so change factors or they will be duplicated
    { name: "Caffeine", category: "chemical" },
    { name: "Alcohol", category: "chemical" },
    { name: "CBD", category: "chemical" },
    { name: "Melatonin", category: "chemical" },
    { name: "Meditated", category: "practice" },
    { name: "Worked out", category: "practice" },
    { name: "Ate late", category: "practice" },
    { name: "Napped", category: "practice" },
    { name: "No screens", category: "practice" },
    { name: "Sleep podcast", category: "practice" },
    { name: "Sleep mask", category: "tool" },
    { name: "C-pap", category: "tool" },
    { name: "Darkness blinds", category: "tool" },
  ];
  // sleepFactorsData.forEach((factor) => sleepFactorsRef.push(factor));
  // console.log("data sent to firebase");

  // Fetch sleep factors from firebase
  let sleepFactors;
  sleepFactorsRef.on("value", (snapshot) => {
    sleepFactors = snapshot.val();
    console.log("sleepFactors", sleepFactors);
  });
  console.log("sleepFactors data fetched from firebase");
  console.log(sleepFactors);

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

  const sleepEntriesRef = database.ref(`sleepEntries/${userId}`);
  for (let m = 1; m <= 12; m++) {
    for (let d = 1; d <= 30; d++) {
      let formatMonth = m < 10 ? `0${m}` : `${m}`;
      let formatDay = d < 10 ? `0${d}` : `${d}`;
      let hour = 1000 * 60 * 60
      let startUTC = new Date()
      startUTC.setHours(22 + Math.random() * 3, Math.random() * 60, Math.random() * 60, 0)  
      let endUTC = new Date()
      endUTC.setHours(7 + Math.random() * 3, Math.random() * 60, Math.random() * 60, 0)
      // console.log(startUTC)
      // console.log(endUTC)
      let selectedFactors = {}
      Object.entries(sleepFactors).forEach(([key, val]) => {
        if (Math.random() < 0.2) selectedFactors[key] = val
      })

      const formData = { 
        date: `2021-${formatMonth}-${formatDay}`,
        startTime: convertToMilitaryString(startUTC),
        endTime: convertToMilitaryString(endUTC),
        quality: Math.random() * 100,
        entryFactors: selectedFactors,
        notes: "Seeded 2/8/21"
      }
      console.log("formData", formData)
      // sleepEntriesRef.push(formData);
    }
  }
};
