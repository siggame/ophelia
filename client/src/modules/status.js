import parser from 'rss-parser'

/**
 * TODO: Document function
 */
export function getCurrentStatus() {
    return new Promise((resolve, reject) => {
        parser.parseURL('http://status.megaminerai.com/feed.xml', (err, parsed) => {
            if(err) {
                return reject(err)
            }
            const data = {
                'arena': {
                    'link': null, 
                    'pubDate': null,
                    'tag': null
                },
                'food': {
                    'link': null, 
                    'pubDate': null,
                    'tag': null
                },
                'gameserver': {
                    'link': null, 
                    'pubDate': null,
                    'tag': null
                },
                'git': {
                    'link': null, 
                    'pubDate': null,
                    'tag': null
                },
                'visualizer': {
                    'link': null, 
                    'pubDate': null,
                    'tag': null
                },
                'webserver': {
                    'link': null, 
                    'pubDate': null,
                    'tag': null
                }
            }
            parsed.feed.entries.forEach(function(entry) {
                for(key in data) {
                    if(data.hasOwnProperty(key)) {
                        if(entry.categories[0] === key && data[key].link === null) {
                            data[key].link = entry.link
                            data[key].pubDate = entry.pubDate
                            data[key].tag = 'OK' //entry.tag
                        }  
                    }
                }
            })
        return resolve(data)
        })
    })
}
