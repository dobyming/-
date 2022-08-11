module.exports = function (app) {
  const index = require("../controllers/indexController"); //app.get callback function
  const jwtMiddleware = require("../../config/jwtMiddleware");

  //레스토랑 전체 조회
  app.get("/restaurants", index.readRestaurants);

  //회원가입
  app.post("/sign-up", index.createUsers);

  //로그인
  app.post("/sign-in", index.createJwt);

  //로그인 유지(토큰 검증)
  app.get("/jwt", jwtMiddleware, index.readJwt);
};
