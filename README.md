# Authentication-Middlewares

### With these middlewares you can easily create login, registration and route protection, role handling.


## Authentication Middleware
this middleware will put the `roles[]` to the req.roles 

#### Keep in mind: this require to use `AuthenticationMiddlewares.signAccessToken` or just put a `roles: string[]`  to the token

```typescript
AuthenticationMiddlewares.setup({
    jwtSecret: 'secret',
    isBearer: false, // your token starts with "bearer xx.yy.zz"
    tokenPath: 'token' // token location in header req.headers[tokenPath]
});

app.use(AuthenticationMiddlewares.authenticationMiddleware()); // get the roles every request
```


## Password encryption
```typescript
AuthenticationMiddlewares(passwordField: string, bcryptPasswordPath: string)
``` 
it will get the `request.body[passwordField]` and  encrypt it then put to `request[bcryptPasswordPath]`

```typescript
// REGISTRATION
// the req.body['password'] filed will be encrypted to req['bcryptedPassword'];
app.post('/registration', AuthenticationMiddlewares.passwordBcryptMiddleware('password', 'bcryptedPassword'), (req: any, res: any) => {
    console.log(req.bcryptedPassword) // encrypted password
})

```

## Login services
you can use:
* `BcryptService.isMatchHashPassword(password: string, hashPassword: string)` - correct password? 
* `TokenService.signAccessToken({roles: string[]})` - crete token with role
```typescript
// LOGIN - this part is mostly your implementation.. but when you sign a token you must put in a roles: sting[] array
app.post('/login', async (req: any, res: any) => {
    const isPassMatch = await BcryptService.isMatchHashPassword(req.body.password, "$2b$10$2wO3DGR9BufUnIhyOrhzIeFVpwO/UX8PJo08UBz5nkD2ZigJTPRxa") // the hash password what you get back by registration
    const token = await TokenService.signAccessToken({roles: ['user']});
 
    // ....
})
```

## Authorisation middleware
`AuthenticationMiddlewares.authorisationMiddleware(requiredRole: string)`
* if the token role don't match with the "requiredRole" it will send back  "access denied"

```typescript
app.get('/secret', AuthenticationMiddlewares.authorisationMiddleware('admin'), (req: any, res: any) => {
    console.log('access enabled')
})
```
