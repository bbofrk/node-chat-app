//adduser(id, name, room)
//removeUser(id)
//getUser(id)
//getUserList(room)

//es6 classes
class Users {
	constructor () {
		this.users = [];
	}

	addUser (id, name, room) {
		var user = {id, name, room};
		this.users.push(user);
		return user;
	}
}

module.exports = {Users};
