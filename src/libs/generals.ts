export function integerToMyanmar(num: number): string {
  const myanmarDigits: { [key: number]: string } = {
    0: "၀",
    1: "၁",
    2: "၂",
    3: "၃",
    4: "၄",
    5: "၅",
    6: "၆",
    7: "၇",
    8: "၈",
    9: "၉",
  };

  // Convert the integer to a string and map each digit to its Myanmar equivalent
  return num
    .toString()
    .split("")
    .map((digit) => myanmarDigits[Number(digit)])
    .join("");
}
