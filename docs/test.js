
let CACHE_VERSION = 0
let CACHE_NAME = 'cache_v' + CACHE_VERSION
let CACHE_URLS = [
    '/'
]
function precache() {
    return caches.open(CACHE_NAME)
        .then(function (cache) {
            return cache.addAll(CACHE_URLS)
        })
}
function clearCache() {
    return caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== CACHE_NAME) {
                caches.delete(key)
            }
        })
    })
}
function fetchAndCache(req) {
    return fetch(req).then(res => {
        saveToCache(req, res.clone())//res是流
        return res
    })
}
function savaToCache(req, res) {
    return caches.open(CACHE_NAME)
        .then(cache => cache.put(req, res))

}
self.addEventListener('install', function (ev) {
    ev.waitUntil(
        precache().then(self.skipWaiting)
    )
})
self.addEventListener('activate', function (ev) {
    ev.waitUntil(
        Promise.all([
            clearCache(),
            self.clients.claim()
        ])

    )
})
self.addEventListener('fetch', function (ev) {
    let url = new URL(ev.request.url)
    if (url.origin !== self.origin) {
        return;
        // 让不同源的请求去找cdn缓存
    }
    if (ev.request.url.includes('6')) {
        ev.respondWith(
            fetchAndCache(ev.request).catch(function () {
                return caches.match(ev.request)
            })
        )
        return
    }


    ev.respondWith( // 等待数据resolve后返回内容
        fetch(ev.request).catch(function () {
            return caches.match(ev.request)
        })
    )
})