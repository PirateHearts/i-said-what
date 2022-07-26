var Tweets = [];		// These will be tuples containing ID, text, date, and whatever else I might find useful. (Javascript doesn't have tuples, so these will actually be arrays themselves.)
const NumTweetsPerPage = 5;
var NumPages = 0;
var PageIndex = 0;

function FindTweets()
{
	console.clear();
	document.getElementById("SearchResults").innerHTML = "";
	document.getElementById("PageTabs").innerHTML = "";
	
	Tweets = [];
	NumPages = 0;
	PageIndex = 0;
	
	const URL = "data/tweet.js";

	var Req = new XMLHttpRequest();
	Req.open("get", URL);
	Req.setRequestHeader("Content-Type","application/json");
	Req.setRequestHeader("X-Requested-With","XMLHttpRequest");
	Req.setRequestHeader("Accept","application/json");
	Req.send();

	Req.onreadystatechange = CreateOutputLinesCallback(Req);
}

function CreateOutputLinesCallback(InRequest)
{
	return function()
	{
		if (InRequest.readyState === 4)
		{
			ParseResponseText(InRequest.responseText);
		}
	}
}

function GetReferenceDate()
{
	var ReferenceDate = new Date();
	
	var PickedDate = document.getElementById("DatePicker").value;
	
	var ReferenceDate = new Date();
	
	if (PickedDate !== undefined && PickedDate !== "")
	{
		PickedDate += " 12:00:00";
		ReferenceDate = new Date(PickedDate);
	}
	
	return ReferenceDate;
}

function ParseResponseText(InText)
{
	const ReferenceDate = GetReferenceDate();

	// Strip everything up to and including the equals sign because it's not valid JSON.
	const Separator = " = ";
	const Index = InText.indexOf(Separator);
	const ValidJSON = InText.substring(Index + Separator.length);
	
	const JSONObj = JSON.parse(ValidJSON);
	
	for (Elem in JSONObj)
	{
		const ThisTweet = JSONObj[Elem].tweet;
		if (ThisTweet !== undefined &&
			ThisTweet.id_str !== undefined &&
			ThisTweet.created_at !== undefined)
		{			
			const TweetDate = new Date(ThisTweet.created_at);
			
			if (TweetDate.getDate() === ReferenceDate.getDate() &&
				TweetDate.getMonth() === ReferenceDate.getMonth())
			{
				Tweets.push([ThisTweet.id_str, ThisTweet.full_text, TweetDate]);
			}
		}
	}
	
	SortTweets();
	
	CountPages();
	
	UpdatePageTabs();
	
	ShowPage(0);
}

function SortTweets()
{
	Tweets.sort(OldestToNewest);
}

function OldestToNewest(A, B)
{
	[id_a, text_a, date_a] = A;
	[id_b, text_b, date_b] = B;
	
	return (date_a.getTime() - date_b.getTime());
}

function CountPages()
{
	NumPages = Math.ceil(Tweets.length / NumTweetsPerPage);
	PageIndex = 0;
}

function UpdatePageTabs()
{
	document.getElementById("PageTabs").innerHTML = "";
	
	const AnchorTemplate = '<a class="nodeco" href="#" onclick="ShowPage(%1); return false;">%2</a>'
	const StaticTemplate = '<span class="selected">%2</span>'
	const Sep = " | ";
	
	var InnerHTML = "";
	
	InnerHTML += '<p class="page_tabs">';
	for (let i = 0; i < NumPages; ++i)
	{
		var Replaced = (i === PageIndex) ? StaticTemplate : AnchorTemplate;
		Replaced = Replaced.replaceAll("%1", i);
		Replaced = Replaced.replaceAll("%2", i + 1);
		
		InnerHTML += Replaced;
		if (i < NumPages - 1)
		{
			InnerHTML += Sep;
		}
	}
	InnerHTML += "</p>";
	document.getElementById("PageTabs").innerHTML = InnerHTML;
}

function ShowPage(InPageIndex)
{
	if (InPageIndex >= 0 && InPageIndex < NumPages)
	{
		PageIndex = InPageIndex;
	}
	
	UpdatePageTabs();
	
	document.getElementById("SearchResults").innerHTML = "";
	
	var InnerHTML = "";
	
	const Template = '<p class="tweet_header">Tweet %2 of %3:</p><blockquote class="twitter-tweet" data-theme="dark"><p class="tweet_loading">%4<br />%5</p><a href="https://twitter.com/x/status/%1"></a></blockquote>';
	
	const StartIndex = (PageIndex * NumTweetsPerPage);
	const EndIndex = Math.min(Tweets.length, ((PageIndex + 1) * NumTweetsPerPage));
	for (let i = StartIndex; i < EndIndex; ++i)
	{
		const ThisTweet = Tweets[i];
		
		[id, text, date] = ThisTweet;
		
		var Replaced = Template;
		Replaced = Replaced.replaceAll("%1", id);
		Replaced = Replaced.replaceAll("%2", (i + 1));
		Replaced = Replaced.replaceAll("%3", Tweets.length);
		Replaced = Replaced.replaceAll("%4", text);
		Replaced = Replaced.replaceAll("%5", date);
		InnerHTML += Replaced;
	}
	
	document.getElementById("SearchResults").innerHTML = InnerHTML;

	AppendWidgetsScript();
}

function AppendWidgetsScript()
{
	var NewScript = document.createElement("script");
	NewScript.type = "text/javascript";
	NewScript.async = true;
	NewScript.src = "https://platform.twitter.com/widgets.js";
	document.getElementsByTagName("head")[0].appendChild(NewScript);
	document.getElementsByTagName("head")[0].removeChild(NewScript);
}
