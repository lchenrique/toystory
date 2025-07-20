/**
 * Finds the first letter of the alphabet that does not appear in the given name.
 * Case insensitive (treats 'A' and 'a' as the same letter).
 * Returns '-' if all letters from a-z appear in the name.
 * 
 * @param name The name to check for missing letters
 * @returns The first missing letter or '-' if all letters are present
 */
export function findFirstMissingLetter(name: string): string {
  // Convert name to lowercase and remove non-alphabetic characters
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  
  // Create a Set of all letters in the name
  const lettersInName = new Set(cleanName);
  
  // Check each letter of the alphabet
  for (let charCode = 97; charCode <= 122; charCode++) {
    const letter = String.fromCharCode(charCode);
    if (!lettersInName.has(letter)) {
      return letter;
    }
  }
  
  // If all letters are present
  return '-';
}