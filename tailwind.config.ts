import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.tsx","./components/**/*.tsx"],
  theme: { extend: {
    colors: { paper:"#F5F6F4", card:"#FFFFFF", ink:"#1E2A2D", mute:"#6B7774", line:"#DDE2DF", sage:{DEFAULT:"#3F6B62",dark:"#2F524B",soft:"#E3ECE9"}, plum:"#7A4B63", warn:"#B4572F" },
    fontFamily: { display:["var(--font-display)","serif"], sans:["var(--font-sans)","system-ui","sans-serif"] } } },
} satisfies Config;
