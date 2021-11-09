import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import signinPic from '../../public/18:8.png';

export default function Signin({
    loginHandler,
    isInClick,
    openInModal,
    openUpModal,
    closeInModal,
    setIsOk,
    setMessage,
    socialHandler,
}) {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
    });

    const convertUpBtn = () => {
        closeInModal();
        openUpModal();
    };
    const inputHandler = (e) => {
        setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
    };

    const loginRequestHandler = () => {
        if (loginInfo.email === '' || loginInfo.password === '') {
            setMessage('이메일과 비밀번호를 입력해주세요!');
            setIsOk(true);
        } else {
            axios
                .post(
                    `${process.env.NEXT_PUBLIC_URL}/signin`,
                    {
                        email: loginInfo.email,
                        password: loginInfo.password,
                    },
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true,
                    },
                )
                .then((res) => {
                    if (res.data.message === 'login complete') {
                        setMessage('로그인 완료');
                        setIsOk(true);
                        loginHandler(res.data.data);
                        closeInModal();
                    }
                })
                .catch((err) => {
                    setMessage('이메일과 비밀번호를 확인하세요!');
                    setIsOk(true);
                });
        }
    };

    const kakaoRequestHandler = () => {
        const id = 'e2ed2f35d68876df07c519f31cf7541e';
        const clientUrl = 'https://tiny-honey-tip.vercel.app/content';
        const url = `https://kauth.kakao.com/oauth/authorize?client_id=${id}&redirect_uri=${clientUrl}&response_type=code`;
        window.location.assign(url);
    };

    useEffect(async () => {
        const url = new URL(window.location.href);
        const authorizationCode = url.searchParams.get('code');
        const getAccessToken = async (authorizationCode) => {
            await axios.post(`${process.env.NEXT_PUBLIC_URL}/signin/kakao`, { authorizationCode }).then((res) => {
                setMessage('로그인 완료');
                setIsOk(true);
                socialHandler(res.data.data);
                closeInModal();
            });
        };
        if (authorizationCode) {
            await getAccessToken(authorizationCode);
        }
    });

    return (
        <>
            {isInClick === true ? (
                <>
                    <div className="modal modal-signin">
                        <div className="back">
                            <div className="container">
                                <svg
                                    className="btn btn--modal--close"
                                    onClick={closeInModal}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 10.5858L5.63604 4.22182L4.22182 5.63604L10.5858 12L4.22182 18.364L5.63604 19.7782L12 13.4142L18.364 19.7782L19.7782 18.364L13.4142 12L19.7782 5.63604L18.364 4.22182L12 10.5858Z"
                                        fill="black"
                                    />
                                </svg>
                                <h1 className="logo">Tiny Honey Tip</h1>
                                <h2 className="title">Sign In</h2>
                                <div className="input-container">
                                    <div className="area">
                                        <div className="label">Email</div>
                                        <input
                                            className="email"
                                            name="email"
                                            type="text"
                                            placeholder="Email을 입력하세요"
                                            onChange={(e) => inputHandler(e)}
                                            value={loginInfo.email}
                                        />
                                    </div>
                                    <div className="area">
                                        <div className="label">Password</div>
                                        <input
                                            className="password"
                                            name="password"
                                            type="password"
                                            placeholder="password를 입력하세요"
                                            onChange={(e) => inputHandler(e)}
                                            value={loginInfo.password}
                                        />
                                    </div>
                                    <div className="welcomeimg">
                                        <Image src={signinPic} alt="sign in picture" />
                                    </div>
                                    <div className="line line-signin">
                                        <button className="btn btn-modal" onClick={loginRequestHandler}>
                                            Sign In
                                        </button>
                                        <button className="btn btn-modal--kakao" onClick={kakaoRequestHandler}>
                                            <img
                                                className="logo--kakao"
                                                src="https://developers.kakao.com/tool/resource/static/img/button/kakaolink/kakaolink_btn_medium.png"
                                            />
                                            카카오 로그인
                                        </button>
                                    </div>
                                    <div className="footer-modal">
                                        <span>계정이 없으신가요?</span>
                                        <button className="btn--convert" onClick={convertUpBtn}>
                                            Sign up
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <a className="header__btn" onClick={openInModal}>
                    Sign In
                </a>
            )}
        </>
    );
}
