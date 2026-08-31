# vscode-tui-language-support

This is an extension for the code editor [**VS Code**](https://code.visualstudio.com/) that adds language support for the programming language [**tui**](https://github.com/mjdave/tui).

You can find out more about the current development of the project by visiting the [extension repository on GitHub](https://github.com/pythooonuser/vscode-tui-language-support/).

## Features

The **tui** language extension currently adds the following features:

- Comment Toggling
- Bracket Autoclosing
- Bracket Autosurrounding
- Code Section Folding
- Indentation Rules
- Syntax Highlighting
- **NEW!** Diagnostics (experimental!)
- **NEW!** Hover Support (experimental!)
- **NEW!** Formatting (experimental!)

For the future some more features are planned.

_Please note that development goes slowly since this is a free-time project only._

## Settings

Currently, we only provide basic formatting options, e.g. the characters to use for nullable types or table delimiters.

## Feedback

_If you find a bug, have a question or feature request, [please feel free to create an issue](https://github.com/PythooonUser/vscode-tui-language-support/issues/new) or [reach out to me on BlueSky](https://bsky.app/profile/pythooonuser.bsky.social). I try to answer your issue as fast as possible. Please note, however, that my support for this extension is limited, because I'm building it in my free time and therefore development goes slowly._

## Release Notes

For further details please refer to the [CHANGELOG](https://github.com/PythooonUser/vscode-tui-language-support/blob/main/CHANGELOG.md).

## Development

Clone the repository. Make sure to run the latest `node` version and use `$ npm install` to grab all necessary dependencies. Then hit `F5` in VSCode to open up a new VSCode instance with the extension loaded.

Make sure to always add tests, which can be run by `$ npm test`. In order to ease writing tests we provide a bunch of `utils:*` commands for the various stages of the extension, e.g. lexer, parser, linter, etc.

Deployment packages the extension for publishing on the VSCode marketplace, use `$ vsce package` or `$ vsce publish` _(ask maintainer for credentials)_.

## License

MIT. See the [license document](https://github.com/PythooonUser/vscode-tui-language-support/blob/main/LICENSE) for the full text.
