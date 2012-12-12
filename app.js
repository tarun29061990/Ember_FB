/**************************
* Application
**************************/

App=Em.Application.create();
/**************************
* Models
**************************/
App.Content=Em.Object.extend({
	name:null,
	avatar:null
});

/**************************
* Views
**************************/
App.SearchTextField=Em.TextField.extend({
	insertNewline:function(){
		App.contentController.loadThings();
	}
});

/**************************
* Controllers
**************************/

App.contentController=Em.ArrayController.create({
	content: [],
	username:'',
	loadThings:function(){
		var me=this;
		var username=me.get("username");
		if(username){
			var url='https://graph.facebook.com/'
			url+='%@'.fmt(me.get("username"));
			url_img=url+'/picture/'
			App.recentUsersController.addUser(username);
			$.getJSON(url,function(data){
				me.set('content',[]);
				$(data).each(function(index,value){
					var t=App.Content.create({
						name:value.name,
						avatar:url_img
					});
					me.pushObject(t);
				})
			});
		}
	}
});


App.recentUsersController=Em.ArrayController.create({
	content:[],
	addUser:function(name){
		if(this.contains(name)) this.removeObject(name);
		this.pushObject(name);
	},
	removeUser: function(view){
		this.removeObject(view.context);
	},

	searchAgain: function(view){
		App.contentController.set('username',view.context);
		App.contentController.loadThings();
	},

	reverse:function(){
		return this.toArray().reverse();
	}.property('@each')
});