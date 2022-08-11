const { pool } = require("../../config/database");

//조회 API 
exports.selectRestaurants = async function (connection, category) {
  const selectAllRestaurantsQuery = `SELECT title,address,URL,category FROM FoodMap WHERE status='A';`; //실제 조회하고자하는 db쿼리문
  const selectRestaurantsByCategoryQuery = `SELECT title,address,URL,category FROM FoodMap where status='A' and category = ?;`; //실제 조회하고자하는 db쿼리문
  const Params = [category]; //Parmas가 title인자(?로이동)로 전달됌

  let Query;
  if (!category) { //만약 title이 null값이라면 모든 영화정보를 조회
    Query = selectAllRestaurantsQuery;
  }
  else {
    Query = selectRestaurantsByCategoryQuery;
  }

  const rows = await connection.query(Query, Params);

  return rows;
};

//회원가입
exports.insertUsers = async function (connection, userID, password, nickname) {
  const Query = `insert into Users(userID,password,nickname) values (?,?,?);`
  const Params = [userID, password, nickname];

  const rows = await connection.query(Query, Params);

  return rows;
}

//로그인 
exports.isValidUsers = async function (connection, userID, password) {
  const Query = `select userIdx,nickname from Users where userID = ? and password = ? and status = 'A';`
  const Params = [userID, password];

  const rows = await connection.query(Query, Params);

  return rows;
}