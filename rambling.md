# Supersite

Encyclopedia Radica (root)

Basically a distributed encyclopedia
- Not quite blockchain?

## See also

- IPFS
- Arweave
- Prolog

My vision goes beyond what these have provided.  
I can describe the content I know and love, so why should it be hard to find it?  
Why should it be hard to access it?  
Why should it cost money to sustain?  
Why can't I just host the content that I love?

- https://en.wikipedia.org/wiki/Alloy_(specification_language)
- https://www.theatlantic.com/technology/archive/2013/10/-wikipediaproblems-how-do-you-classify-everything/280178/

## Formalization

Encourage the duplication of information
ref: how this team designed their graphic engine - CppCon 2018: Stoyan Nikolov “OOP Is Dead, Long Live Data-oriented Design” - https://youtu.be/yy8jQgmhbAU


- Two atomic types, an item and a relationship
- Clients will have a list of well known type+versionrange that they will support
- Clients will have a renderer for each type
- renderer: relationship and item renderer


### Core

```ts
class Atom {
    type: string;
    version: string;
    id: (hash of value);
    value: string;
}
class Relationship {
    type: string;
    version: string;
    left: Atom;
    right: Atom;
}
```

### Example

```yaml
Atom:
    type: meme
    version: 1.0.0
    id: abc-cc-cc-dd

# Relationship:
#     type: author
#     version: 1.0.0
#     id: 000-000-000-000
#     left:
#         type: meme
#         version: 1.0.0
#         id: abc-cc-cc-dd
#     right:
#         type: author
#         version: 1.0.0
#         id: zz-dd-gg-aa

Relationship:
    type: contains
    version: 1.0.0
    id: 12310-21321-321-321
    left:
        type: meme
        version: 1.0.0
        id: abc-cc-cc-dd
    right:
        type: character
        version: 1.0.0
        id: dd-sc-by-12

Atom:
    type: character
    version: 1.0.0
    id: 1231-cc-hhg-dd

Relationship:
    type: localized name
    version: 1.0.0
    id: 123-2323-232
    left:
        type: character
        version: 1.0.0
        id: 1231-cc-hhg-dd
    right:
        type: literal value
        version: 1.0.0
        id: Crewmate

Relationship:
    type: language
    version: 1.0.0
    id: 43124321321-321-3213213
    left:
        type: localized value
        version: 1.0.0
        id: Crewmate
    right: 
        type: 

Relationship:
    type: localized value
    version: 1.0.0
    id: 999-123-fff-ggg
    left:
        type: name
        version: 1.0.0
        id: 111-dsa-13213-6544
    right:
        type: string literal
        version: 1.0.0
        id: Crewmate

Relationship:
    type: localized value language
    version: 1.0.0
    id: 1321321-532453256-75436
    left:
        type: localized value
        version: 1.0.0
        id: 111-dsa-13213-6544
    right:
        type: language
        version: 1.0.0
        id: 321321-fdsafdsklds-3423432-3434

Atom:
    type: language
    version: 1.0.0
    id: 321321-fdsafdsklds-3423432-3434

Atom:
    type: name
    version: 1.0.0
    id: 321321-fdsafdsklds-3423432-3434

Relationship:
    type: localized value
    version: 1.0.0
    id: 1321321-45325432652-354243243
    left:
        type: name
        version: 1.0.0
        id: 321321-fdsafdsklds-3423432-3434
    right:
        type: string literal
        veresion: 1.0.0
        id: "English"

```

### Key resolution

Users have imperfect knowledge of the schema. It is important to have tools to elable users to write queries as they would expect, but we must convert it to well known types


### Data cleanup

Alloy as a model checker can help describe the data to find if things could be improved