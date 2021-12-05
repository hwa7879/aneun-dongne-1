import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import MapInRoom from "../../components/kakao-map/MapInRoom/MapInRoom-index";
import notImageYet from "../../img/not-image-yet.png";
import { Styled } from "./style";
import KeyWordTemplate from "../../components/HashTag/KeyWordTemplate";
import CommentTemplate from "../../components/Comment/CommentTemplate";
import MyComment from "../../components/Comment/MyComment";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { defaultcomments, loginState, loginModal } from "../../recoil/recoil";
function DetailPage({ match }) {
  const { id } = match.params;
  const contentId = parseInt(id, 10);
  // const [updateComment, setUpdateComment] = useRecoilState(updatecomment);
  const [overview, setOverview] = useState("");
  const [pageURL, setPageURL] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [placeAddr, setPlaceAddr] = useState("");
  const [title, setTitle] = useState("");
  const [placeLocation, setPlaceLocation] = useState({ lon: 0, lat: 0 });
  const [readMore, setReadMore] = useState(false);
  const { pathname } = useLocation();
  //로긴모달창,로긴상태
  const isLogin = useRecoilValue(loginState);
  const setIsLoginOpen = useSetRecoilState(loginModal);
  //기존댓글
  const [defaultComment, setDefaultComment] = useRecoilState(defaultcomments);
  const [like, setLike] = useState(77); //나중에 서버로부터 받아오게 된다.
  const [likeOrNot, setLikeOrNot] = useState(true); //이것도 서버에서 받아와야함
  useEffect(() => {
    // 페이지 이동시 스크롤 맨 위로 오게한다.
    window.scrollTo(0, 0);
    axios
      .get(
        `http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?serviceKey=W%2B9SSMZKirmvzGAhoiAssJvfD9PYntkIlyMO6niTjMi5nwx%2BrUP%2FiQqrLccqOmuxPU2w7iyFQkUC41ddNiePUg%3D%3D`,
        {
          params: {
            MobileOS: "ETC",
            MobileApp: "TourAPI3.0_Guide",
            areaCode: 33,
            sigunguCode: 7,
            cat1: "A01",
            defaultYN: "Y",
            firstImageYN: "Y",
            areacodeYN: "Y",
            catcodeYN: "Y",
            addrinfoYN: "Y",
            mapinfoYN: "Y",
            overviewYN: "Y",
            contentId: contentId,
            //   contentTypeId:el.contenttypeid

            // pageNo:2,
          },
        },
        { "content-type": "application/json" }
        //withCrentials:'true'는 Access-Control-Allow-Origin :'*'일때 사용하면 안된다.
      )
      .then((res) => {
        // console.log(res.data.response.body.items.item);
        const { mapx, mapy } = res.data.response.body.items.item;
        // console.log(mapx, mapy);
        setPlaceLocation({ lat: mapy, lon: mapx });
        setImgURL(res.data.response.body.items.item.firstimage);
        setTitle(res.data.response.body.items.item.title);
        setPlaceAddr(res.data.response.body.items.item.addr1);
        if (res.data.response.body.items.item.homepage) {
          setPageURL(res.data.response.body.items.item.homepage.split('<a href="')[1].split('"')[0]);
          // setPageURL(res.data.response.body.items.item.homepage);
        }
        setOverview(res.data.response.body.items.item.overview);

        // ?
      });
  }, [pathname]);
  useEffect(() => {
    //axios.get
    //새로고침=>전체댓글을 받는다. => 리코일전체댓글을 바꾼다. 오케이
    //댓글이 수정,삭제되면? => 어차피 전체댓글을 받음 . ㄱㅊ음
    //좋아요도 마찬가지.
    //하 이거 어케하냐
  }, []);

  const overView = overview.replace(/(<([^>]+)>)/gi, "");
  let FirstOverView = overView.slice(0, 130);
  let SecondOverView = overView.slice(130);

  const readMoreHandler = () => {
    //readMore=true일때는 더보기, false일때는 간략히 버튼이 보이게 함
    setReadMore(!readMore);
  };

  // useEffect(() => {
  //   if (updateComment) {

  //   }
  //   setUpdateComment(false);
  // }, [updatecomment]);
  //! 이 글에 내가 좋아요를 눌렀는지 싫었는지도 DB에 저장해야할듯
  //! 초기화 안되게
  const LikeHandler = () => {
    if (!isLogin) {
      setIsLoginOpen(true);
    }
    setLikeOrNot(!likeOrNot);
    //좋아요한 상태면 -1
    if (likeOrNot) setLike(like - 1);
    else setLike(like + 1);
  };

  return (
    <>
      <Styled.Div>
        <Styled.Title>{title}</Styled.Title>
        {pageURL ? (
          <Styled.PageURL href={pageURL} target="_blank" title={`새창 : ${title} 홈페이지`}>
            홈페이지로 이동
          </Styled.PageURL>
        ) : null}
        {/* 여기도 사진 넘기기기능 넣자. */}
        {imgURL ? <Styled.Img src={imgURL} /> : <Styled.Img src={notImageYet} />}
        {overView ? (
          // !이거 css로 할수있대 나중에 ㄱ
          <Styled.Overview>
            <span className="first-overview">{FirstOverView}</span>
            <Styled.ReadMoreBtn className={!readMore ? null : "hide"} onClick={readMoreHandler}>
              ...더보기
            </Styled.ReadMoreBtn>
            <span className={readMore ? null : "hide"}>{SecondOverView}</span>
            <Styled.CutDownBtn className={readMore ? null : "hide"} onClick={readMoreHandler}>
              간략히
            </Styled.CutDownBtn>
          </Styled.Overview>
        ) : null}

        <MapInRoom placeLocation={placeLocation} placeAddress={placeAddr} title={title} />
        <KeyWordTemplate keywordDummy={keywordDummy} />
        <Styled.LikeBtn onClick={LikeHandler}>
          <i className={likeOrNot ? "fas fa-heart" : "hide"}></i>
          <i className={likeOrNot ? "hide" : "far fa-heart"}>{like}</i>
        </Styled.LikeBtn>

        <MyComment></MyComment>
        <CommentTemplate commentDummy={defaultComment}></CommentTemplate>

        {/* 어쨌든 요청받은 댓글을 defaultComment에 넣기만 하면 된다. */}
      </Styled.Div>
    </>
  );
}

export default DetailPage;

const keywordDummy = ["#왕릉", "#공원"];
