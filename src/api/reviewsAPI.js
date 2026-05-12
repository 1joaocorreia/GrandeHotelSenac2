export async function getReviewById(id) {
	if (! id || id == null) {
		throw new Error("Missing room ID");
	}
	
	const url = `/api/reviews/${id}`;
	const response = await fetch(url);

	let data = null;
	try {
		data = response.json();
	} catch(ex) {
		data = null;
		throw new Error("Not possible to interpret the response from server.");
	}

	return data;
}

export async function getReviewsByRoomId(id) {
	if (! id || id == null) {
		throw new Error("Missing room ID");
	}

	const url = `/api/reviews/room/${id}`;
	const response = await fetch(url);

	let data = null;
	try {
		data = response.json();
	} catch (ex) {
		data = null;
		throw new Error("Not possible to interpret the response from server.");
	}

	return data;
}
