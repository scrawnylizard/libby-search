---
name: libby-search
description: Check whether a public library's Libby / OverDrive collection has a book, audiobook or magazine, and how available it is right now (copies owned, copies free, holds, estimated wait), with links to open each title in Libby or the library's catalog. Uses a headless browser against the library's public catalog — no login, no library card, no borrowing. Use whenever the user asks "is X on Libby", "does the library have X", "can I borrow X", "how long is the wait for X", or wants a Libby link for a title.
---

# libby-search

Read-only search of a library's public OverDrive catalog (the collection Libby shows).
It cannot borrow, place holds, or see the user's account — those need the user's own
Libby login. Hand back the links and let the user act.

## Run

    node ~/.claude/skills/libby-search/scripts/search.js "<query>" [library-key]

The library key is the `<key>` in `libbyapp.com/library/<key>`. Without an argument the
script uses `$LIBBY_LIBRARY`, then the first line of `~/.config/libby-search/library`.
If none is set, ask the user to open libbyapp.com in a browser, pick their library, and
read the key from the address bar.

Output: the search URL, the page's result count, then one JSON line per result with
`title`, `creators`, `type`, `available`, `owned`, `availableCopies`, `holds`, `waitDays`,
`libby` and `catalog` links.

## Reporting

- A keyword search matches loosely. Separate the editions that are actually the requested
  work from unrelated matches, and say how many of each.
- A result with `available: true` and no `owned` count is usually an always-available
  (often public-domain) copy — say "usually", it is not guaranteed.
- `waitDays` is the library's estimate at the time of the search, nothing firmer.
- Only the first results page is read (OverDrive shows up to 24). If the count says more
  exist, say so and suggest a more specific query.
- If the script prints `NO ITEM DATA EXTRACTED` or `FAILED`, report that the check did not
  work. Never report it as "the library doesn't have it".

## Setup (once)

    cd ~/.claude/skills/libby-search && npm run setup

Installs Playwright and its headless Chromium (~570 MB, in `~/Library/Caches/ms-playwright`
on macOS).
