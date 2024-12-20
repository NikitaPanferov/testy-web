export const copyTestAdress = async (testId: string) => {
	if (!navigator.clipboard) {
		console.error("Clipboard API is not available");
		return;
	}

	try {
		await navigator.clipboard.writeText(
			`https://testy.nikpanfer.ru/test/${testId}`
		);
	} catch (err) {
		console.error("Failed to copy text: ", err);
	}
};
