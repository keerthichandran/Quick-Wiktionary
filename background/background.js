
    DEFAULT_HISTORY_SETTING = {
        enabled: true
    };

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { word, lang } = request;
    console.log("Listener Calling");
    url = `https://en.wikipedia.org/api/rest_v1/page/summary/${word.trim()}`

        let fetchRes = fetch(url, { 
            method: 'GET',
        })
        fetchRes.then(response =>  response.status === 200 &&  response.json()) 
        .then(body => {
            console.log({"Wikiresponse": body})
        
            const document = body,
                content = extractMeaning(response, { word, lang });

            sendResponse({ content });

            content && browser.storage.local.get().then((results) => {
                let history = results.history || DEFAULT_HISTORY_SETTING;
        
                history.enabled && saveWord(content)
            });
        })

    return true;
});

function extractMeaning (document, context) {
    if(body === false) {
        var word = "",
            meaning = "";
    } else {
        var word = document.displaytitle,
            meaning = document.extract;
    }

    // if (definitionDiv) {
    //     definitionDiv.querySelectorAll("span").forEach(function(span){
    //         if(!span.querySelector("sup"))
    //              meaning = meaning + span.textContent;
    //     });
    // }

    // meaning = meaning[0].toUpperCase() + meaning.substring(1);

    // var audio = document.querySelector("audio[jsname='QInZvb']"),
    //     source = document.querySelector("audio[jsname='QInZvb'] source"),
    //     audioSrc = source && source.getAttribute('src');

    // if (audioSrc) {
    //     !audioSrc.includes("http") && (audioSrc = audioSrc.replace("//", "https://"));
    // }
    // else if (audio) {
    //     let exactWord = word.replace(/·/g, ''), // We do not want syllable seperator to be present.
            
    //     queryString = new URLSearchParams({
    //         text: exactWord, 
    //         enc: 'mpeg', 
    //         lang: context.lang, 
    //         speed: '0.4', 
    //         client: 'lr-language-tts', 
    //         use_google_only_voices: 1
    //     }).toString();

    //     audioSrc = `${GOOGLE_SPEECH_URI}?${queryString}`;
    // }

    return { word: word, meaning: meaning };
};

function saveWord (content) {
    let word = content.word,
        meaning = content.meaning,
      
        storageItem = browser.storage.local.get('definitions');

        storageItem.then((results) => {
            let definitions = results.definitions || {};

            definitions[word] = meaning;
            browser.storage.local.set({
                definitions
            });
        })
}