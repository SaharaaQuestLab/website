const fetchJSON = async (uri: string) => {
	return await (await fetch(uri)).json();
};

export { fetchJSON };