import { Atom, Either, Relationship, Thing, Type } from "./core";
import { knownTypes } from "./known-types";
import { v4 as uuid } from "uuid";

type HelperResult = {
	ref: Record<string, HelperResult | Either>;
	all: Either[];
};

export function thing(type: Type, id: string | null = null): Thing {
	return {
		type,
		id: id === null ? uuid() : id,
	};
}

export function string(value: Atom): Thing {
	return thing(knownTypes.string, value);
}

export function rel(left: Thing, type: Type, right: Thing): Relationship {
	return { type, left, right };
}

export function id(it: Thing, id: Atom) {
	const _id = string(id);
	const _rel = rel(it, knownTypes.identifier, _id);

	return {
		ref: {
			id: _id,
			rel: _rel,
		},
		all: [_id, _rel],
	};
}

export function meta(it: Thing): Either[] {
	const _meta = thing(knownTypes.metadata);
	const _rel = rel(it, knownTypes.metadata, _meta);
	const dat = thing(knownTypes.date);
	return [_meta, _rel];
}

export function translate(language: Thing, value: Atom) {
	const trans = thing(knownTypes.translation);
	const str = string(value);
	const _rel = rel(trans, knownTypes.language, language);

	const rtn = {
		ref: {
			trans,
			str,
			rel: _rel,
		},
		all: [trans, str, _rel],
	};
    return rtn as HelperResult & typeof rtn;
}

export function name(it: Thing, language: Thing, nickname: Atom) {
	const _trans = translate(language, nickname);
	const _rel = rel(it, knownTypes.name, _trans.ref.trans as Thing);
	const rtn = {
        ref: {
            trans: _trans,
            rel: _rel
        },
        all: [_rel, ..._trans.all],
    };
    return rtn as HelperResult & typeof rtn;
}

export function transcribe(it: Thing, language: Thing, value: string) {
    const translation = translate(language, value);
    const _rel = rel(it, knownTypes.transcript, translation.ref.trans);
    const rtn = {
        ref: {
            trans: translation,
            rel: _rel
        },
        all: [translation, _rel],
    };
    return rtn as HelperResult & typeof rtn;
}

export function link(it: Thing, ...uris: Atom[]) {
	const _uris = uris.map(x => string(x));
	const rels = _uris.map(x => rel(it, knownTypes.uri, x));
	
    const rtn = {
        ref: {
            uris: _uris,
            rels: rels,  
        },
        all: [..._uris, ...rels],
    };
    return rtn as HelperResult & typeof rtn;

}
