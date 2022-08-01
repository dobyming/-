const { pool } = require("../../config/database");

// //조회 API 
// exports.selectMovies = async function (connection,title) {
//   const selectAllMoviesQuery = `SELECT * FROM movieinfo;`; //실제 조회하고자하는 db쿼리문
//   const selectMoviesByTitleQuery = `SELECT * FROM movieinfo where title = ?;`; //실제 조회하고자하는 db쿼리문
//   const Params = [title]; //Parmas가 title인자(?로이동)로 전달됌

//   let Query;
//   if(!title){ //만약 title이 null값이라면 모든 영화정보를 조회
//     Query = selectAllMoviesQuery;
//   }
//   else{ //title에 어떤값이 있다면 그 값에 대한 정보를 출력
//     Query = selectMoviesByTitleQuery;
//   }
//   //let Query = selectMoviesByTitleQuery ? selectAllMoviesQuery;

//   const rows = await connection.query(Query, Params);

//   return rows;
// };

// //생성 API
// exports.insertMovies = async function (connection,title,genr,director,price) {
//   const Query = `INSERT INTO movieinfo(title, genr, director, price) VALUES (?,?,?,?);`; //실제 조회하고자하는 db쿼리문
//   const Params = [title,genr,director,price]; //Parmas가 title인자(?로이동)로 전달됌

//   const rows = await connection.query(Query, Params);

//   return rows;
// };

// //id 유효성 검사
// exports.isValidMovieId = async function(connection,id){
//   const Query = `SELECT * FROM movieinfo where id = ?;`; //실제 조회하고자하는 db쿼리문
//   const Params = [id];
  
//   const rows = await connection.query(Query, Params);
//   if(rows<1){
//     return false; //유효하지 않은 id가 들어옴
//   }

//   return true;
// }

// //업데이트 API
// exports.updateMovies = async function (connection,id,title,genr,director,price) {
//   const Query = `UPDATE movieinfo set
//   title = ifnull(?,title),
//   genr = ifnull(?,genr),
//   director = ifnull(?,director),
//   price = ifnull(?,price) WHERE id = ?;`; //실제 조회하고자하는 db쿼리문
//   const Params = [title,genr,director,price,id]; //Parmas가 title인자(?로이동)로 전달됌

//   const rows = await connection.query(Query, Params);

//   return rows;
// };

// //삭제 API
// exports.deleteMovie = async function(connection,id){
//   const Query = `delete from movieinfo where id = ?;`
//   const Params = [id];

//   const rows = await connection.query(Query, Params);

//   return rows;
// }


//조회 API 
exports.selectRestaurants = async function (connection,category) {
  const selectAllRestaurantsQuery = `SELECT title,address,URL,category FROM FoodMap WHERE status='A';`; //실제 조회하고자하는 db쿼리문
  const selectRestaurantsByCategoryQuery = `SELECT title,address,URL,category FROM FoodMap where status='A' and category = ?;`; //실제 조회하고자하는 db쿼리문
  const Params = [category]; //Parmas가 title인자(?로이동)로 전달됌

  let Query;
  if(!category){ //만약 title이 null값이라면 모든 영화정보를 조회
    Query = selectAllRestaurantsQuery;
  }
  else{ 
    Query = selectRestaurantsByCategoryQuery;
  }

  const rows = await connection.query(Query, Params);

  return rows;
};