import jwt from 'jsonwebtoken';

//generate token
const generateToken = (data) => {
    //payload, (signature) private key, header
    //payload: string, object, list....
    //khi co tham so header thi kh gan duoc string

    let token = jwt.sign({data}, "node31", { algorithm: "HS256", expiresIn: "5m"});
    return token;
}
//check token
const checkToken = (token) => {
    //thanh cong => tra ve token da decode
    //that bai nhay vao try catch => 3 th chinh
    return jwt.verify(token, "node31");
}
//decode token
const decodeToken = (token) => {
    return jwt.decode(token);
}

const verifyJWT = (req, res, next) => {
    try {
        let { token } = req.headers;
        if (checkToken(token)) {
          next();
        }
      } catch (error) {
        res.status(401).send(error.message);
      }
}
export {
    generateToken,
    checkToken,
    decodeToken,
    verifyJWT
}