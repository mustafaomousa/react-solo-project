const express = require('express');
const asyncHandler = require('express-async-handler');
// const { where } = require('sequelize/types');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');

// const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Post, User, Make, Model, Tag, TagJoin, RerumbleJoin } = require('../../db/models');

const router = express.Router();

router.post('/rerumble', asyncHandler(async (req, res) => {
    const { userId, postId } = req.body;
    const rerumble = await RerumbleJoin.create({ userId, postId });
    return res.json({ rerumble })
}));

router.delete('/rerumble', asyncHandler(async (req, res) => {
    const { userId, postId } = req.body;
    const rerumble = await RerumbleJoin.findOne({ userId, postId });
    rerumble.destroy();
    return res.json({ rerumble })
}));

router.get('/rerumble', asyncHandler(async (req, res) => {
    const rerumbles = await RerumbleJoin.findAll({ include: [{ model: Post, include: [User] }] });
    return res.json({ rerumbles });
}));

router.get('/', asyncHandler(async (req, res) => {

    const posts = await Post.findAll({
        include: [{ model: User }, { model: Make }, { model: Model }, { model: Tag }],
        order: [['updatedAt', 'DESC']],

    });
    return res.json({ posts });

}));

router.get('/tags', asyncHandler(async (req, res) => {
    const tags = await Tag.findAll();

    return res.json({ tags });

}));

router.get('/:tag', asyncHandler(async (req, res) => {
    const tagName = req.params.tag;
    console.log(tagName)
    const tagPosts = await Post.findAll({
        include: [{ model: Tag, where: { name: `#${tagName}` } }, { model: User }, { model: Make }, { model: Model }],
        order: [['updatedAt', 'DESC']]
    });
    return res.json({ tagPosts })
}));

router.post('/', asyncHandler(async (req, res) => {

    const { title, content, body, tags, makeId, modelId, userId } = req.body;

    const newPost = await Post.create({ title, content, body, makeId, modelId, userId });
    const postId = newPost.dataValues.id;

    for (let tag in tags) {
        const dbTag = await Tag.findOne({ where: { name: tags[tag] } });
        if (!dbTag) {
            const newTag = await Tag.create({ name: tags[tag] });
            const tagId = newTag.dataValues.id;
            const newPostTag = await TagJoin.create({ tagId, postId });
            newPostTag.save();
        } else {
            const tagId = dbTag.dataValues.id;
            const newPostTag = await TagJoin.create({ tagId, postId })
            newPostTag.save();
        }
    }

    return res.json({ newPost });

}));

module.exports = router;