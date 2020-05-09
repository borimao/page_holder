let STORAGE_KEY = 'demo1'
let pageData = {
    fetch: function(){

    }
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
    if(request.type === "ADD_PAGE"){
        const img = new Image();
    
        chrome.tabs.captureVisibleTab(null,{format:"jpeg"}, (base64Data) => {
            img.src = base64Data;
        })
    
        img.onload = () => {
            let width = 240
            let height = 150
            const ratio = img.width / img.height
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            if(width/ratio <= height){
                height = width / ratio
                canvas.height = width / ratio
            }
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, width/ratio)
            image = canvas.toDataURL("image/webp")
    
            chrome.tabs.getSelected(null, (tab) => {
                const title = tab.title
                const url = tab.url
                const page = {
                    id: 0,
                    title: title,
                    url: url,
                    image: image,
                    group: -1,
                }
    
                chrome.storage.local.get('demo1', function (value) {
                    if(!value.demo1){
                        chrome.storage.local.set({'demo1':JSON.stringify([page])}, ()=>{
                            sendResponse([page])
                        });
                    }else {
                        const pages = JSON.parse(value.demo1)
                        page.id = pages.length
                        pages.push(page)
                        chrome.storage.local.set({'demo1':JSON.stringify(pages)}, ()=>{
                            sendResponse(pages)
                        });
                    }
                });
            })
        }
    }else if(request.type == "DELETE_PAGE"){
        const id = request.id
        chrome.storage.local.get('demo1', function (value) {
            const pages = JSON.parse(value.demo1)
            pages.splice(id, 1)
            pages.forEach(function(page, index) {
                page.id = index
            })
            chrome.storage.local.set({'demo1':JSON.stringify(pages)}, ()=>{
                sendResponse(pages)
            });
        })
    }
    
})

