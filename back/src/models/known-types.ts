export const knownTypes = {
	string: "string",
	number: "number",
	type: "type",
	metadata: "metadata",
	hash: "hash",
	translation: "translation",
	date: "date",
	datetime: "datetime",
	video: "video",
	uri: "uri",
	transcript: "transcript",
	character: "character",
	name: "name",
	language: "language",
	style: "style",
	tag: "tag",
	user: "user",
};

export type KnownType = keyof typeof knownTypes;
