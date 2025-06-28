chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.type) {
        case "fetchPage":
            console.log({message})
            fetch(message.url)
                .then(res => res.text())
                .then(body => { console.log(body); sendResponse(body) })
            break
    }
    return true
});

chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });
