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

## Use directly

    node scripts/search.js "The Canterbury Tales"

## License

MIT — see `LICENSE`.
