# Blockly

Ahoy! Google's Blockly be a grand treasure chest of a library that adds a visual code editor to web and mobile apps. The Blockly editor uses interlocking, graphical blocks to represent code concepts like variables, logical expressions, loops, and more. It allows any buccaneer to apply programm'n principles without havin' to worry about syntax or the intimidation of a blinking cursor on the command line. All this code is free booty and open source!

![](https://developers.google.com/blockly/images/sample.png)

## Hoist the Sails with Blockly

Blockly has many treasure maps for learnin' how to use the library. Start at our [Google Developers Site](https://developers.google.com/blockly) to read the ship's logs on how to get started, configure Blockly, and integrate it into your very own vessel. The developers site also contains charts leadin' to:

- [Gettin' Started article](https://developers.google.com/blockly/guides/get-started/web)
- [Gettin' Started codelab](https://blocklycodelabs.dev/codelabs/getting-started/index.html#0)
- [More codelabs](https://blocklycodelabs.dev/)
- [Demos and plugins](https://google.github.io/blockly-samples/)

Help us chart our course by tellin' us [what ye be doin' with
Blockly](https://developers.google.com/blockly/registration). This questionnaire only takes
a few moments and will help us better support the Blockly fleet.

### Gettin' the Ship Seaworthy

Blockly be [available on npm](https://www.npmjs.com/package/blockly) for any pirate with the right tools.

```bash
npm install blockly
```

For more information on installin' and usin' Blockly, see the [Gettin' Started article](https://developers.google.com/blockly/guides/get-started/web).

### Needin' a Hand?

- [Report a Kraken (bug)](https://developers.google.com/blockly/guides/modify/contribute/write_a_good_issue) or file a feature request on GitHub
- Ask a question, or search other pirates' questions, on our [developer forum](https://groups.google.com/forum/#!forum/blockly). Ye can also drop by to say "ahoy" and show us yer prototypes; collectively we have a lot of experience and can offer hints which will save ye time. We actively monitor the forums and typically respond to questions within 2 workin' days.

### The Treasure Trove: blockly-samples

We have a number of resources such as example code, demos, and plugins in another treasure chest called [blockly-samples](https://github.com/google/blockly-samples/). A plugin be a self-contained piece of code that adds functionality to Blockly. Plugins can add fields, define themes, create renderers, and much more. For more information, see the [Plugins documentation](https://developers.google.com/blockly/guides/plugins/overview).

## Lend a Hand, Matey!

Want to make Blockly a more fearsome vessel? We welcome all hands on deck to help with pull requests, Kraken reports, ship's logs (documentation), answers on the forum, and more! Check out our [Contributing Guidelines](https://developers.google.com/blockly/guides/modify/contributing) for more information. Ye might also want to look for issues tagged "[Help Wanted](https://github.com/google/blockly/labels/help%20wanted)" which be issues we think would be grand for new recruits to help with.

## Distributin' the Booty

We release new treasures by pushin' the latest code to the master branch, followed by updatin' the npm package, our [ship's logs](https://developers.google.com/blockly), and [demo pages](https://google.github.io/blockly-samples/). If there be any Kraken-sized bugs, such as a crash when performin' a standard action or a renderin' issue that makes Blockly unusable, we'll cherry-pick fixes to master between releases to fix 'em. The [releases page](https://github.com/google/blockly/releases) has a list of all our plunders.

We use [semantic versioning](https://semver.org/). Releases that have breakin' changes or are otherwise not backwards compatible will have a new major version. Patch versions be reserved for bug-fix patches between scheduled releases.

We now have a [beta release on npm](https://www.npmjs.com/package/blockly?activeTab=versions). If ye'd like to test the upcomin' release, or try out a not-yet-released new contraption, ye can use the beta channel with:

```bash
npm install blockly@beta
```

As it be a beta channel, it may be less stable, and the APIs there be subject to change.

### The Ship's Masts

There be two main masts on this ship.

**[master](https://github.com/google/blockly)** - This be the (mostly) stable current release of Blockly, our flagship.

**[develop](https://github.com/google/blockly/tree/develop)** - This be the crow's nest, where most of our work happens. Pull requests should always be made against develop. This branch will generally be usable, but may be less stable than the master branch. Once somethin' is in develop we expect it to merge to master in the next release.

**other branches:** - Larger changes may have their own branches until they be good enough for people to try out. These will be developed separately until we think they be almost ready for release. These branches typically get merged into develop immediately after a release to allow extra time for testin'.

### Newfangled Contraptions (APIs)

Once a new contraption (API) is merged into master it be considered beta until the followin' release. We generally try to avoid changin' an API after it has been merged to master, but sometimes we need to make changes after seein' how an API is used. If an API has been around for at least two releases we'll do our best to avoid breakin' it.

Unreleased contraptions may change radically. Anythin' that is in `develop` but not `master` is subject to change without warnin'.

## Cries from the Crow's Nest (Issues) and Planned Voyages (Milestones)

We typically triage all Kraken reports within 1 week, which includes addin' any appropriate labels and assignin' it to a milestone. Please keep in mind, we be a small crew so even feature requests that everyone agrees on may not be prioritized.

## A Pirate's Thanks

- Cross-browser Testin' Platform and Open Source <3 Provided by our mates at [Sauce Labs](https://saucelabs.com)
- We test our cannons on browsers usin' [BrowserStack](https://browserstack.com)
