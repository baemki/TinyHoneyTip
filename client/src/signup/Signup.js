import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import signinPic from '../../public/18:8.png';

export default function Signup({
    openUpModal,
    openInModal,
    closeUpModal,
    isUpClick,
    okHandler,
    isOk,
    setIsOk,
    message,
    setMessage,
}) {
    const [ischeckEmail, setCheckEmail] = useState(false);
    const [ischeckPassword, setCheckPassword] = useState(false);
    const [isconfirm, setConfirm] = useState(false);
    const [signupInfo, setSignupInfo] = useState({
        email: '',
        password: '',
        username: '',
    });
    const convertInBtn = () => {
        closeUpModal();
        openInModal();
    };
    const inputHandler = (e) => {
        setSignupInfo({ ...signupInfo, [e.target.name]: e.target.value });
    };
    const checkEmail = (e) => {
        let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if (regExp.test(e.target.value)) setCheckEmail(true);
        else setCheckEmail(false);
    };
    const checkPassword = (e) => {
        let regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,12}$/;
        if (regExp.test(e.target.value)) setCheckPassword(true);
        else setCheckPassword(false);
    };
    const checkConfirmPassword = (e) => {
        if (e.target.value !== '' && e.target.value === signupInfo.password) setConfirm(true);
        else setConfirm(false);
    };

    const signupRequestHandler = () => {
        if (
            !signupInfo.email ||
            !signupInfo.password ||
            !signupInfo ||
            !ischeckEmail ||
            !ischeckPassword ||
            !isconfirm
        ) {
            setIsOk(true);
            setMessage('모든 항목을 올바르게 입력하세요');
        } else {
            axios
                .post(
                    `${process.env.NEXT_PUBLIC_URL}/signup`,
                    {
                        email: signupInfo.email,
                        password: signupInfo.password,
                        username: signupInfo.username,
                    },
                    { 'Content-Type': 'application/json', withCredentials: true },
                )
                .then((res) => {
                    if (res.data.message === 'ok') {
                        setMessage('회원가입 완료');
                        okHandler();
                        closeUpModal();
                    } else if (res.data.message === 'already email exist') {
                        window.alert('already email exist');
                    } else if (res.data.message === 'already username exist') {
                        window.alert('already username exist');
                    }
                });
        }
    };
    return (
        <>
            {isUpClick === true ? (
                <>
                    <div className="modal modal-signup">
                        <div className="back">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="container">
                                    <svg
                                        className="btn btn--modal--close"
                                        onClick={closeUpModal}
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
                                    <h2 className="title">Sign Up</h2>
                                    <div className="input-container">
                                        <div className="area">
                                            <div className="label">Email</div>
                                            <input
                                                name="email"
                                                className="email"
                                                type="email"
                                                onBlur={checkEmail}
                                                placeholder="Email을 입력하세요"
                                                onChange={(e) => inputHandler(e)}
                                                value={signupInfo.email}
                                            />
                                            {signupInfo.email.length === 0 ? null : (
                                                <div className="checkmsg">
                                                    {!ischeckEmail ? '올바른 이메일 형식이 아닙니다' : null}
                                                </div>
                                            )}
                                        </div>
                                        <div className="area">
                                            <div className="label">User Name</div>
                                            <input
                                                maxLength="8"
                                                name="username"
                                                className="username"
                                                type="username"
                                                placeholder="User Name 최대 8글자"
                                                onChange={(e) => inputHandler(e)}
                                                value={signupInfo.username}
                                            />
                                            {signupInfo.username.length === 0 ? null : (
                                                <div className="checkmsg">
                                                    {signupInfo.username.length > 1
                                                        ? null
                                                        : '올바른 닉네임을 입력해주세요.'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="area">
                                            <div className="label">Password</div>
                                            <input
                                                name="password"
                                                className="password"
                                                type="password"
                                                onBlur={checkPassword}
                                                placeholder="영문/숫자 조합 8~12글자"
                                                onChange={(e) => inputHandler(e)}
                                                value={signupInfo.password}
                                            />{' '}
                                            {signupInfo.password.length === 0 ? null : (
                                                <div className="checkmsg">
                                                    {!ischeckPassword ? '올바른 비밀번호 형식이 아닙니다' : null}
                                                </div>
                                            )}
                                        </div>
                                        <div className="area">
                                            <div className="label">Confirm Password</div>
                                            <input
                                                name="confirmPassword"
                                                type="password"
                                                className="password"
                                                onBlur={checkConfirmPassword}
                                                placeholder="영문/숫자 조합 8~12글자"
                                                onChange={(e) => inputHandler(e)}
                                                value={signupInfo.confirmPassword}
                                            />{' '}
                                            {signupInfo.password.length === 0 ? null : (
                                                <div className="checkmsg">
                                                    {!isconfirm ? '비밀번호가 일치하지 않습니다.' : null}
                                                </div>
                                            )}
                                        </div>
                                        <div className="welcomeimg">
                                            <Image src={signinPic} alt="sign in picture" />
                                        </div>
                                        <div className="line line-signup">
                                            <button className="btn-modal" onClick={signupRequestHandler}>
                                                Sign Up
                                            </button>
                                        </div>
                                        <div className="footer-modal">
                                            <span>계정이 있으신가요?</span>
                                            <button className="btn--convert" onClick={convertInBtn}>
                                                Sign in
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            ) : (
                <a className="header__btn" onClick={openUpModal}>
                    Sign Up
                </a>
            )}
        </>
    );
}
