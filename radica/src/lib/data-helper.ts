import type { Either, Relationship, Thing } from "./core";

export function toMap<T,Y>(list: T[], propGetter: (v:T) => string, valueGetter: (v:T) => Y) {
    return list.reduce((map, v) => {
        map.set(propGetter(v), v);
        return map;
    }, new Map<string, Y>());
}

export function mapRelationship(rels: Relationship[]) {
    return rels.reduce((map, v) => {
        map.set(v.left.id, v.right.id);
        return map;
    }, new Map<string, string>);
}

// export function join(things: Thing[], rels: Relationship[], side: "left" | "right") {
//     const keys = things.reduce((map,v) => {
//         map[v.id] = v;
//         return map;
//     },{} as Record<string, Either>);
//     const offSide = side === "left" ? "right" : "left";
//     return rels.map(rel => keys[rel[side].id]);
// }