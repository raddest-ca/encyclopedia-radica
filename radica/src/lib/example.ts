import { v4 as uuid } from "uuid";
import { knownTypes } from "./known-types";

export function addData(store: Store) {
	function literal(value: Atom) {
		return {
			type: knownTypes.literal,
			id: value,
		} as Thing;
	}
	
	function thing(type: Type) {
		const rtn: Thing = {
			type,
			id: uuid(),
		}
		store.things.push(rtn);
		return rtn;
	}

	function rel(left: Thing, nature: Type,  right: Thing) {
		const x = { version: "1.0.0", nature, left, right, } as Relationship;
		store.things.push(x);
		return x;
	}

	function phrase(language: Thing, value: Atom) {
		const x = literal(value);
		store.things.push(x);
		rel(x, knownTypes.language, language);
		return x;
	}

	function name(it: Thing, language: Thing, nickname: Atom) {
		rel(it, knownTypes.name, phrase(language, nickname));
	}

	function feature(it: Thing, ...features: Thing[]) {
		features.forEach(x => rel(it, knownTypes.feature, x));
	}

	function transcribe(it: Thing, ...phrases: Thing[]) {
		const trans = thing(knownTypes.transcript);
		phrases.forEach(p => rel(trans, knownTypes.feature, p));
		rel(it, knownTypes.transcript, trans);
		return trans;
	}

	const en = thing(knownTypes.language);
    name(en, en, "English");

	const enja = thing(knownTypes.language);
	name(enja, en, "Romanized Japanese");

	{
		const meme = thing(knownTypes.meme);
	
		const lain = thing(knownTypes.character);
		name(lain, en, "Lain");
		feature(meme, lain);
	
		const scooby = thing(knownTypes.character);
		name(scooby, en, "Scooby Doo");
		feature(meme, scooby);
	
		const shaggy = thing(knownTypes.character);
		name(shaggy, en, "Shaggy");
		feature(meme, shaggy);
	
		const transcript = transcribe(meme);
		feature(transcript, phrase(en, `A character speaking Japanese is talking to Lain: subtitled "It's nothing. Forget about it." The character walks away up a set of stairs. Lain turns to see Scooby Doo sitting on the ground. Scooby Doo transforms into a car while saying "A-schweee", Shaggy hops into the car, and it drives off the right of the frame.`));
	
		const style = thing(knownTypes.style);
		name(style, en, "Cel Animation");
		feature(meme, style);
	}
}
