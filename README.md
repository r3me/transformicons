Transformicons
======================

[![Build Status](https://travis-ci.org/transformicons/transformicons.svg?branch=master)](https://travis-ci.org/transformicons/transformicons)
![](https://s3-us-west-2.amazonaws.com/s.cdpn.io/392/transformicons.png)

**What's a transformicon?**

It's an animated symbol/button/icon that morphs. We also provide a builder that gives developers the ability to select their preferred Transformicons and output for finer control.

**Browser Testing**

[![browserstack](https://s3-us-west-2.amazonaws.com/s.cdpn.io/392/browserstack-logo.svg)](https://www.browserstack.com)

Each intended platform and browser is double and triple checked using BrowserStack. BrowserStack is a cloud-based cross-browser testing tool that enables developers to test their websites across various browsers on different operating systems and mobile devices.

--

### Documentation
All of our documentation has been written in markdown and can be [directly viewed on our site](http://www.transformicons.com/docs.html) or under our [docs](https://github.com/transformicons/transformicons/tree/master/docs) directory of this repo. Feel free to reach out for help in the issue tracker making sure to title your issue as descriptive as possible. Please make sure you've also checked older issues that may relate to your question first before filing in order to avoid bogging down the issue tracker.

--

### Contributing
If you would like to contribute to the Transformicons project, please make sure that anything feature related is isolated to a new branch and titled with the name of the feature being developed.

Local installation is dead simple. We use all local files and directories to run this project. This ensures that you, the developer, need not install anything directly or globally to your system. Also, take note we use libsass for preprocessing all of our Sass code.

**Install dependencies**

```bash
$ npm install
```

**Start a server and watch Sass files**

```bash
$ npm start
```

Since a Sass coding guidelines document has been established by [Hugo](http://hugogiraudel.com), it only seems fitting to abide loosely by it's suggestions. The [http://sass-guidelin.es](http://sass-guidelin.es) is what we strive towards as we write Sass and we hope you do the same. Enough said.

You'll find all our working files in the ``dist`` directory for Transformicons' JavaScript requirement and related Sass. Any markup for the Transformicons objects will be found in the ``site/templates/includes/tcons`` directory. We use assemble to build our markup so make sure you're never editing a file with the ``.html`` extension. Assemble files use the ``.hbs`` file extension. These are the files you should be editing instead.

### Before Filing a Report

- Make an isolated demo
- List your setup and explain in detail the steps to follow in order to reproduce your bug.

### Transformicons Specs
Objects submitted to Transformicons must abide by the following guidelines in order to be accepted into the library…

- Fully Tested.
- Proportions must be a maximum of 40px wide and no more than 40px tall.
- Make sense to users and yourself.
- If your Transformicon is truly a ``button`` please surround the object in a ``button`` tag otherwise use a ``span`` or ``div``. See our documentation for examples.
- Provide custom control over color and appearance for traits such as border-radius. This way authors can control the visual aspect to match their design.

--

#### **Noteworthy Mentions**

- Featured resource in [Codrops Collective #154](http://tympanus.net/codrops/collective/collective-154)
- Daily top 10 feature on [Product Hunt](http://www.producthunt.com/posts/transformicons)
- Featured Tool in [CSS Weekly](http://css-weekly.com/issue-151/)

--

Props to [@bennettfeely](//twitter.com/bennettfeely) and [@SaraSoueidan](//twitter.com/SaraSoueidan).
Licensed under [MIT](//opensource.org/licenses/MIT)
