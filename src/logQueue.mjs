const logQueue = [];
let loggerRunning = false;

const startLogger = (interval = 500) => {
	if (loggerRunning) return;
	loggerRunning = true;

	const timer = setInterval(() => {
		if (logQueue.length === 0) return;

		const msg = logQueue.shift();
		console.log(msg);

		if (logQueue.length === 0) {
			clearInterval(timer);
			loggerRunning = false;
		}
	}, interval);
};

export const logOnFulfill = (name, promise) =>
	promise
		.then((result) => {
			logQueue.push(`[${new Date().toISOString()}] OK_${name}`);
			startLogger(0); // controls perceived progress speed
			return result;
		})
		.catch((err) => {
			logQueue.push(`[${new Date().toISOString()}] KO_${name} \n> ${err}`);
			startLogger(0); // controls perceived progress speed
		});
