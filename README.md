# libby-search

A [Claude Code](https://claude.com/claude-code) skill that checks whether a public
library's Libby / OverDrive collection has a title, and how available it is, using a
headless browser against the library's public catalog. No login; read-only.

Not affiliated with OverDrive or Libby.

## Install

    git clone git@github.com:scrawnylizard/libby-search.git ~/.claude/skills/libby-search
    cd ~/.claude/skills/libby-search && npm run setup
    mkdir -p ~/.config/libby-search && echo <your-library-key> > ~/.config/libby-search/library

Your library key is the `<key>` in `libbyapp.com/library/<key>`.

## Find your library key

The key is the short name OverDrive uses for your library's collection. It is not
in Libby's share links (`share.libbyapp.com/title/<id>` identifies only the title), so
read it from a browser session instead:

1. Open https://libbyapp.com in a web browser (desktop or phone browser, not the app).
2. Choose your library, or open it from **Menu → Libraries** if Libby is already set up.
3. Read the address bar. It changes to `https://libbyapp.com/library/<key>` — for
   example `libbyapp.com/library/yourlibrary` means the key is `yourlibrary`.

The same key names the library's public OverDrive catalog, `https://<key>.overdrive.com`,
which is the page this skill searches. Open it to confirm it is your library. Several
libraries often share one collection under a consortium name, so the key may not
match your library's own name.

## Use directly

    node scripts/search.js "The Canterbury Tales"

## What it can't do

Read-only and anonymous: no borrowing, holds, returns or account view. One library per
run, first results page only (up to 24), no filters. It reads an undocumented structure
on OverDrive's catalog page, so it can break when OverDrive changes the site; it then
says so rather than reporting "not found". Availability is a snapshot. OverDrive's terms
for scripted lookups haven't been reviewed, so keep use occasional and personal. Full list
in `SKILL.md`.

## With the Claude in Chrome extension

Not built or tested. Driving a browser where you are signed in to Libby could let Claude
borrow, place holds, return, renew and read your loans and holds, confirming each action
with you, and never touching your card number or PIN. This skill would still do the
finding; the extension would do the acting. See `SKILL.md`.

## License

MIT — see `LICENSE`.
