let ratingCache

async function getRating(id, firstName, lastName) {
    // console.log("Getting rating for: ", {id, firstName, lastName})
    // Load cache from storage
    const data = await chrome.storage.session.get("ratingCache");
    ratingCache = data.ratingCache || {}

    rating = ratingCache[id]
    if (rating) {
        // Return from cache
        return rating
    }

    // Fetch rating from source
    rating = await fetchRating(firstName, lastName)
    if (rating) {
        // console.log(`Setting rating ${rating} for ${firstName} ${lastName} in cache`)
        ratingCache[id] = rating
        chrome.storage.session.set({ratingCache})
    }
    return rating 
}

function fetchRating(firstName, lastName) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({firstName, lastName}, body => {
            // console.log(`Fetching rating for ${firstName} ${lastName} from source`)

            // Parse TR rating
            let rating
            const p = new DOMParser()
            const document = p.parseFromString(body, "text/html")
            document.querySelectorAll("span").forEach(n => {
                const text = n.innerText.trim()
                if (text.match(/^[0-9].[0-9]{4}$/)) {
                    rating = text
                }

            })

            if (rating) {
                resolve(rating)
            } else {
                resolve()
            }
        })
    })
}

function showRating(info, firstName, lastName, rating) {
    info.innerText = ""
    const link = document.createElement('a')
    link.href = `https://www.tennisrecord.com/adult/profile.aspx?playername=${firstName}%20${lastName}`
    link.target = '_blank'
    link.innerText = rating

    info.appendChild(link)
}

function showLoading(target) {
    const info = document.createElement('span');
    info.className = 'tr-info';
    info.innerText = "Loading..."

    target.appendChild(info)
    return info
}

async function showInfo(target) {
    const url = target.href;
    if (url == "") {
        return
    }

    const matches = url.match(/playermatches.asp\?id=(\d+)$/)
    if (!matches || matches.length != 2) {
        return
    }

    const id = matches[1]
    const name = target.innerText
    const parts = name.split(", ")
    const firstName = parts[1]
    const lastName = parts[0]

    const info = showLoading(target)
    const rating = await getRating(id, firstName, lastName)
    if (rating) {
        showRating(info, firstName, lastName, rating+' ↗️')
    } else {
        showRating(info, firstName, lastName, "⁉️")
    }
};

document.querySelectorAll('a').forEach(showInfo)

