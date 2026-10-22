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

## Limitations

- **Read-only, no account.** It cannot borrow, place or cancel holds, return, renew, or
  see the user's loans, holds, tags or history.
- **One library per run.** A user with several library cards needs one run per key.
- **First results page only** (up to 24), and no format, language or availability filters.
- **Depends on an undocumented page structure.** It reads `window.OverDrive.mediaItems`
  from the catalog page. If OverDrive changes that, the script reports
  `NO ITEM DATA EXTRACTED` rather than a wrong answer — but it will stop working.
- **A snapshot.** Availability changes minute to minute; `waitDays` is the library's
  estimate. Magazine availability can also change month to month with the library's budget.
- **Links are built, not visited.** `libby` and `catalog` links use known URL patterns;
  the Libby share link may ask the user to pick their library first.
- **Automated access.** OverDrive's terms for scripted use of public catalog pages have not
  been reviewed. Keep it to occasional personal lookups, never bulk crawling.
- **Footprint.** Needs Node and a ~570 MB headless Chromium.

## With the Claude in Chrome extension (not built, not tested)

If the user has the Claude in Chrome extension and is signed in to Libby in that browser,
Claude could act in their own session instead of a blank headless one. That would
potentially allow: borrowing, placing and cancelling holds, returning and renewing loans,
reading their current loans, holds and wait positions, managing tags, and switching
between their library cards — all without Claude ever handling a card number or PIN.

None of that is part of this skill. If the user asks for it:
- Say that it needs the extension, and confirm it is installed and allowed on libbyapp.com.
- It acts on the user's personal account: confirm each borrow, hold, return or cancel
  for a named title before clicking, one at a time.
- Use this skill first to find the edition and availability, then the extension to act.
