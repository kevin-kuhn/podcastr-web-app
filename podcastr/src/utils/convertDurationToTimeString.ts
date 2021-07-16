export const convertDurationToTimeString = (durationSeconds: number) => {
	const hours = Math.floor(durationSeconds / (60 * 60))
	const minutes = Math.floor((durationSeconds % 3600) / 60)
	const seconds = durationSeconds % 60

	const timeString = [hours, minutes, seconds].map(unit =>
		String(unit).padStart(2, "0")
	).join(":")

	return timeString
}
