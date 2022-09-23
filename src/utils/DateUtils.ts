export function getTimeString(seconds: number): string
{
	let remainingSeconds = seconds

	let hours = Math.floor(remainingSeconds / 3600);
	remainingSeconds = remainingSeconds % 3600;
	let minutes = Math.floor(remainingSeconds / 60);
	remainingSeconds = Math.round(remainingSeconds % 60);
	return [
		hours.toString().padStart(2, "0"),
		minutes.toString().padStart(2, "0"),
		remainingSeconds.toString().padStart(2, "0")
	]
		.join(":");
};