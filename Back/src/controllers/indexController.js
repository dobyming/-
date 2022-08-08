const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const jwt = require("jsonwebtoken");
const secret = require("../../config/secret");

const indexDao = require("../dao/indexDao");
const e = require("express");

/*Restaurants 정보 조회*/
exports.readRestaurants = async function(req,res) {
  //req로 카테고리로만 뽑고 싶을때 query parsing 작업 필요
  const {category} = req.query;
  
  if (category) {
    const validCategory = [
      "한식",
      "중식",
      "일식",
      "양식",
      "분식",
      "구이",
      "회/초밥",
      "카페",
    ];

    if (!validCategory.includes(category)) {
      return res.send({
        isSuccess: false,
        code: 400, // 요청 실패시 400번대 코드
        message: "유효한 카테고리가 아닙니다.",
      });
    }
  }
  
  try {
    const connection = await pool.getConnection(async (conn) => conn); //pool->mysql 접근 객체
    try {
      const [rows] = await indexDao.selectRestaurants(connection,category); //mysql connection 

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드(성공시 200번대)
        message: "요청 성공",
      });
    } catch (err) {
      logger.error(`readRestaurants Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`readRestaurants DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

/* 회원가입 */
exports.createUsers = async function (req, res) {
  const { userID, password, nickname } = req.body;

  // 1. 유저 데이터 검증
  const userIDRegExp = /^[a-z]+[a-z0-9]{5,19}$/; // 아이디 정규식 영문자로 시작하는 영문자 또는 숫자 6-20
  const passwordRegExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/; // 비밀번호 정규식 8-16 문자, 숫자 조합
  const nicknameRegExp = /^[가-힣|a-z|A-Z|0-9|]{2,10}$/; // 닉네임 정규식 2-10 한글, 숫자 또는 영문

  if (!userIDRegExp.test(userID)) {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "아이디 정규식 영문자로 시작하는 영문자 또는 숫자 6-20",
    });
  }

  if (!passwordRegExp.test(password)) {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "비밀번호 정규식 8-16 문자, 숫자 조합",
    });
  }

  if (!nicknameRegExp.test(nickname)) {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "닉네임 정규식 2-10 한글, 숫자 또는 영문",
    });
  }

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      // 아이디 중복 검사가 필요. 직접 구현해보기.

      // 2. DB 입력
      const [rows] = await indexDao.insertUsers(
        connection,
        userID,
        password,
        nickname
      );

      // 입력된 유저 인덱스
      const userIdx = rows.insertId;

      // 3. JWT 발급
      const token = jwt.sign(
        { userIdx: userIdx, nickname: nickname }, // payload 정의
        secret.jwtsecret // 서버 비밀키
      );

      return res.send({
        result: { jwt: token },
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "회원가입 성공",
      });
    } catch (err) {
      logger.error(`createUsers Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`createUsers DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};
// /*movie 정보 조회*/
// exports.readMovies = async function(req,res) {
//   //req로 영화 제목만 뽑고 싶을때 query parsing 작업 필요
//   const {title} = req.query;
//   //const { id } = req.params; //id로 접근 (num 타입)

//   try {
//     const connection = await pool.getConnection(async (conn) => conn); //pool->mysql 접근 객체
//     try {
//       const [rows] = await indexDao.selectMovies(connection,title); //mysql connection 

//       return res.send({
//         result: rows,
//         isSuccess: true,
//         code: 200, // 요청 실패시 400번대 코드(성공시 200번대)
//         message: "요청 성공",
//       });
//     } catch (err) {
//       logger.error(`readMovies Query error\n: ${JSON.stringify(err)}`);
//       return false;
//     } finally {
//       connection.release();
//     }
//   } catch (err) {
//     logger.error(`readMovies DB Connection error\n: ${JSON.stringify(err)}`);
//     return false;
//   }
// }

// /*영화 생성*/
// exports.createMovie = async function(req,res){
//   const{ title,genr,director,price } = req.body; //body에 있는 값들을 불러옴 
  
//   //title,genr,director:문자열인지 검증
//   if(
//     typeof title !== "string" ||
//     typeof genr !== "string" ||
//     typeof director !== "string"
//   ){
//     return res.send({
//       isSuccess: false,
//       code: 400, 
//       message: "문자열이 아닙니다.",
//     });
//   }

//   //price:int형인지 검증
//   if(isNaN(price)){
//     return res.send({
//       isSuccess: false,
//       code: 400, 
//       message: "숫자가 아닙니다.",
//     });
//   }

//   try {
//     const connection = await pool.getConnection(async (conn) => conn); //pool->mysql 접근 객체
//     try {
//       const [rows] = await indexDao.insertMovies(connection,title,genr,director,price); //mysql connection 

//       return res.send({
//         isSuccess: true,
//         code: 200, // 요청 실패시 400번대 코드(성공시 200번대)
//         message: "영화 추가 성공",
//       });
//     } catch (err) {
//       logger.error(`insertMovies Query error\n: ${JSON.stringify(err)}`);
//       return false;
//     } finally {
//       connection.release();
//     }
//   } catch (err) {
//     logger.error(`insertMovies DB Connection error\n: ${JSON.stringify(err)}`);
//     return false;
//   }
// }

// /*영화 정보 업데이트(path variable 요구됌)*/ 
// exports.updateMovie = async function(req,res){
//   const{ title,genr,director,price } = req.body; //body에 있는 값들을 불러옴 
//   const { id } =req.params;

//   //Update의 경우에는 4가지 column 중 하나만 할 수도 있기 때문에 validation은 이 값이 있냐/없냐로 판단
//   if(title && typeof title !== "string"){
//     return res.send({
//       isSuccess: false,
//       code: 400, 
//       message: "문자열이 아닙니다.",
//     });
//   }
//   if(genr && typeof genr !== "string"){
//     return res.send({
//       isSuccess: false,
//       code: 400, 
//       message: "문자열이 아닙니다.",
//     });
//   }
//   if(director && typeof director !== "string"){
//     return res.send({
//       isSuccess: false,
//       code: 400, 
//       message: "문자열이 아닙니다.",
//     });
//   }

//   //price:int형인지 검증
//   if(price && isNaN(price)){
//     return res.send({
//       isSuccess: false,
//       code: 400, 
//       message: "숫자가 아닙니다.",
//     });
//   }

//   try {
//     const connection = await pool.getConnection(async (conn) => conn); //pool->mysql 접근 객체
//     try {
//       const isValidMovieId = await indexDao.isValidMovieId(connection,id);//id 유효성 검사
//       if(!isValidMovieId){
//         return res.send({
//           isSuccess: false,
//           code: 410, // 요청 실패시 400번대 코드(성공시 200번대)
//           message: "유효한 영화 idx가 아님",
//         });
//       }
      
//       const [rows] = await indexDao.updateMovies(connection,id,title,genr,director,price); //mysql connection 

//       return res.send({
//         isSuccess: true,
//         code: 200, // 요청 실패시 400번대 코드(성공시 200번대)
//         message: "영화 수정 성공",
//       });
//     } catch (err) {
//       logger.error(`updateMovies Query error\n: ${JSON.stringify(err)}`);
//       return false;
//     } finally {
//       connection.release();
//     }
//   } catch (err) {
//     logger.error(`updateMovies DB Connection error\n: ${JSON.stringify(err)}`);
//     return false;
//   }
// }

// /*영화 삭제*/
// exports.deleteMovie = async function(req,res){
//   const { id } = req.params;

//   try {
//     const connection = await pool.getConnection(async (conn) => conn); //pool->mysql 접근 객체
//     try {
//       const isValidMovieId = await indexDao.isValidMovieId(connection,id);//id 유효성 검사
//       if(!isValidMovieId){
//         return res.send({
//           isSuccess: false,
//           code: 410, // 요청 실패시 400번대 코드(성공시 200번대)
//           message: "유효한 영화 idx가 아님",
//         });
//       }

//       const [rows] = await indexDao.deleteMovie(connection,); //mysql connection 

//       return res.send({
//         result: rows,
//         isSuccess: true,
//         code: 200, // 요청 실패시 400번대 코드(성공시 200번대)
//         message: "영화 삭제 성공",
//       });
//     } catch (err) {
//       logger.error(`deleteMovie Query error\n: ${JSON.stringify(err)}`);
//       return false;
//     } finally {
//       connection.release();
//     }
//   } catch (err) {
//     logger.error(`deleteMovie DB Connection error\n: ${JSON.stringify(err)}`);
//     return false;
//   }
// }

