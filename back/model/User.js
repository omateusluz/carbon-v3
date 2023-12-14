class User {

  constructor(id, username, email, password, token) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.password = password;
      this.token = token;
  }
}

module.exports = User;