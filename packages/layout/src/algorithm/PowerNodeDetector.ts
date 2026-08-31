const POWER_SYMBOLS = new Set([
    "vcc",
    "gnd",
    "earth",
    "pe",
    "+3.3v",
    "+5v",
    "+12v",
    "-5v",
    "-12v"
]);

export function isPowerNode(symbol: string): boolean {
    return POWER_SYMBOLS.has(symbol.toLowerCase());
}