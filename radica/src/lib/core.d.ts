type Atom = string;

class Type {
    id: Atom;
    version: Atom;
}

class Thing {
    type: Type;
    id: Atom;
}

class Relationship {
    version: Atom;
    nature: Type;
    left: Thing;
    right: Thing;
}