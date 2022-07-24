const version = "1.0.0";

export const knownTypes = {
	string: { id: "string", version },
	number: { id: "number", version },
	type: { id: "type", version },
	identifier: { id: "id", version },
	metadata: { id: "metadata", version },
	hash: { id: "hash", version },
	translation: {id: "translation", version},

	date: { id: "date", version },
	datetime: { id: "datetime", version },

	video: { id: "video", version },
	uri: { id: "uri", version },

	transcript: { id: "transcript", version },

	character: { id: "character", version },
	name: { id: "name", version },
	language: { id: "language", version },

	style: { id: "style", version },
	tag: { id: "tag", version },

};

// export type KnownType = typeof knownTypes[keyof typeof knownTypes];
