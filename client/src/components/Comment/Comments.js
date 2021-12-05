import React, { useState, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import OthersHashTag from "../HashTag/OthersHashTag";
import { useRecoilValue, useRecoilState } from "recoil";
import { loginState, editcommentMode } from "../../recoil/recoil";
import MyComment from "./MyComment";

const Comment = styled.div`
  position: relative;
  display: flex;
  border: 1px red solid;
  height: 200px;
  border-radius: 20px;
  margin-top: 10px;
  margin-bottom: 40px;
  box-shadow: 4px 4px 4px rgb(85, 85, 85);
  transition: all 0.1s ease-in-out;
  &:hover {
    color: black;
    box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5), 7px 7px 20px 0px rgba(0, 0, 0, 0.1),
      4px 4px 5px 0px rgba(0, 0, 0, 0.1);
    transform: scale(1.1);
  }
  &:hover:after {
    left: 0;
    width: 100%;
  }
`;
const Profile = styled.div`
  position: relative;
  /* background-color: red; */
  width: 80px;
  height: 140px;
  margin: 40px;
`;
const ProfileImg = styled.img`
  border-radius: 50%;
  width: 80px;
  height: 80px;
  position: absolute;
  /* background-color: white; */
`;

const NickName = styled.span`
  /* background-color: yellowgreen; */
  position: absolute;
  bottom: 5px;
  text-align: center;
  width: 100%;
`;

const ContentBox = styled.div`
  /* background-color: yellow; */

  margin-top: 20px;
  position: relative;
  width: 400px;
  height: 140px;
`;

const Content = styled.div`
  position: absolute;
  top: 0px;
  left: 10px;
  width: 370px;
  height: 60px;
  padding-left: 10px;
  padding-right: 10px;
  /* border: 1px gray solid; */
  /* background-color: whitesmoke; */
`;

const ContentInput = styled.div`
  position: absolute;
  top: 0px;
  left: 10px;
  width: 460px;
  height: 80px;
  padding-left: 10px;
  padding-right: 10px;

  > input,
  div {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 370px;
    height: 60px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .change-comment {
    position: absolute;
    /* top: -20px; */
    right: -20px;
    border: none;
    background-color: rgb(192, 251, 255);
    background-image: linear-gradient(
      to right bottom,
      rgba(255, 255, 255, 0.9) 0,
      rgba(0, 0, 0, 0) 60%,
      rgba(0, 0, 0, 0) 100%
    );
    width: 80px;
    height: 40px;
    transition: all 0.5s ease;
    border-radius: 20px;
  }

  > .change-comment:hover {
    transform: scale(1.1);
    background-image: linear-gradient(
      to left top,
      rgba(255, 255, 255, 0.9) 0,
      rgba(0, 0, 0, 0) 60%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .delete-comment {
    position: absolute;
    top: 60px;
    right: -20px;
    border: none;
    background-color: rgb(192, 251, 255);
    background-image: linear-gradient(
      to right bottom,
      rgba(255, 255, 255, 0.9) 0,
      rgba(0, 0, 0, 0) 60%,
      rgba(0, 0, 0, 0) 100%
    );
    width: 80px;
    height: 40px;
    transition: all 0.5s ease;
    border-radius: 20px;
  }

  .delete-comment:hover {
    transform: scale(1.1);
    background-image: linear-gradient(
      to left top,
      rgba(255, 255, 255, 0.9) 0,
      rgba(0, 0, 0, 0) 60%,
      rgba(0, 0, 0, 0) 100%
    );
  }
`;

const HashTagWrapper = styled.div`
  /* display: flex; */
  position: absolute;
  /* background-color: pink; */

  width: 370px;
  height: 40px;
  bottom: 0px;
  left: 10px;
  white-space: nowrap;
  border: none;
  /* overflow-y: scroll; */

  /* overflow: auto; */
  /* white-space: nowrap; */
`;
const Date = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
`;

function Comments({ img, nickname, text, initialTags, date, commentId, editable }) {
  const [clickedBtn, setClickedBtn] = useState("");
  const divRef = useRef(null);
  const inputRef = useRef(null);
  //editMode가 전역변수면 모든댓글창이 영향을받는다.
  const [editMode, setEditMode] = useState(false);
  const [comment, setComment] = useState(text);
  // const [prevComment, setPrevComment] = useState(text);
  const [changeOrNot, setChangeOrNot] = useState(false);
  const prevComment = text;

  useEffect(() => {
    setComment(text);
  }, [text]);

  const username = "김코딩";
  //! 이것도 서버에서하래 유저권한 관련된건 다 서버에서 토큰이랑 비교후 결정
  // const editable = nickname === username; //

  function getCommentId(e) {
    e.preventDefault(); //필요한가?
    setClickedBtn(e.target.className);
  }

  useEffect(() => {
    if (clickedBtn === "delete-comment") {
      deleteComment();
    }
    if (clickedBtn === "change-comment") {
      changeComment();
    }
  }, [clickedBtn]);

  // 댓글 삭제요청 보내는 함수
  function deleteComment() {
    if (commentId === undefined) console.log("삭제하려는 댓글이 존재하지 않습니다."); //숫자라서 정확하기 명시해야함

    console.log(clickedBtn, commentId);
    //axios : 전체배열 다시 받아서 전체댓글recoil 바꾼다.

    setClickedBtn("");
  }
  // // 댓글 수정요청 보내는 함수 -> 어떻게하는거야..
  function changeComment() {
    if (commentId === undefined) console.log("수정하려는 댓글이 존재하지 않습니다.");
    if (editMode) console.log("수정완료");
    else console.log("댓글수정 클릭");
    setEditMode(!editMode);

    // console.log(clickedBtn, commentId);

    setClickedBtn("");
  }
  //댓글 바꾸는 함수
  const ChangeHandler = (e) => {
    setComment(e.target.value);
    //axios
    // setComment(e.target.value);
  };
  useEffect(() => {
    setComment(prevComment);
    setEditMode(false);
  }, [changeOrNot]);
  return (
    <>
      <Comment>
        <Profile>
          <ProfileImg src={img}></ProfileImg>
          <NickName>{nickname}</NickName>
        </Profile>
        <ContentBox>
          {!editable ? (
            <Content name="comment">{text}</Content>
          ) : (
            <ContentInput>
              {!editMode ? (
                <div
                  id="commentRead"
                  ref={divRef}
                  //defaultValue로 하면 버그생겨서 콘솔에러떠도 우선 value로 함.

                  name="comment"
                >
                  {comment}
                </div>
              ) : (
                <input
                  id="commentChange"
                  ref={inputRef}
                  type="text"
                  value={comment} //defaultValue로 하면 버그생겨서 콘솔에러떠도 우선 value로 함.
                  onChange={(e) => ChangeHandler(e)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      ChangeHandler(e);
                      setEditMode(false);
                    }
                  }}
                  name="comment"
                />
              )}
              <button className="change-comment" onClick={(e) => getCommentId(e)}>
                {editMode ? "수정완료" : "댓글수정"}
              </button>
              {!editMode ? (
                <button className="delete-comment" onClick={(e) => getCommentId(e)}>
                  댓글삭제
                </button>
              ) : (
                <button className="delete-comment" onClick={() => setChangeOrNot(!changeOrNot)}>
                  수정취소
                </button>
              )}
            </ContentInput>
          )}
          <HashTagWrapper>
            <OthersHashTag initialTags={initialTags} />
          </HashTagWrapper>
        </ContentBox>
        <Date>작성날짜 : {date}</Date>
      </Comment>
    </>
  );
}
function PropsEqual(prev, next) {
  console.log(prev.text === next.text);
  return prev.text === next.text;
}
export default React.memo(Comments);
// export default Comments;
