const { Blog } = require("../models/blog");
const { Tag } = require("../models/tag");
const slugify = require("slug");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res, next) => {
  const { name } = req.body;

  let slug = slugify(name).toLowerCase();
  let tag = new Tag({ name, slug });

  tag
    .save()
    .then(data => res.status(201).json(data))
    .catch(err => {
      res.status(400).json({ error: errorHandler(err) });
    });
};

exports.list = (req, res, next) => {
  Tag.find({})
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({ error: errorHandler(err) }));
};

exports.read = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();

  // {index: true} 한 이유, slug 위주로 queries 문 작성
  Tag.findOne({ slug })
    .then(tag => {
      Blog.find({ tags: tag })
        .populate("categories", "_id name slug")
        .populate("tags", "_id name slug")
        .populate("postedBy", "_id name")
        .select(
          "_id title slug  excerpt categories postedBy tags createdAt updatedAt"
        )
        .then(data => res.json({ tag: tag, blogs: data }))
        .catch(err => res.status(400).json({ error: errorHandler(err) }));
    })
    .catch(err => res.status(400).json({ error: errorHandler(err) }));
};

exports.remove = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();

  // {index: true} 한 이유, slug 위주로 queries 문 작성
  Tag.findOneAndRemove({ slug })
    .then(() => res.json({ message: "태그가 성공적으로 삭제되었습니다." }))
    .catch(err => res.status(400).json({ error: errorHandler(err) }));
};
