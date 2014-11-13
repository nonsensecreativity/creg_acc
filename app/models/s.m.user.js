'use strict';

var mongoose = require('mongoose'),
	 Schema = mongoose.Schema;

var UserSchema = new Schema ({
	firstName: String,
	lastName: String,
	email: {
		type: String,
	 	index: true,
		unique: true,
	 	match: /.+\@.+\..+/,
		required: true
	 },
	website:{
		type: String,
		set: function(url){
			if (!url) {
				return url;
			} else {
				if (url.indexOf('http://') !==0 && 
						url.indexOf('https://') !==0){
								url = ['http://', url].join('');
						}
				return url;
			}
		}
	},
 	username: String,
	password: {
		type: String,	  
	 	validate: [
		  function(password){
				return password.length >=8
		  },
	 		'password shall be at least 8 characters long'
		],
		get: function(pass) {
				return(['!',pass].join('_'));
		},
	},
	role: {
		type: String,
	 	enum: ['admin', 'owner', 'user' ]
	},
	created: {
		type: Date,
		default: Date.now
	},
	soc:{
		type: String,
		unique: true,
	}

});

UserSchema.virtual('fullName').get(function(){
	return [this.firstName, this.lastName].join(' ');
});

UserSchema.methods.authenticate = function(password){
	return this.password === password;
}

UserSchema.set('toJSON', {
		  getters: true,
		  virtuals: true
});

mongoose.model('User', UserSchema);
