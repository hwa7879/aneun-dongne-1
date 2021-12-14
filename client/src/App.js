import React, { useEffect } from "react";
import { Route, useHistory } from "react-router-dom";

import axios from "axios";
import "./App.css";

import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";

import { loginState } from "./recoil/recoil";

import { token, loading, userInfo } from "./recoil/recoil";

import { Mainpage, Home, MyPage, DetailPage } from "./pages";
import Header from "./components/Header/Header";

const App = () => {
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [info, setInfo] = useRecoilState(userInfo);
  const accessToken = useRecoilValue(token);
  // const [accessToken, setAccessToken] = useRecoilState(token);
  const history = useHistory();
  const [isLoading, setIsLoading] = useRecoilState(loading);
  console.log(accessToken);
  //카톡
  const authorizationCode = new URL(window.location.href).searchParams.get("code");
  const isAuthenticated = async () => {
    await console.log(accessToken);
    // if(!accessToken)
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/info`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log("홈으로 가잔");
        setInfo(res.data.data.userInfo);
        setIsLogin(true);
      });
  };

  console.log(accessToken);
  //쿠키안에 jwt 있는지 보고 로긴상태결정
  useEffect(() => {
    if (accessToken) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
    console.log(accessToken);
  }, [accessToken]);

  const handleResponseSuccess = () => {
    isAuthenticated();
  };

  // 카톡 로긴
  // useEffect(() => {
  //   function getToken() {
  //     if (authorizationCode) {
  //     }
  //     // setIsLoading(true);
  //     axios
  //       .post(
  //         `${process.env.REACT_APP_API_URL}/user/kakaologin`,
  //         {
  //           authorizationCode,
  //         },
  //         { withCredentials: true }
  //       )
  //       .then(async (res) => {
  //         console.log(res.data, res.status);
  //         if (res.status === 201) {
  //           // 서버에서 응답으로 리프레시 토큰(쿠키), 액세스 토큰 옴
  //           // 받은 액세스 토큰을 전역상태에 저장
  //           setAccessToken(res.data.data.accessToken);
  //           // 액세스 토큰으로 유저정보 요청
  //           // 유저정보 전역 상태에 저장
  //           // setInfo(res.data.data.userInfo);
  //           // 로그인 상태 true
  //           handleResponseSuccess();
  //           setIsLoading(false);
  //         }
  //         console.log(res);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         // setIsLoading(false);
  //         // setIsLogin(false);
  //       });
  //   }

  //   getToken();
  //   //카톡로긴버튼 눌렀을때만 실행되도록하기//
  // }, []);

  return (
    <>
      <Header handleResponseSuccess={handleResponseSuccess} />
      <Route exact path="/" component={Mainpage} />
      <Route exact path="/home" component={Home} />
      <Route path="/mypage" component={MyPage} />
      <Route exact path="/detailpage/:id" component={DetailPage} />
      {/* <Redirect from="*" to="/" /> */}
    </>
  );
};

export default App;
// "/detailpage/:id"
