type Atom = string;

class Thing {
    type: Atom;
    version: Atom;
    id: Atom;
}

class Relationship extends Thing {
    left: Thing;
    right: Thing;
}