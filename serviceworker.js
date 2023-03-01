const fileToCache =[
    'index.html',
    'styles/index.css',
    'js/main.js',
    'pages/offline.html',
    'pages/404.html'
]

const staticCache = 'Pages-v1'

self.addEventListener('install',event=>{
    console.log('service worker is installing')
    // self.skipWaiting()
    console.log('helllo')
    event.waitUntil(
        caches.open(staticCache)
        .then(cache =>{
            return cache.addAll(fileToCache)
        })
    )
})
self.addEventListener('activate',event=>{
    console.log('service worker is activating')
})

self.addEventListener('fetch',event=>{
    console.log('fetching : ',event.request.url)
    event.respondWith(
        caches.match(event.request)
        .then(response=>{
            if(response){
                console.log(`Found ${event.request.url} in cache`)
                return response
            }
            console.log('Network request for ',event.request.url)
            return fetch(event.request)
            .then(response=>{
                if(response.status == 404){
                    return caches.match("pages/404.html") /*.then((response)=>{
                        if(response){
                            console.log(`Found ${event.request.url} in cache`)
                            return response
                        }
                        console.log('Network request for ',event.request.url)
                    })*/
                }
                else{
                    return caches.open(staticCache)
                    .then(cache=>{
                        cache.put(event.request.url,response.clone())
                        return response
                    })
                }
            })
            // .catch()
        }).catch(error=>{

            return caches.match("pages/offline.html") /*.then((response)=>{
                if(response){
                    console.log(`Found ${event.request.url} in cache`)
                    return response
                }
                console.log('Network request for ',event.request.url)
            })*/

        })
    )










})