/**
 * Generates a random 5-digit number
 * @returns A number between 10000 and 99999
 */
export const genRandomNumber = (): number => {
    // Generate a number between 10000 (inclusive) and 99999 (inclusive)
    return Math.floor(Math.random() * 90000) + 10000;
};