/* The sprite, drawn once at one pixel per cell. CSS scales it up with
   image-rendering: pixelated, so the art stays crisp and the data URL stays
   tiny — far cheaper than shipping a PNG and sharper than scaling one. */
export const ART = [
  "......KKKKKKKK......", ".....KKMMMMMMKK.....", "....KMLLLLLLLLMK....",
  "....KMDDDDDDDDMK....", "...KMLLLLLLLLLLMK...", "...KRDMDMDDMDMDMK...",
  "...KMMMMMMMMMMMMK...", "..KKMDDDDDDDDDDMKK..", "..KMDSSSSSSSSSRRMK..",
  "KKMMDSSSSSSSSSSRMMKK", "KRLMDSSWWSSWWSSDMLRK", "KRLMDSSWWSSWWSSDMLRK",
  "KKMMRSSSSSSSSSSDMMKK", "..KMRRSSSSSSSSSDMK..", "..KKMDDDDDDDDDDMKK..",
  "...KMMMMMMMMMMMMK...", "....KKMMMMMMMMKK....", "....KMLM....MLMK....",
  "....KMLM....MLMK....", "...KMLLLM..MLLLMK...", "...KRRRRM..MRRRRK...",
];
export const PAL: Record<string, string> = {
  K: "#000000", M: "#2b2b2b", D: "#171717", L: "#8c8c8c",
  S: "#060606", W: "#f2f2f2", R: "#f0402f",
};
