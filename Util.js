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
