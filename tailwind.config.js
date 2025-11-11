/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./components/**/*.{vue,js,ts}",
        "./layouts/**/*.{vue,js,ts}",
        "./pages/**/*.{vue,js,ts}",
        "./app.{vue,js,ts}",
        "./plugins/**/*.{js,ts}",
    ],
    theme: {
        extend: {
            screens: {
                'h-sm': { raw: '(max-height: 700px)' },
                'h-xs': { raw: '(max-height: 680px)' },
            },
        },
    },
}
