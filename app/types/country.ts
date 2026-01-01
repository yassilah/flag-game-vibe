/** Country shape normalized for the game. */
export interface Country {
   /** Two-letter country code (CCA2). */
   code: string
   /** Country common name. */
   name: string
   /** Public URL to the flag image (SVG preferred). */
   flag: string
   /** Unicode flag emoji. */
   emoji: string
}
