const { User, like, dislike, comment, scrap, post_container, post } = require('../../models');
const jwt = require('jsonwebtoken');
const { Op, where } = require('sequelize');
require('dotenv').config();

module.exports = {
    getmypage: async (req, res) => {
        console.log('쿠키', req);
        const accessToken = req.cookies.accessToken;
        try {
            if (!accessToken) {
                res.status(404).json({ message: 'Bad Request' });
            } else {
                const Token = await jwt.verify(accessToken, process.env.ACCESS_SECRET);
                console.log('마이페이지토큰', Token);
                if (!Token) res.status(404).json({ message: 'Bad Request' });
                else {
                    const myPost = await post_container.findAll({
                        where: { user_id: Token.id },
                        attributes: ['id', 'title', 'category'],
                        include: [
                            {
                                model: post,
                                attributes: ['content', 'img', 'id'],
                            },
                        ],
                    });

                    for (let onePost of myPost) {
                        onePost.dataValues.like = await like.findAll({
                            where: { post_id: onePost.id },
                            attributes: ['user_id'],
                            include: [
                                {
                                    model: User,
                                    attributes: ['username'],
                                },
                            ],
                        });
                        onePost.dataValues.dislike = await dislike.findAll({
                            where: { post_id: onePost.id },
                            attributes: ['user_id'],
                            include: [
                                {
                                    model: User,
                                    attributes: ['username'],
                                },
                            ],
                        });
                        onePost.dataValues.scrap = await scrap.findAll({
                            where: { post_id: onePost.id },
                            attributes: ['user_id'],
                            include: [
                                {
                                    model: User,
                                    attributes: ['username'],
                                },
                            ],
                        });
                    }

                    // console.log('마이포스트', myPost[0]);

                    const myScrap = await scrap.findAll({
                        where: { user_id: Token.id },
                        attributes: ['post_id'],
                        include: [
                            {
                                model: post_container,
                                attributes: ['title', 'category', 'user_id', 'id'],
                                include: [
                                    {
                                        model: post,
                                        attributes: ['content', 'img', 'id'],
                                    },
                                ],
                            },
                        ],
                    });

                    // console.log(myScrap[0], '마이스크랩222');

                    for (let oneScrap of myScrap) {
                        // console.log(oneScrap);
                        oneScrap.dataValues.like = await like.findAll({
                            where: { post_id: oneScrap.dataValues.post_id },
                            attributes: ['user_id'],
                        });
                        oneScrap.dataValues.dislike = await dislike.findAll({
                            where: { post_id: oneScrap.dataValues.post_id },
                            attributes: ['user_id'],
                        });
                        oneScrap.dataValues.scrap = await scrap.findAll({
                            where: { post_id: oneScrap.dataValues.post_id },
                            attributes: ['user_id'],
                        });
                    }

                    // ---------------------------------------- alert 시작 -------------------------------------------------------

                    console.log('성공');

                    res.status(200).json({
                        message: 'ok',
                        data: {
                            myPost: myPost,
                            myScrap: myScrap,
                        },
                    });
                }
            }
        } catch (err) {
            console.log('캐치에러다', err);
            res.status(400).json({ message: 'Bad Request', data: User });
        }
    },

    editmypage: async (req, res) => {
        const accessToken = req.cookies.accessToken;
        try {
            if (!accessToken) {
                res.status(400).json({ message: 'Bad Request' });
            } else {
                const token = await jwt.verify(accessToken, process.env.ACCESS_SECRET);
                if (!token) res.status(404).json({ message: 'No token' });
                else {
                    console.log(req.file.location, req.body.username, token);
                    const email = req.body.email;
                    const username = req.body.username;

                    if (username && req.file.location) {
                        await User.update(
                            {
                                username,
                                profile_img: req.file.location,
                            },
                            { where: { email: token.email } },
                        );
                    } else if (username && !req.file.location) {
                        await User.update(
                            {
                                username,
                            },
                            { where: { email: token.email } },
                        );
                    } else if (!username && req.file.location) {
                        await User.update(
                            {
                                profile_img: req.file.location,
                            },
                            { where: { email: token.email } },
                        );
                    }

                    const updateInfo = await User.findOne({
                        where: { id: token.id },
                        attributes: ['email', 'username', 'profile_img'],
                    });
                    const newToken = await jwt.sign(token, process.env.ACCESS_SECRET);
                    res.status(200).json({
                        message: 'ok',
                        data: {
                            userInfo: updateInfo,
                            newToken: newToken,
                        },
                    });
                }
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: 'Bad Request' });
        }
    },
};
