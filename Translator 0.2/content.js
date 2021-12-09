console.log('content world!');
// NOTE: In this version of translator max text size per request is limited to around 500 characters
// But in the latest version of translator is workaround for this limitation
const API_KEY = "",
    XHR = new XMLHttpRequest();
XHR.withCredentials = true;

var coords = [];
const bubbleDOM = document.createElement('div').appendChild(document.createElement('div'));

bubbleDOM.setAttribute('class', 'tooltip_bubble');
document.body.appendChild(bubbleDOM);

window.addEventListener('wheel', function () {
    bubbleDOM.style.visibility = 'hidden';
});

// Handles mouse clicks on the page
window.addEventListener('mouseup', function (e) {
    let selection = window.getSelection().toString(),
        rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
    coords = [e.x, e.y, rect.width, rect.height];

    // If user has closed the selection hide bubble
    if (window.getSelection().isCollapsed === true) {
        bubbleDOM.style.visibility = 'hidden';
        return;
    }
    console.log(selection);
    // when source language autodetection should not be used
    // apiRequest(selection.toString(),'sk','from=en');

    // used with language autodetection
    apiRequest(selection, 'ru');
});

// Makes the HTTP request using the selected text as the query string
function apiRequest(text, target = 'en', source = '') {
    // All of the available languages are listed in microsoft api page overview
    XHR.open("POST", "https://microsoft-translator-text.p.rapidapi.com/translate?to="
        + target.toString() +
        "&api-version=3.0&"
        + source +
        "profanityAction=NoAction&textType=plain");
    XHR.setRequestHeader("content-type", "application/json");
    XHR.setRequestHeader("x-rapidapi-key", API_KEY);
    XHR.setRequestHeader("x-rapidapi-host", "microsoft-translator-text.p.rapidapi.com");
    XHR.send(JSON.stringify([{
        "text": text
    }]));
}

// Handles the translation response
XHR.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
        const responseData = JSON.parse(this.responseText)[0];
        let translation = responseData.translations[0].text;
        if (window.getSelection().toString().length > 1) {
            showTooltip(translation, coords[0], coords[1]);
        }
    }
});

// Shows the tooltip with the translation
function showTooltip(text, x = 0, y = 0) {
    bubbleDOM.innerText = text;
    bubbleDOM.style.visibility = 'visible';
    bubbleDOM.style.left = x + 'px';
    bubbleDOM.style.top = y + 'px';
}
