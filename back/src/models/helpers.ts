import { Either, Relationship, Thing } from "../common/core";
import { KnownType } from "../common/known-types";
import { v4 as uuid } from "uuid";
import { toIsoString } from "../jshelpers";

type HelperResult = {
	ref: Record<string, HelperResult | Either>;
	all: Either[];
};

export function thing(type: KnownType, id: string | null = null): Thing<KnownType> {
	return {
		type,
		id: id === null ? uuid() : id,
	};
}

export function string(value: string): Thing<KnownType> {
	return thing("string", value);
}

export function rel(left: Thing<KnownType>, type: KnownType, right: Thing<KnownType>): Relationship<any,any,any> {
	return { type, left, right };
}

export function meta(it: Thing<KnownType>, date: Date | null = null) {
	const _meta = thing("metadata");
	const _rel = rel(it, "metadata", _meta);
	const dat = thing("datetime", toIsoString(date??new Date()));
	const dateRel = rel(_meta, "date created", dat);
	const rtn = {
        ref: {
            meta: _meta,
            rel: _rel,
            date: dat,
            dateRel,
        },
        all: [_meta, _rel, dat, dateRel],
    } 
    return rtn as HelperResult & typeof rtn;
}

export function translate(language: Thing<KnownType>, value: string) {
	const trans = thing("translation");
	const str = string(value);
	const _rel = rel(trans, "language", language);

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

export function name(it: Thing<KnownType>, language: Thing<KnownType>, nickname: string) {
	const _trans = translate(language, nickname);
	const _rel = rel(it, "name", _trans.ref.trans);
	const rtn = {
        ref: {
            trans: _trans,
            rel: _rel
        },
        all: [_rel, ..._trans.all],
    };
    return rtn as HelperResult & typeof rtn;
}

export function transcribe(it: Thing<KnownType>, language: Thing<KnownType>, value: string) {
    const translation = translate(language, value);
    const _rel = rel(it, "transcript", translation.ref.trans);
    const rtn = {
        ref: {
            trans: translation,
            rel: _rel
        },
        all: [translation, _rel],
    };
    return rtn as HelperResult & typeof rtn;
}

export function link(it: Thing<KnownType>, uri: string) {
	const str = string(uri);
	const _rel = rel(it, "uri", str);
	
    const rtn = {
        ref: {
            rel: _rel,
            str: str,
        },
        all: [str, _rel],
    };
    return rtn as HelperResult & typeof rtn;
}
