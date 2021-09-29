import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import pic from '../public/honeycomb.png';
import styles from '../styles/Tumbnail.module.css';
import Link from 'next/link';

export default function MyPage({ userInfo, setUserInfo }) {
    const [myPost, setMyPost] = useState([]);
    const [myScrap, setMyScrap] = useState([]);
    const [alert, setAlert] = useState({ scrap: [{ title: '', userName: '' }], like: [{ title: '', userName: '' }] });
    const [editBtn, setEditBtn] = useState(false);

    function getMyPage() {
        axios
            .get(`${process.env.NEXT_PUBLIC_URL}/myPage`, {
                headers: { cookie: { accessToken: userInfo.accessToken }, 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            .then((res) => {
                console.log('응답다다당ㅇ', res);
                if (res.message === 'Bad Request') return alert('다시 시도해주세요');
                setMyPost(res.data.data.myPost);
                setMyScrap(res.data.data.myScrap);
                setAlert(res.data.alert);
            })
            .catch((err) => {
                return console.log('오류입니다!', err);
            });
    }

    useEffect(() => {
        if (userInfo) {
            getMyPage();
            console.log('왜이래래애ㅐ앤', userInfo);
        }
    }, []);

    function editMyPage() {
        axios.patch(`${process.env.NEXT_PUBLIC_URL}/mypage`, { userInfo }).then((res) => {
            if (res.message === 'ok') {
                setUserInfo(res.data.userInfo);
                alert('수정이 완료되었습니다.');
            }
        });
    }

    const editHandler = () => {
        setEditBtn(editBtn ? false : true);
        if (editBtn) editMyPage();
    };

    const deleteSure = () => {
        if (window.confirm('정말 회원 탈퇴하시겠습니까?')) {
            window.open('exit.html', 'Thanks for Visiting!');
            userDelete;
        }
    };

    const userDelete = () => {
        axios
            .delete(`${process.env.NEXT_PUBLIC_URL}/user`, {
                data: { token: userInfo.token },
                withCredentials: true,
            })
            .then((res) => {
                if (res.message === 'byebye') {
                    alert('회원탈퇴가 완료되었습니다.');

                    axios
                        .get(`${process.env.NEXT_PUBLIC_URL}/signout`, {
                            headers: {
                                authorization: userInfo.accessToken,
                            },
                        })
                        .catch((error) => {
                            console.log('logout error 쿠키 삭제 실패', error);
                        });
                }
            });
    };

    return (
        <>
            <div className="my_wrapper">
                <div className="my_side_bar">
                    <div className="my_info">
                        <div className="my_profile_img">
                            <Image
                                src={
                                    'data:image/png;base64, ' +
                                    Buffer(userInfo.profile_img, 'binary').toString('base64')
                                }
                                alt="profile_image"
                                layout="fill"
                            />
                        </div>
                        <h3 className="my_user_name">{userInfo.username} 🐝 벌님 안녕하세요</h3>
                        <button className="edit_my_profile">
                            <Image
                                onClick={editHandler}
                                src="https://cdn.discordapp.com/attachments/881710985335934979/892220588406476800/edit.png"
                                width="7vw"
                                height="5vw"
                                alt="edit button"
                            />
                        </button>
                        <button>
                            <Image
                                onClick={deleteSure}
                                src="https://cdn.discordapp.com/attachments/881710985335934979/892220570425507870/userDeleteBtn.png"
                                width="7vw"
                                height="5vw"
                                alt="delete button"
                            />
                        </button>
                        {editBtn ? (
                            <div className="my_user_infoBody">
                                <form>
                                    이메일: {userInfo.email}
                                    <br />
                                    <br />
                                    <label htmlFor="userName">이름: </label>
                                    <input type="text" id="userName" placeholder="이름을 입력하세요"></input>
                                </form>
                            </div>
                        ) : (
                            <div className="my_user_infoBody">
                                이메일 {userInfo.email}
                                <br />
                                <br />
                                이름 {userInfo.username}
                            </div>
                        )}
                    </div>
                    <div id="my_alert">
                        <h3 id="my_alert_title"></h3>
                        <ul className="alert_scrap_list">
                            {alert?.scrap !== [{ title: '', userName: '' }]
                                ? alert?.scrap.map((el) => {
                                      <li className="alert_scrap_item">
                                          {userInfo.username}벌님의 {el.title}을 {el.userName} 님이 스크랩했습니다.
                                      </li>;
                                  })
                                : '알림이 없습니다.'}
                        </ul>
                        <ul className="alert_like_list">
                            {alert?.like !== [{ title: '', userName: '' }]
                                ? alert?.like.map((el) => {
                                      <li className="alert_like_item">
                                          {userInfo.username}벌님의 {el.title}을 {el.userName} 님이 좋아합니다.
                                      </li>;
                                  })
                                : '알림이 없습니다.'}
                        </ul>
                    </div>
                </div>
                <div className="my_Allpost_wrapper">
                    <div className="my_post_wrapper">
                        <h3 className="my_post">My Posts</h3>
                        <div className="my_post_container">
                            {myPost?.map((el) => {
                                return (
                                    <div className="my_post_item" key={el?.id}>
                                        <div className={styles.post_item_inner}>
                                            <div className={styles.post_item_option}>
                                                <div className={styles.post_overlay}></div>
                                            </div>
                                            <div className={styles.best_item_header}>
                                                <Link href={`/post/${el?.id}`}>
                                                    <a className={styles.header_image}>
                                                        <Image
                                                            layout="fill"
                                                            className={styles.img_inner}
                                                            alt={el?.title}
                                                            src={el?.post_page[0]?.img}
                                                        />
                                                    </a>
                                                </Link>
                                                <div className={styles.post_desc}>
                                                    <div className={styles.post_desc_title}>
                                                        <Link href={`/post/${el?.id}`}>
                                                            <a className={styles.post_title_font}>{el?.title}</a>
                                                        </Link>
                                                    </div>
                                                    <div className={styles.post_desc_text}>
                                                        <Link href={`/post/${el?.id}`}>
                                                            <a className={styles.post_text}>
                                                                {el?.post_page[0]?.content}
                                                            </a>
                                                        </Link>
                                                    </div>
                                                    <div className={styles.post_desc_category}>
                                                        <a className={styles.post_category}>{el?.category}</a>
                                                    </div>
                                                    <div className={styles.post_desc_user}>
                                                        <div className={styles.post_desc_userinfo}>
                                                            <div className={styles.post_author}>
                                                                💛 {el?.like.length}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="my_scrap_wrapper">
                        <h3 className="my_scrap">My Scrapped Posts</h3>
                        <div className="my_scrap_container">
                            {myScrap?.map((el) => {
                                return (
                                    <div className={styles.post_item} key={el?.id}>
                                        <div className={styles.post_item_inner}>
                                            <div className={styles.post_item_option}>
                                                <div className={styles.post_overlay}></div>
                                            </div>
                                            <div className={styles.best_item_header}>
                                                <Link href={`/post/${el?.id}`}>
                                                    <a className={styles.header_image}>
                                                        <Image
                                                            className={styles.img_inner}
                                                            alt={el?.title}
                                                            src={el?.post_page[0]?.img}
                                                        />
                                                    </a>
                                                </Link>
                                                <div className={styles.post_desc}>
                                                    <div className={styles.post_desc_title}>
                                                        <Link href={`/post/${el?.id}`}>
                                                            <a className={styles.post_title_font}>{el?.title}</a>
                                                        </Link>
                                                    </div>
                                                    <div className={styles.post_desc_text}>
                                                        <Link href={`/post/${el?.id}`}>
                                                            <a className={styles.post_text}>
                                                                {el?.post_page[0].content}
                                                            </a>
                                                        </Link>
                                                    </div>
                                                    <div className={styles.post_desc_category}>
                                                        <a className={styles.post_category}>{el?.category}</a>
                                                    </div>
                                                    <div className={styles.post_desc_user}>
                                                        <div className={styles.post_desc_userinfo}>
                                                            <div className={styles.post_author}>
                                                                💛 {el?.like.length}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <a className="top-btn" onClick={() => window.scrollTo(0, 0)}>
                <Image src={pic} alt="top-button" width="7vw" height="5vw" />
            </a>
        </>
    );
}
