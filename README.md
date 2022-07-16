# encyclopedia-radica

"If you wish to make an apple pie from scratch, you must first invent the universe" - Carl Sagan

A categorization of things I find interesting.

According to Wikipedia and Google Translate, Radica means "root", which is a happy coincidence since I want the name to match Raddest.

## What is it?

A data format and surrounding protocols.

Have you ever thought of a meme, song, or some other _thing_ that you could describe, but not find online?  
With Encyclopedia Radica, you can categorize what is important to you.  
You can discover what is important to you.  
You can _view_ what is important to you.

People always say: "once it's on the internet, it's available forever".  
I want to make this true.

## Notes to self

- Designed to operate with multiple sources
- Easy mechanism to copy between sources
- Easy mechanism to distribute datasets

- Querying
    - What pieces of data match a set of constraints
- Reverse querying
    - What sources are distributing a piece of data

### Common types

- Music
- Movies
- Meme
- Videos
- Articles
- Download link

### Default tooling

#### Data store

- Adding
- Querying
- Abstraction

#### Privacy

- Authentication methods: easy to make a private node

#### Browsing

- Visualization modules for common types
    - Component system (svelte, duh)
    - Action system
        - "Add to my site", triggerable from component

#### Transfer: Distributing, Gathering

Tools for hasing sets of content for validation
- Inherently unordered
- Just hash each piece, sort, and hash the hashes?
