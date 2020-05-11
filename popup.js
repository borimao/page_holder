const app = new Vue({
  el: "#app",
  data: {
      pages: [],
      group: [],
      g_current: -1,
      g_id: 0,
      g_name: ""
  },
  methods: {
      AddPage: function () {
          chrome.extension.sendRequest({type:"ADD_PAGE", current:app.g_current},function(res){
              app.pages = res
          });
      },
      DeletePage: function (page) {
          chrome.extension.sendRequest({type:"DELETE_PAGE",id:page.id},function(res){
              app.pages = res
          });
      },
      AddGroup: function () {
          this.group.push({
              id: this.g_id,
              name: this.g_name
          })
          this.g_name = ""
          this.g_current = this.g_id
          this.g_id++
          this.SavedGroup()
      },
      SetGroup: function (id) {
          this.g_current = id;
          this.SavedGroup()
      },
      OpenGroup: function (item) {
          for(let i = 0; i < this.group.length; i++){
              if(this.group[i].id == item.id){
                  const id = this.group[i].id
                  this.group.splice(i,1);
                  for(let j = 0; j < this.pages.length; j++){
                      if(this.pages[j].group == id){
                          this.pages[j].group = -1;
                      }
                  }
              }
          }
          this.g_current = -1;
          this.SavedGroup()
          chrome.storage.local.set({'demo1':JSON.stringify(this.pages)}, ()=>{
          });
      },
      DeleteGroup: function (item) {
          for(let i = 0; i < this.group.length; i++){
              if(this.group[i].id == item.id){
                  const id = this.group[i].id
                  this.group.splice(i,1);
                  for(let j = 0; j < this.pages.length; j++){
                      if(this.pages[j].group == id){
                          this.pages.splice(j,1);
                          j--
                      }
                  }
              }
          }
          this.g_current = -1;
          this.SavedGroup()
          chrome.storage.local.set({'demo1':JSON.stringify(this.pages)}, ()=>{
          });
      },
      SavedGroup: function () {
          const data = {
            group: this.group,
            current: this.g_current,
            last_id: this.g_id
          }     
          chrome.storage.local.set({'group_data':JSON.stringify(data)}, ()=>{
              console.log('saved')
          });
      }
  },
  computed: {
      computedPages: function () {
          return this.pages.filter(function(el) {
              return this.g_current < 0 ? true : this.g_current === el.group
          }, this).reverse()
      }
  },
  created() {
      chrome.storage.local.get('demo1', function (value) {
          if(value.demo1){
              app.pages = JSON.parse(value.demo1)
          }
      })
      chrome.storage.local.get('group_data', function (value) {
          if(value.group_data){
              const data = JSON.parse(value.group_data)
              app.group = data.group
              app.g_current = data.current
              app.g_id = data.last_id
          }
      })
  },
})