const app = new Vue({
    el: "#app",
    data: {
        pages: []
    },
    methods: {
        AddPage: function () {
            chrome.extension.sendRequest({type:"ADD_PAGE"},function(res){
                app.pages = res
            });
        },
        DeletePage: function (page) {
            chrome.extension.sendRequest({type:"DELETE_PAGE",id:page.id},function(res){
                app.pages = res
            });
        }
    },
    created() {
        chrome.storage.local.get('demo1', function (value) {
            if(value.demo1){
                app.pages = JSON.parse(value.demo1)
            }
        })
    },
})