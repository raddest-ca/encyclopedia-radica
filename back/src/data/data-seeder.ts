import { knownTypes } from "../models/known-types";
import { createHash } from "crypto";
import type { Atom, Either, Relationship, Thing, Type } from "../models/core";
import type { Store } from "../models/store";

import { thing, string, rel, translate, id, meta, name, transcribe, link } from "../models/helpers";

export function addData(store: Store) {
	function add(...items: Either[]): Either[] {
		items.forEach(x => store.add(x));
		return items;
	}

	const types: Record<string, Thing> = {};
	for (const type of Object.values(knownTypes)) {
		const t = thing(knownTypes.type);
		add(t);
		add(...id(t, type.id).all);
		types[type.id] = t;
	}

	const en = thing(knownTypes.language);
	add(en);
	add(...name(en, en, "English").all);

	{
		const meme = thing(knownTypes.meme);
		add(meme);

		add(...name(meme, en, "Scooby schwee").all);

		const video = thing(knownTypes.video);
		add(video);
		add(
			...link(
				video,
				"https://cdn.discordapp.com/attachments/896865917378633779/992575063826104411/whats_wrong_scooby_doo.mp4",
			).all,
		);

		const lain = thing(knownTypes.character);
		add(lain);
		add(...name(lain, en, "Lain").all);
		add(rel(meme, knownTypes.character, lain));

		const scooby = thing(knownTypes.character);
		add(scooby);
		add(...name(scooby, en, "Scooby Doo").all);
		add(rel(meme, knownTypes.character, scooby));

		const shaggy = thing(knownTypes.character);
		add(shaggy);
		add(...name(shaggy, en, "Shaggy").all);
		add(rel(meme, knownTypes.character, shaggy));

		const transcript = transcribe(
			meme,
			en,
			`
(speaking Japanese)
Lain: "What's wrong?"
Unknown: "It's nothing. Forget about it."
The unknown character walks away up a set of stairs.
Lain turns to see Scooby Doo sitting on the ground.
Scooby Doo transforms into a car while saying "A-schweee".
Shaggy hops into the car, and it drives off the right of the frame.
Cuts to Lain looking slightly surprised.
		`,
		);

		let style = thing(knownTypes.style);
		add(style);
		add(...name(style, en, "Cel Animation").all);
		add(rel(meme, knownTypes.style, style));

		style = thing(knownTypes.style);
		add(style);
		add(...name(style, en, "Cel Animation").all);
		add(rel(meme, knownTypes.style, style));
	}

	// {
	// 	const trans: Transformer = {
	// 		id: "phrase 2 word",
	// 		predicate: (x) => isThing(x) && x.type === knownTypes.transcript,
	// 		transform: (x) => x,
	// 	};
	// 	const transThing = thing(knownTypes.transformer);
	// 	id(transThing, trans.id);
	// 	store.addTransformer(trans);
	// }

	// {

	// 	const t = store.addTransformer({
	// 		id: "literal hash base64",
	// 		apply: (x: Thing) => createHash("sha256").update(x.id).digest("base64"),
	// 	});

	// 	const trans = thing(knownTypes.transformer);
	// 	add(trans);
	// 	add(...id(trans, "literal hash base64"));

	// 	const sig = thing(knownTypes.funcsig);
	// 	add(sig);
	// 	add(rel(trans, knownTypes.funcsig, sig));

	// 	const input = thing(knownTypes.input);
	// 	add(input);
	// 	add(rel(sig, knownTypes.input, input));
	// 	add(rel(input, knownTypes.type, types[knownTypes.literal.id]));

	// 	const out = thing(knownTypes.output);
	// 	add(out);
	// 	add(rel(sig, knownTypes.output, out));
	// 	add(rel(out, knownTypes.type, types[knownTypes.literal.id]));
	// }

	// {
	// 	const unit = thing(knownTypes.unit);
	// 	add(unit);
	// 	add(...name(unit, en, "Days"))
	// }
}
