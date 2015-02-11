Transformicons
======================
[![Build Status](https://travis-ci.org/grayghostvisuals/transformicons.svg?branch=master)](https://travis-ci.org/grayghostvisuals/transformicons)

![](https://dl.dropboxusercontent.com/u/41114960/github/transformicons/site.png)

**What's a transformicon?**

It's an animated symbol/button/icon that morphs using a combination of SVG, CSS or HTML.

We also provide a builder that gives developers the ability to select their preferred transformicons and output for finer control.

**What browsers do you support?**

IE10+, Chrome 36+, Safari 6+, Firefox 30+, Opera 22+, iOS 7+, Android 4+, Chrome for Android 38+

--

### Documentation
All of our documentation has been written in markdown and can be [directly viewed on our site](http://www.transformicons.com/docs.html) or under our [docs](https://github.com/grayghostvisuals/transformicons/tree/master/docs) directory of this repo. Feel free to reach out for help in the issue tracker making sure to title your issue as descriptive as possible. Please make sure you've also checked older issues that may relate to your question first before filing in order to avoid bogging down the issue tracker.

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

Since a Sass coding guidelines document has been written (and a good one too) by [Hugo](http://hugogiraudel.com), it only seems fitting to abide loosely by it's suggestions. The [http://sass-guidelin.es](http://sass-guidelin.es) is what we strive towards as we write Sass and we hope you do the same. Enough said.

You'll find all our working files in the ``dist`` directory for Transformicons' JavaScript requirement and related Sass. Any markup for the Transformicons objects will be found in the ``site/templates/includes/tcons`` directory. We use assemble to build our markup so make sure you're never editing a file with the ``.html`` extension. Assemble files use the ``.hbs`` file extension. These are the files you should be editing instead.

--

Props to [@bennettfeely](//twitter.com/bennettfeely) and [@SaraSoueidan](//twitter.com/SaraSoueidan).
Licensed under [MIT](//opensource.org/licenses/MIT)
