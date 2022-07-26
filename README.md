# I Said What
"I Said What" is a small tool for browsing a downloaded Twitter archive by day.

## How to Use

"I Said What" does not interface with the Twitter API. Instead, it accesses the contents of a previously downloaded archive. As such, it displays Tweets from a snapshot in time and will not reflect new Tweets made after the archive were downloaded.

The first step is to download your Twitter archive as described at [https://twitter.com/settings/download_your_data](https://twitter.com/settings/download_your_data).

After downloading and extracting the contents of the archive to a new folder, place the three included files (i-said-what.html, i-said-what.js, and i-said-what.css) in this folder. These should be adjacent to the file named "Your archive.html".

Open i-said-what.html in your browser. You should see a calendar widget and a "Find Tweets" button. You may choose a date from the calendar or leave it blank to search for Tweets or Retweets from your archive on the current day. Year is ignored in either case, and all Tweets made on the current day across all years will be shown in chronological order. Five Tweets are shown per page, and page numbers are displayed at the top.

![Example of a Tweet from my archive](https://j-kyle.com/mystuff/images/i-said-what.png)

In practice, you'll probably hit the "Find Tweets" button and nothing happens, and if you were to open the developer console of your browser, you'd probably see an error message to the effect of _"Access to XMLHttpRequest at 'file:///...' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, chrome-untrusted, https."_ Good stuff.

## Dealing with Cross Origin Requests

So this issue here is that trying to make an HTTP request to a file on disk runs afoul of some rules that probably have a good reason to exist. I don't know. I'm don't web dev. 
I've been working around this by launching Chrome with the "--allow-file-access-from-files" flag, but this is a bad idea and you shouldn't do it.

If you have access to some scratch space on a web site somewhere, you could also upload the archive folder (including the i-said-what files) to the internets and then it wouldn't have this problem. In fact, "data/tweets.js" is the only file this tool interfaces with, so you could reduce the footprint by only uploading that one and the i-said-what files.

## Ideas for Future Improvements

 - Track and display which days on the calendar have been visited already
 - Maintain current Tweets and page number if the page is refreshed

---

### Requisite disclaimers
I am not affiliated with Twitter Inc. This tool is not created, endorsed, or supported by Twitter Inc. "Twitter," "Tweet," and "Retweet" are trademarks of Twitter Inc.
