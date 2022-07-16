import { knownTypes } from "../models/known-types";
import type { Either, Thing } from "../models/core";
import type { Store } from "./store";
import { thing, rel, meta, name, transcribe, link } from "../models/helpers";

export function addData(store: Store) {
	function add(...items: Either[]): Either[] {
		items.forEach(x => store.add(x));
		return items;
	}

	const types: Record<string, Thing> = {};
	for (const type of Object.values(knownTypes)) {
		const t = thing(knownTypes.type, type.id);
		add(t);
		types[type.id] = t;
	}

	const en = thing(knownTypes.language);
	add(en);
	add(...name(en, en, "English").all);

	{
		const meme = thing(knownTypes.meme);
		add(meme);
		add(...meta(meme, new Date("2021-05-22T14:59-04:00")).all)

		add(...name(meme, en, "Scooby schwee").all);

		const video = thing(knownTypes.video);
		add(video);

		let _link = link(
			video,
			"https://cdn.discordapp.com/attachments/896865917378633779/992575063826104411/whats_wrong_scooby_doo.mp4",
		);
		add(..._link.all);

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

		let content = `(speaking Japanese)
Lain: "What's wrong?"
Unknown: "It's nothing. Forget about it."
The unknown character walks away up a set of stairs.
Lain turns to see Scooby Doo sitting on the ground.
Scooby Doo transforms into a car while saying "A-schweee".
Shaggy hops into the car, and it drives off the right of the frame.
Cuts to Lain looking slightly surprised.`;
		add(...transcribe(meme, en, content).all);

		let style = thing(knownTypes.style);
		add(style);
		add(...name(style, en, "Cel Animation").all);
		add(rel(meme, knownTypes.style, style));

		style = thing(knownTypes.style);
		add(style);
		add(...name(style, en, "Anime").all);
		add(rel(meme, knownTypes.style, style));
	}
}
