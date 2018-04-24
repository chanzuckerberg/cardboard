# cardboard

>> card dashboard web app for collaborative science projects

This web app was designed for a [meeting](http://meetings.czi.technology/human-cell-atlas/comp-tools) of people building computational tools for the Human Cell Atlas, hosted by CZI. You can install and build it with

```
npm install
npm run bundle
```

Although it's designed to be fairly modular, for now it will take a bit of work or customization to use for other purposes, ideally with a `config.json` file or similar. In particular

- All static assets (documents, photos, logo) are expected to be provided, and are currently tailored to the above use case, need to do some work to generalize and clarify the expected format
- Which "cards" to include (links, people, etc.) should be more general and easily configurable

Pull requests that address any of the above welcome, otherwise I'll try to get to it myself!