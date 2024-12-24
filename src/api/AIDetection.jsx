async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment",
		{
			headers: {
				Authorization: "Bearer 1",
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}

query({"inputs": "I like you. I love you"}).then((response) => {
	console.log(JSON.stringify(response));
});