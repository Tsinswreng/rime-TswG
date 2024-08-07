export enum AnsiColors {
	Reset = "\x1b[0m",
	Black = "\x1b[30m",
	Red = "\x1b[31m",
	Green = "\x1b[32m",
	Yellow = "\x1b[33m",
	Blue = "\x1b[34m",
	Magenta = "\x1b[35m",
	Cyan = "\x1b[36m",
	White = "\x1b[37m",
	BrightBlack = "\x1b[90m",
	BrightRed = "\x1b[91m",
	BrightGreen = "\x1b[92m",
	BrightYellow = "\x1b[93m",
	BrightBlue = "\x1b[94m",
	BrightMagenta = "\x1b[95m",
	BrightCyan = "\x1b[96m",
	BrightWhite = "\x1b[97m",
	BgBlack = "\x1b[40m",
	BgRed = "\x1b[41m",
	BgGreen = "\x1b[42m",
	BgYellow = "\x1b[43m",
	BgBlue = "\x1b[44m",
	BgMagenta = "\x1b[45m",
	BgCyan = "\x1b[46m",
	BgWhite = "\x1b[47m",
	BgBrightBlack = "\x1b[100m",
	BgBrightRed = "\x1b[101m",
	BgBrightGreen = "\x1b[102m",
	BgBrightYellow = "\x1b[103m",
	BgBrightBlue = "\x1b[104m",
	BgBrightMagenta = "\x1b[105m",
	BgBrightCyan = "\x1b[106m",
	BgBrightWhite = "\x1b[107m",
	Bold = "\x1b[1m",
	Underline = "\x1b[4m",
	Inverse = "\x1b[7m",
	Hidden = "\x1b[8m"
}

// 256 色支持
export function color256(fg: number, bg: number = -1): string {
	const fgCode = `\x1b[38;5;${fg}m`;
	const bgCode = bg >= 0 ? `\x1b[48;5;${bg}m` : '';
	return `${fgCode}${bgCode}`;
}

// 真彩色支持
export function rgbColor(r: number, g: number, b: number, bg: boolean = false): string {
	const colorCode = bg ? `\x1b[48;2;${r};${g};${b}m` : `\x1b[38;2;${r};${g};${b}m`;
	return colorCode;
}

