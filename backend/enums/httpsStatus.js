const HttpStatus = Object.freeze({
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
});


export default HttpStatus;


// Object.freeze() is used to make an object immutable. 
// This means that the properties of the object cannot be added, removed, or modified.