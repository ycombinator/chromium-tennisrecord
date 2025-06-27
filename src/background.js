chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {
    const trURL = `https://www.tennisrecord.com/adult/profile.aspx?playername=${message.firstName}%20${message.lastName}`
    fetch(trURL)
        .then(res => res.text())
        .then(body => senderResponse(body))
    return true
});

chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });
