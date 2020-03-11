const { Category } = require("../models/category");
const { Blog } = require("../models/blog");
const slugify = require("slug");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res, next) => {
  const { name } = req.body;
  // new table --> slugify --> new-table
  let slug = slugify(name).toLowerCase();
  let category = new Category({ name, slug });

  category
    .save()
    .then(data => res.status(201).json(data))
    .catch(err => {
      res.status(400).json({ error: errorHandler(err) });
    });
};

exports.list = (req, res, next) => {
  Category.find({})
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({ error: errorHandler(err) }));
};

exports.read = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();

  // {index: true} 한 이유
  Category.findOne({ slug })
    .then(category => {
      Blog.find({ categories: category })
        .populate("categories", "_id name slug")
        .populate("tags", "_id name slug")
        .populate("postedBy", "_id name")
        .select(
          "_id title slug excerpt categories postedBy tags createdAt updatedAt"
        )
        .then(data => res.json({ category: category, blogs: data }))
        .catch(err => res.status(400).json({ error: errorHandler(err) }));
    })
    .catch(err => res.status(400).json({ error: errorHandler(err) }));
};

exports.remove = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();

  // {index: true} 한 이유
  Category.findOneAndRemove({ slug })
    .then(() => res.json({ message: "카테고리가 성공적으로 삭제되었습니다." }))
    .catch(err => res.status(400).json({ error: errorHandler(err) }));
};
