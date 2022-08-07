import { KnownType, knownTypes } from "../common/known-types";
import type { Either, Thing } from "../common/core";
import type { Store } from "./store";
import { thing, rel, meta, name, transcribe, link } from "../models/helpers";

export function addData(store: Store) {
	const add = store.addAll.bind(store);

	const types: Record<string, Thing<KnownType>> = {};
	for (const type of Object.values(knownTypes)) {
		const t = thing("type", type);
		add(t);
		types[type] = t;
	}

	const en = thing("language", "en-CA");
	add(en);
	add(...name(en, en, "English").all);

	const meme = thing("tag", "meme");
	add(meme);

	{		
		const video = thing("video");
		add(video);
		add(...meta(video, new Date("2021-05-22T14:59-04:00")).all)
		add(...name(video, en, "Scooby schwee").all);

		let _link = link(
			video,
			"https://cdn.discordapp.com/attachments/896865917378633779/992575063826104411/whats_wrong_scooby_doo.mp4",
		);
		add(..._link.all);

		add(rel(video, "tag", meme));

		const lain = thing("character");
		add(lain);
		add(...name(lain, en, "Lain").all);
		add(rel(video, "character", lain));

		const scooby = thing("character");
		add(scooby);
		add(...name(scooby, en, "Scooby Doo").all);
		add(rel(video, "character", scooby));

		const shaggy = thing("character");
		add(shaggy);
		add(...name(shaggy, en, "Shaggy").all);
		add(rel(video, "character", shaggy));

		let content = `(speaking Japanese)
Lain: "What's wrong?"
Unknown: "It's nothing. Forget about it."
The unknown character walks away up a set of stairs.
Lain turns to see Scooby Doo sitting on the ground.
Scooby Doo transforms into a car while saying "A-schweee".
Shaggy hops into the car, and it drives off the right of the frame.
Cuts to Lain looking slightly surprised.`;
		add(...transcribe(video, en, content).all);

		let style = thing("style");
		add(style);
		add(...name(style, en, "Cel Animation").all);
		add(rel(video, "style", style));

		style = thing("style");
		add(style);
		add(...name(style, en, "Anime").all);
		add(rel(video, "style", style));
	}
}
