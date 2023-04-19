import jwtDecode from "jwt-decode";

export class Role {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  uaNumber: string;
  telephone: string;
  location  : string;
  password: string;
  repeatPassword: string;
  roles: Array<Role>;

  constructor(id: number,
              firstName: string,
              lastName: string,
              email: string,
              uaNumber: string,
              telephone: string,
              location: string,
              password: string,
              repeatPassword: string,
              roles: Array<Role>) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.uaNumber = uaNumber;
    this.telephone = telephone;
    this.location = location;
    this.password = password;
    this.repeatPassword = repeatPassword;
    this.roles = roles;
  }
}

export class UserCredentials {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class JWTUser{
  email: string;
  roles: string[];
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  constructor(email: string, roles: string[], exp: number, iat: number, iss: string, sub: string) {
    this.email = email;
    this.roles = roles;
    this.exp = exp;
    this.iat = iat;
    this.iss = iss;
    this.sub = sub;
  }
}

export class JWTToken {
  token: string;

  constructor(token: string) {
    this.token = token;
  }
  decode(): JWTUser {
    return jwtDecode(this.token);
  }
}
