import { v4 as uuid } from "uuid";
import { knownTypes } from "./known-types";
import { createHash } from "crypto";
import type { Atom, Either, Relationship, Thing, Type } from "./core";
import type { Store } from "./store";

function literal(value: Atom): Thing {
	return {
		type: knownTypes.literal,
		id: value,
	};
}

function thing(type: Type): Thing {
	return {
		type,
		id: uuid(),
	};
}

function rel(left: Thing, type: Type, right: Thing): Relationship {
	return { type, left, right };
}

function phrase(language: Thing, value: Atom): Either[] {
	const x = literal(value);
	return [x, rel(x, knownTypes.language, language)];
}

function id(it: Thing, id: Atom): Either[] {
	const _id = literal(id);
	return [_id, rel(it, knownTypes.identifier, _id)];
}

function name(it: Thing, language: Thing, nickname: Atom): Either[] {
	const p = phrase(language, nickname);
	const r = rel(it, knownTypes.name, p[0] as Thing);
	return [r, ...p];
}

function feature(it: Thing, ...features: Thing[]): Relationship[] {
	return features.map((x) => rel(it, knownTypes.feature, x));
}

function transcribe(it: Thing, ...phrases: Thing[]): Either[] {
	const trans = thing(knownTypes.transcript);
	const transRel = rel(it, knownTypes.transcript, trans);
	const transFt = phrases.map((p) => rel(trans, knownTypes.feature, p));
	return [trans, transRel, ...transFt];
}

export function addData(store: Store) {
	function add(...items: Either[]): Either[] {
		items.forEach((x) => store.add(x));
		return items;
	}

	const types: Record<string, Thing> = {};
	for (const type of Object.values(knownTypes)) {
		const t = thing(knownTypes.type);
		add(t);
		add(...id(t, type.id));
		types[type.id] = t;
	}

	const en = thing(knownTypes.language);
	add(en);
	add(...name(en, en, "English"));

	const enja = thing(knownTypes.language);
	add(enja);
	add(...name(enja, en, "Romanized Japanese"));

	{
		const meme = thing(knownTypes.meme);
		add(meme);

		const lain = thing(knownTypes.character);
		add(lain);
		add(...name(lain, en, "Lain"));
		add(...feature(meme, lain));

		const scooby = thing(knownTypes.character);
		add(scooby);
		add(...name(scooby, en, "Scooby Doo"));
		add(...feature(meme, scooby));

		const shaggy = thing(knownTypes.character);
		add(shaggy);
		add(...name(shaggy, en, "Shaggy"));
		add(...feature(meme, shaggy));

		const transcript = transcribe(meme);
		add(...transcript);
		const p = phrase(
			en,
			`A character speaking Japanese is talking to Lain: subtitled "What's wrong? It's nothing. Forget about it." The character walks away up a set of stairs. Lain turns to see Scooby Doo sitting on the ground. Scooby Doo transforms into a car while saying "A-schweee", Shaggy hops into the car, and it drives off the right of the frame.`,
		);
		add(...p);
		add(...feature(transcript[0] as Thing, p[0] as Thing));

		const style = thing(knownTypes.style);
		add(style);
		add(...name(style, en, "Cel Animation"));
		add(...feature(meme, style));
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

	{

		const t = store.addTransformer({
			id: "literal hash base64",
			apply: (x: Thing) => createHash("sha256").update(x.id).digest("base64"),
		});

		const trans = thing(knownTypes.transformer);
		add(trans);
		add(...id(trans, "literal hash base64"));

		const sig = thing(knownTypes.funcsig);
		add(sig);
		add(rel(trans, knownTypes.funcsig, sig));
		
		const input = thing(knownTypes.input);
		add(input);
		add(rel(sig, knownTypes.input, input));
		add(rel(input, knownTypes.type, types[knownTypes.literal.id]));

		const out = thing(knownTypes.output);
		add(out);
		add(rel(sig, knownTypes.output, out));
		add(rel(out, knownTypes.type, types[knownTypes.literal.id]));
	}
}
