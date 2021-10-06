import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

export default function MyPage({ userInfo, setUserInfo }) {
    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/mypage`;
    const [myPost, setMyPost] = useState([]);
    const [myScrap, setMyScrap] = useState([]);
    const [alert, setAlert] = useState([]);

    const getData = async () => {
        console.log(userInfo.accessToken);
        console.log(apiUrl);

        const res = await axios
            .get(apiUrl, {
                headers: { cookie: userInfo.accessToken, 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            .then((res) => {
                setMyPost(res.data.data.myPost);
                setMyScrap(res.data.data.myScrap);
                let tmpAlert = alert.slice();
                for (let el of myPost) {
                    tmpAlert.push({
                        title: el.title,
                        like: el.like,
                        dislike: el.dislike,
                        scrap: el.scrap,
                    });
                }

                setAlert(tmpAlert);
            });
    };

    useEffect(() => {
        if (!!userInfo.accessToken) {
            getData();
        }
    }, [userInfo]);
    const [editBtn, setEditBtn] = useState(false);
    const [img, setImg] = useState(userInfo.profile_img);

    const inputHandler = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const fileUpload = async (e) => {
        setImg(e.target.files);
    };

    const editHandler = () => {
        setEditBtn(editBtn ? false : true);
        if (editBtn) editMyPage();
    };

    function editMyPage() {
        const formData = new FormData();
        formData.append('file', img[0]);
        formData.append('username', userInfo.username);
        formData.append('email', userInfo.email);
        for (let key of formData.entries()) {
            console.log(`${key}`);
        }
        axios
            .patch(`${process.env.NEXT_PUBLIC_URL}/mypage`, formData, {
                headers: {
                    cookie: `accessToken=${userInfo.accessToken}`,
                    'content-type': 'multipart/form-data',
                },
                withCredentials: true,
            })
            .then((res) => {
                setUserInfo({
                    ...userInfo,
                    username: res.data.data.userInfo.username,
                    profile_img: res.data.data.userInfo.profile_img,
                    accessToken: res.data.data.newToken,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

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
                    window.alert('회원탈퇴가 완료되었습니다.');

                    axios
                        .get(`${process.env.NEXT_PUBLIC_URL}/signout`, {
                            headers: {
                                authorization: userInfo.accessToken,
                            },
                        })
                        .then((res) => {
                            if (res.data.message !== 'byebye') {
                                window.alert('탈퇴가 완료되었습니다.');
                                useRouter.push({
                                    pathname: '/',
                                });
                            }
                        });
                }
            });
    };

    return (
        <>
            {console.log('알러틑트', alert)}
            {myPost || myScrap || alert ? (
                <div className="my_wrapper">
                    <div className="my_back_img"></div>
                    <div className="my_side_bar">
                        <div className="my_info">
                            <div className="my_profile_img">
                                <Image
                                    alt="profile img"
                                    src={userInfo.profile_img ? userInfo.profile_img : '/postDefaultImage.jpg'}
                                    unoptimized={false}
                                    width={500}
                                    height={500}
                                />
                            </div>

                            <button className="edit_my_profile_btn">
                                <Image
                                    onClick={editHandler}
                                    src="https://cdn.discordapp.com/attachments/881710985335934979/892220588406476800/edit.png"
                                    width={28}
                                    height={28}
                                    alt="edit button"
                                />
                            </button>
                            <div className="my_userInfo_container">
                                <h3 className="my_user_name">{userInfo.username} 벌님 🐝 안녕하세요</h3>
                                {editBtn ? (
                                    <>
                                        <div className="my_user_infoBody edit_user_info">
                                            <form>
                                                <input
                                                    type="file"
                                                    id="profile_img_uploader"
                                                    onChange={fileUpload}
                                                    accept="image/png, image/jpeg"
                                                />
                                                <br />
                                                <span className="my_edit_form">
                                                    이메일 <br />
                                                    {userInfo.email}
                                                </span>
                                                <br />
                                                <br />
                                                <label htmlFor="userName" className="my_edit_form">
                                                    이름: <br />
                                                </label>
                                                <input
                                                    type="text"
                                                    id="userName"
                                                    placeholder={userInfo.username}
                                                    maxLength="8"
                                                    minLength="1"
                                                    onChange={(e) => inputHandler(e)}
                                                    name="username"
                                                />
                                            </form>
                                        </div>
                                        <button className="deleteBtn">
                                            <Image
                                                onClick={deleteSure}
                                                src="https://cdn.discordapp.com/attachments/881710985335934979/892220570425507870/userDeleteBtn.png"
                                                width={28}
                                                height={28}
                                                alt="delete button"
                                            />
                                        </button>
                                    </>
                                ) : (
                                    <div className="my_user_infoBody ">
                                        <p id="email">
                                            이메일 <span>{userInfo.email}</span>
                                        </p>
                                        <p id="username">
                                            이름 <span>{userInfo.username}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div id="my_alert">
                            <h3 id="my_alert_title">my alert</h3>
                            <ul className="alert_list">
                                {alert.length > 0 ? (
                                    (alert.map((el) => {
                                        if (el.like.length > 0) {
                                            return el.like.map((li) => {
                                                return (
                                                    <li className="alert_list" key={el.user_id}>
                                                        ✔️{el.title} 을 {li.User.username} 벌님이 💛를 눌렀습니다.
                                                    </li>
                                                );
                                            });
                                        } else null;
                                    }),
                                    alert.map((el) => {
                                        if (el.dislike.length > 0) {
                                            return el.dislike.map((dis) => {
                                                return (
                                                    <li className="alert_list" key={el.user_id}>
                                                        ✔️{el.title} 을 {dis.User.username} 벌님이 💔를 눌렀습니다.
                                                    </li>
                                                );
                                            });
                                        } else null;
                                    }),
                                    alert.map((el) => {
                                        if (el.scrap.length > 0) {
                                            return el.scrap.map((li) => {
                                                return (
                                                    <li className="alert_list" key={el.user_id}>
                                                        ✔️{el.title} 을 {li.User.username} 벌님이 🗂를 눌렀습니다.
                                                    </li>
                                                );
                                            });
                                        } else null;
                                    }))
                                ) : (
                                    <h3 id="no_alert">✔️ 알림이 없습니다.</h3>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="my_Allpost_wrapper">
                        <div className="my_post_wrapper">
                            <h3 className="my_post">✍️ My Posts</h3>
                            <div className="my_post_container">
                                {myPost.length > 0 ? (
                                    myPost.map((el) => {
                                        return (
                                            <div className="my_post_item" key={el?.id}>
                                                <div className="my_post_item_inner">
                                                    <div className="my_best_item_header">
                                                        <Link href={`/post/${el?.id}`}>
                                                            <div className="my_header_image">
                                                                <div className="my_img_inner">
                                                                    <Image
                                                                        layout="fill"
                                                                        alt={el?.title}
                                                                        src={el?.posts[0]?.img}
                                                                        unoptimized="false"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                        <div className="my_post_desc">
                                                            <div className="post_desc_title">
                                                                <Link href={`/post/${el?.id}`}>
                                                                    <div className="my_post_title_font">
                                                                        {el?.title}
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                            <div className="post_desc_text">
                                                                <Link href={`/post/${el?.id}`}>
                                                                    <div className="post_text">
                                                                        <div>{el?.posts[0].content}</div>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                            <div className="my_post_bot">
                                                                <div className="my_post_category">{el?.category}</div>
                                                                <div className="post_desc_user">
                                                                    <div className="post_desc_userinfo">
                                                                        <div className="my_post_author post_dislike_num">
                                                                            💔 &nbsp;{el?.dislike?.length}
                                                                        </div>
                                                                        <div className="my_post_author post_like_num">
                                                                            💛 &nbsp;
                                                                            {el?.like?.length}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <h3 className="empty">my post is empty</h3>
                                )}
                            </div>
                        </div>
                        <div className="my_scrap_wrapper">
                            <h3 className="my_scrap">📒 My Scrapped Posts</h3>
                            <div className="my_scrap_container">
                                {myScrap.length > 0 ? (
                                    myScrap.map((el) => {
                                        return (
                                            <div className="my_post_item" key={el?.id}>
                                                <div className="my_post_item_inner">
                                                    <div className="my_best_item_header">
                                                        <Link href={`/post/${el?.id}`}>
                                                            <div className="my_header_image">
                                                                <div className="my_img_inner">
                                                                    <Image
                                                                        layout="fill"
                                                                        alt={el?.title}
                                                                        src={el.post_container.posts[0]?.img}
                                                                        unoptimized="false"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                        <div className="my_post_desc">
                                                            <div className="post_desc_title">
                                                                <Link href={`/post/${el?.id}`}>
                                                                    <div className="my_post_title_font">
                                                                        {el?.title}
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                            <div className="post_desc_text">
                                                                <Link href={`/post/${el?.id}`}>
                                                                    <div className="post_text">
                                                                        <div>
                                                                            {el?.post_container.posts[0]?.content}
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                            <div className="my_post_bot">
                                                                <a className="my_post_category">{el?.category}</a>
                                                                <div className="post_desc_user">
                                                                    <div className="post_desc_userinfo">
                                                                        <div className="my_post_author post_dislike_num">
                                                                            💔 &nbsp;
                                                                            {el?.dislike?.length
                                                                                ? el?.dislike?.length
                                                                                : 0}
                                                                        </div>
                                                                        <div className="my_post_author">
                                                                            💛 &nbsp;
                                                                            {el?.like?.length ? el?.like?.length : 0}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <h3 className="empty">my scrap is empty</h3>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div id="no_data">페이지를 다시 불러와 주세요</div>
            )}
            <a className="top-btn" onClick={() => window.scrollTo(0, 0)}>
                <Image
                    src="https://img.icons8.com/ios/50/000000/collapse-arrow--v1.png"
                    alt="top-button"
                    layout="fill"
                    unoptimized="false"
                />
            </a>
        </>
    );
}

// export async function getServerSideProps(context) {
//     const token = context.req.headers.cookie;
//     const apiUrl = `${process.env.NEXT_PUBLIC_URL}/mypage`;
//     const res = await axios.get(apiUrl, {
//         headers: { cookie: token, 'Content-Type': 'application/json' },
//     });

//     const post = res.data.data.myPost;
//     const scrap = res.data.data.myScrap;
//     const alert = [];

//     for (let el of post) {
//         alert.push({
//             title: el.title,
//             like: el.like,
//             dislike: el.dislike,
//             scrap: el.scrap,
//         });
//     }

//     return {
//         props: {
//             myPost: post,
//             myScrap: scrap,
//             alert: alert,
//         },
//     };
// }
