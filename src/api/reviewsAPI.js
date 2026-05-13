export async function getReviewById(id) {
	const ret = {
		ok: false,
		raw: null,
		message: ""
	};
	
	if (! id || id == null) {
		ret["message"] = "An error ocurred. ID is missing.";
		return ret;
	}
	
	const url = `/api/reviews/${id}`;
	const response = await fetch(url);
	
	try {
		ret.raw = await response.json();
	} catch(ex) {
		ret.raw = null;
		ret.message = `An error ocurred. Tried: ${url}. Cause: < ${ex.cause} >. Message: ${ex.message}`;
		return ret;
	}
	
	if (! response.ok) {
		ret.message = `An error ocurred. Tried ${url}. Code: ${response.status}. Message: ${ret.raw.message}`;
		return ret;
	}

	ret.ok = true;
	ret.message = "No errors.";
	return ret;
}

export async function getReviewsByRoomId(id) {
	const ret = {
		ok: false,
		raw: null,
		message: ""	
	};

	if (! id || id == null) {
		ret.message = "An error ocurred. ID is missing";
		return ret;
	}

	const url = `/api/reviews/room/${id}`;
	const response = await fetch(url);

	try {
		ret.raw = await response.json();
	} catch (ex) {
		ret.message = `An error ocurred. Tried: ${url}. Cause: < ${ex.cause} >. Message: ${ex.message}`;
		return ret;
	}

	if (! response.ok) {
		ret.message = `An error ocurred. Tried: ${url}. Code: ${response.status}. Message: ${ret.raw.message}`;
		return ret;
	}
	
	ret.ok = true;
	ret.message = "No errors.";
	return ret;
}
