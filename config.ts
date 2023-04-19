const config = {
  API_URL : 'http://localhost:8080',
  NAVIGATION: [ // Describes the links in the navigation bar
    {
      name: 'Home',
      location: '/',
      icon: 'mdi-home',
      allowedRoles: ['Administrator', 'Tester'],
    },
    {
      name: 'User management',
      location: '/users',
      icon: 'mdi-account-group',
      allowedRoles: ['Administrator'],
    },
  ]
}

export default config
