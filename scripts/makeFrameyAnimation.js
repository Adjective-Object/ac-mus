const MAX_FRAMES = 40;
const RANGE_MIN = -2;
const RANGE_MAX = 2;
for (let i=0; i<=MAX_FRAMES; i++) {
    const percent = 100 * (i/MAX_FRAMES);
    const x = Math.round(Math.random() * (RANGE_MAX - RANGE_MIN) + RANGE_MIN)
    const y = Math.round(Math.random() * (RANGE_MAX - RANGE_MIN) + RANGE_MIN)

    console.log(`  ${percent}% { transform: translate(${x}px, ${y}px)}`)
    const nextPercent = percent + (1/MAX_FRAMES * 100);
    if (i !== MAX_FRAMES) {
        console.log(`  ${nextPercent- 0.0001}% { transform: translate(${x}px, ${y}px)}`)
    }
}