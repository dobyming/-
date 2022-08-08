module.exports = function (app) {
  const index = require("../controllers/indexController"); //app.get callback function
  const jwtMiddleware = require("../../config/jwtMiddleware");

  // 라우터 정의
  // app.HTTP메서드(uri, 컨트롤러 콜백함수)
  //app.get("/dummy",index.example);

  // //movieinfo table 조회(Read API-CRUD 중 하나)
  // //id로 접근시, uri는 '/:id' 형식으로 작성
  // app.get("/movies",index.readMovies);

  // //영화 생성(Create) API
  // app.post("/movies",index.createMovie);

  // //영화 정보 업데이트(Update) API
  // app.patch("/movies/:id",index.updateMovie);

  // //영화 삭제 API
  // app.delete("/movies/:id",index.deleteMovie);

  //레스토랑 전체 조회
  app.get("/restaurants",index.readRestaurants);

  //회원가입
  app.post("/sign-up",index.createUsers);
};
