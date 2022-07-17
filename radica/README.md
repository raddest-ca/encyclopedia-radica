# Frontend

## Routing

- Cards mobile responsive, table vs fullscreen card

### /things/type

- L

### /things/type/[id]

- Lists versions of the type that are in use

### /things/[type]

- Lists cards for each ID using the type
    - Only show card for most recent version
<!-- - All versions for the type -->

### /things/[type]/[id]

- List the type versions for this resource
- If only one => say so, meta-refresh after 3 seconds

### /things/[type]/[id]/[version]

- Render item
- "See previous/other versions" => href=..