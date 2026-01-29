// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         background: "var(--background)",
//         foreground: "var(--foreground)",
//       },
//       aspectRatio:{
//         '4/3': '4 / 3',
//         '16/9': '16 / 9',
//         '9/16': '9 / 16',
//         '3/4': '3 / 4',
//         '1/1': '1 / 1',
//         '2/3': '2 / 3',
//         '3/4': '3 / 4',
//         '1/2': '1 / 2',
//         '1/3': '1 / 3',
//         '2/4': '2 / 4',
//         '3/5': '3 / 5',
//         '1/4': '1 / 4',
//         '1/5': '1 / 5',
//         '1/6': '1 / 6',
//         '2/5': '2 / 5',
//       }
//     },
//   },
//   plugins: [],
// };
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      aspectRatio: {
        '1/1': '1 / 1',
        '1/2': '1 / 2',
        '1/3': '1 / 3',
        '1/4': '1 / 4',
        '1/5': '1 / 5',
        '1/6': '1 / 6',
        '2/3': '2 / 3',
        '2/4': '2 / 4',
        '2/5': '2 / 5',
        '3/4': '3 / 4',
        '3/5': '3 / 5',
        '4/3': '4 / 3',
        '16/9': '16 / 9',
        '9/16': '9 / 16',
      },
    },
  },
  plugins: [],
};
