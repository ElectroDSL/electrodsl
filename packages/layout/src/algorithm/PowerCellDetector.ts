const POWER_SYMBOLS = new Set([
    "vcc",
    "gnd",
    "+5v",
    "+3.3v",
    "-5v",
    "-12v",
    "+12v",
    "earth",
    "pe"
]);

export function isPowerSymbol(type: string): boolean {
    return POWER_SYMBOLS.has(type.toLowerCase());
}