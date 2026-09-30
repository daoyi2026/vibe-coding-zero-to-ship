# Data basics

Start from what the user expects data to do, not from a preferred database technology.

## Decision ladder

Ask or infer only what matters:

1. Must the data survive a page refresh?
2. Must it survive closing and reopening on the same device?
3. Must it appear on another device?
4. Do multiple users need separate/private data?
5. Are large files such as images, audio, video, or documents involved?
6. Is the data sensitive or important enough to require stronger protection or backup?

## Common options

- **Temporary app state:** only while the current experience is running.
- **Browser/local persistence:** useful for simple single-device personal tools.
- **Cloud database:** useful for cross-device sync, shared data, or multi-user products.
- **Object/file storage:** appropriate for uploaded media/documents rather than large database fields.

## Beginner explanations

Browser storage:
> Like keeping a notebook inside this browser on this device.

Cloud database:
> Like keeping the information on an online service so the product can retrieve it from different devices.

File storage:
> Like an online folder designed for files rather than rows of app data.

## Important misconceptions

- Seeing data on screen does not prove it is saved.
- Uploading source code to GitHub does not store app users' runtime data there.
- Login identifies a user; it does not by itself ensure that user's records are private.
- Do not add a cloud database merely because it sounds more professional.

Prefer the simplest option that satisfies current requirements and can be upgraded when requirements genuinely change.
