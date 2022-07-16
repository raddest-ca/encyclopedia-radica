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

James Burke had a similar idea, but not quite as inspired by piracy as mine
- regarding wikipedia: "The key problem of the internet: how do you know you can trust it?"
    - Answer: does it matter? I just want to pirate movies
    - "In for a period of **transitional confusion** in spades" (emphasis mine)
- "Technology will empower diversity because it will make it easier to express yourself"
- "Centralized sources of information are dead and they don't know it"
- https://youtu.be/gvIy52kX-uU

## Formalization

Encourage the duplication of information
ref: how this team designed their graphic engine - CppCon 2018: Stoyan Nikolov “OOP Is Dead, Long Live Data-oriented Design” - https://youtu.be/yy8jQgmhbAU


- Two atomic types, an item and a relationship
- Clients will have a list of well known type+versionrange that they will support
- Clients will have a renderer for each type
- renderer: relationship and item renderer


### Key resolution

Users have imperfect knowledge of the schema. It is important to have tools to elable users to write queries as they would expect, but we must convert it to well known types

OR

just learn the system lol

### Data cleanup

Alloy as a model checker can help describe the data to find if things could be improved


### Examples

- Movies are just Videos with more metadata
- CAMRIP vs theatrical vs directors-cut, all different _Videos_, sharing most metadata

- Discord users in guilds, etc
- Web interface for managing guilds instead of bot commands?

### CRUD

