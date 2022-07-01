const version = "1.0.0";

// prettier-ignore
export const knownTypes = {
	literal:		{ id: "literal", 				version },

	type:			{ id: "type", 					version },
	identifier:		{ id: "id", 					version },
	hash:			{ id: "hash", 					version },

	// set:			{ id: "set", 					version },
	// member:			{ id: "member",					version	},

	transformer:	{ id: "transformer", 			version },
	funcsig:		{ id: "function signature",		version },
	input:			{ id: "input", 					version },
	output:			{ id: "output",					version },
	constraint:		{ id: "constraint",	 			version },
	feature:		{ id: "feature", 				version },

	character:		{ id: "cartoon character", 		version },
	name:			{ id: "nickname", 				version },
	language:		{ id: "language", 				version },
	
	transcript:		{ id: "transcript", 			version },
	style:			{ id: "style", 					version },

	meme:			{ id: "meme", 					version },
};

// export type KnownType = typeof knownTypes[keyof typeof knownTypes];