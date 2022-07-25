export const a = {
	z: 4,
	t: "asd",
};

export const knownTypes = {
	string: "string",
	number: "number",
	type: "type",

	metadata: "metadata",

	hash: "hash",
	algorithm: "algorithm",
	password: "password",
	salt: "salt",
	slug: "slug",
	user: "user",

	date: "date",
	date_created: "date created",
	datetime: "datetime",

	translation: "translation",
	video: "video",
	uri: "uri",
	transcript: "transcript",
	character: "character",
	name: "name",
	language: "language",
	style: "style",
	tag: "tag",
} as const;

export type KnownTypes = typeof knownTypes;
export type KnownType = KnownTypes[keyof KnownTypes];
