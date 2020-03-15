const { Blog } = require("../models/blog");
const { Category } = require("../models/category");
const { Tag } = require("../models/tag");
const { User } = require("../models/user");

const formidable = require("formidable");
const slugify = require("slug");
const stripHtml = require("string-strip-html");
const _ = require("lodash");
const { errorHandler } = require("../helpers/dbErrorHandler");
const fs = require("fs");
const { smartTrim } = require("../helpers/blog");

// Blog with photo should be sent as form-data not json data.
// You wont see the incoming data in req.body instead formidable package is used to parse form-data in the controller.

exports.create = (req, res) => {
  // https://m.blog.naver.com/PostView.nhn?blogId=scw0531&logNo=221159117976&proxyReferer=http%3A%2F%2F210.91.57.208%2Ftm%2Fnt%2Fnewchada.das
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "이미지를 업데이트 할 수 없습니다."
      });
    }

    // console.log("fields", fields);
    const { title, body, categories, tags, excerpt } = fields;

    if (!title || !title.length || title <= 1) {
      return res.status(400).json({
        error: "제목을 최소 한 글자 입력해주세요"
      });
    }

    if (!body || !body.length) {
      return res.status(400).json({
        error: "입력하신 내용의 길이가 너무 짧습니다."
      });
    }

    if (!categories || categories.length === 0) {
      return res.status(400).json({
        error: "적어도 한 개 이상의 카테고리를 선택해주세요."
      });
    }

    if (!tags || tags.length === 0) {
      return res.status(400).json({
        error: "적어도 한 개 이상의 테그를 선택해주세요"
      });
    }

    if (!excerpt || excerpt.length < 10) {
      return res.status(400).json({
        error: "10 글자 이상의 소개글을 작성해주세요"
      });
    }

    let blog = new Blog();
    blog.title = title;
    blog.body = body;
    blog.excerpt = smartTrim(excerpt, 60, " ", " ..."); // delimiter " ", appendix " ..."
    blog.slug = slugify(title).toLowerCase();
    blog.mtitle = `${title} | ${process.env.APP_NAME}`;
    blog.mdesc = stripHtml(body.substring(0, 160)); // Ignore HTML Tag
    blog.postedBy = req.user._id; // From signIn and express-jwt middleware

    // categories and tags
    let arrayOfCategories = categories && categories.split(",");
    // console.log("array", arrayOfCategories);
    // console.log(categories);
    let arrayOfTags = tags && tags.split(",");

    if (files.photo) {
      // 1 megabyte
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: "Image should be less then 1mb in size"
        });
      }

      blog.photo.data = fs.readFileSync(files.photo.path);
      blog.photo.contentType = files.photo.type;
    }

    blog
      .save()
      .then(result =>
        Blog.findByIdAndUpdate(
          result._id,
          { $push: { categories: arrayOfCategories } },
          { new: true, useFindAndModify: false }
        )
          .then(result =>
            Blog.findByIdAndUpdate(
              result._id,
              { $push: { tags: arrayOfTags } },
              { new: true, useFindAndModify: false }
            )
              .then(result => res.json(result))
              .catch(err => res.status(400).json({ error: errorHandler(err) }))
          )
          .catch(err => res.status(400).json({ error: errorHandler(err) }))
      )
      .catch(err => res.status(400).json({ error: errorHandler(err) }));
  });
};

// list, listAllBlogsCategoriesTags, read, remove, update
// Blog Model 확인해보기
exports.list = (req, res) => {
  Blog.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .select(
      "_id title slug excerpt categories tags postedBy createdBy updatedBy"
    )
    .then(data => res.json(data))
    .catch(err => res.json({ error: errorHandler(err) }));
};

exports.listAllBlogsCategoriesTags = (req, res) => {
  // limit coming from frontend
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  Blog.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select(
      "_id title slug excerpt categories tags postedBy createdBy updatedAt"
    )
    .then(blogs =>
      Category.find({})
        .then(categories =>
          Tag.find({})
            .then(tags =>
              res.json({ blogs, categories, tags, size: blogs.length })
            )
            .catch(err => res.json({ error: errorHandler(err) }))
        )
        .catch(err => res.json({ error: errorHandler(err) }))
    )
    .catch(err => res.json({ error: errorHandler(err) }));
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug })
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .select(
      "_id title body excerpt slug mtitle mdesc categories tags postedBy createdBy updatedAt"
    )
    .then(data => res.json(data))
    .catch(err => res.json({ error: errorHandler(err) }));
};

exports.remove = (req, res) => {
  console.log(req);
  const slug = req.params.slug.toLowerCase();
  Blog.findOneAndRemove({ slug })
    .then(data => res.json({ message: "성공적으로 글이 삭제되었습니다." }))
    .catch(err => res.json({ error: errorHandler(err) }));
};

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  // form data 타입의 데이터가 포함된 req를 form.parse 를 통해 form data를 파싱할 수 있습니다.
  // 주석 처리된 Do something !! 부분에서 fileds를 사용하여 form data의 키 값에 접근할 수 있습니다.
  // 예를 들어 form data내 id라는 값에 접근하려면 아래처럼 사용하면 됩니다.
  // const id = fileds.id

  Blog.findOne({ slug })
    .then(oldBlog => {
      let form = new formidable.IncomingForm();
      form.keepExtensions = true;

      form.parse(req, (err, fields, files) => {
        if (err)
          return res
            .status(400)
            .json({ error: "이미지를 업데이트 할 수 없습니다..." });

        // blog-one --> blog-one-about-react 로 변경시 비록 title은 변경되었어도
        // slug를 regenerate 할 수 없기 때문에 slug 값을 그대로 유지한다.
        // 그 이유는 blog를 일단 생성하면, 해당 blog의 url이 indexed by google 되기 때문이다.
        // SEO 에서는 slug 값을 변경하지 않아야 최적으로 동작한다.

        let slugBeforeMerge = oldBlog.slug;
        // This fields is getting from client side
        // 모든 fields를 update하는 것이 아닌 필요한 부분만 update 하기 위해 lodash.merge 사용.

        oldBlog = _.merge(oldBlog, fields);
        oldBlog.slug = slugBeforeMerge;

        // console.log("fields", fields);
        const { title, body, categories, tags, excerpt } = fields;

        if (title) {
          oldBlog.title = title;
        }

        if (excerpt) {
          oldBlog.excerpt = smartTrim(excerpt, 60, " ", " ...");
        }

        if (body) {
          oldBlog.mdesc = stripHtml(body.substring(0, 160));
          oldBlog.body = body;
        }

        if (categories) {
          oldBlog.categories = categories.split(",");
        }

        if (tags) {
          oldBlog.tags = tags.split(",");
        }

        if (files.photo) {
          if (files.photo.size > 100000000) {
            return res
              .status(400)
              .json({ error: "이미지사이즈는 반드시 1mb 이하야 합니다." });
          }
          oldBlog.photo.data = fs.readFileSync(files.photo.path);
          oldBlog.photo.contentType = files.photo.type;
        }

        oldBlog
          .save()
          .then(result => res.json(result))
          .catch(err => res.status(400).json({ error: errorHandler(err) }));
      });
    })
    .catch(err =>
      res.status(400).json({
        error: errorHandler(err)
      })
    );
};

exports.photo = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug })
    .select("photo")
    .then(blog => {
      res.set("Content-Type", blog.photo.contentType);
      res.send(blog.photo.data);
    })
    .catch(err => {
      res.status(400).json({ error: errorHandler(err) });
    });
};

exports.listRelated = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;
  const { _id, categories } = req.body.blog;

  Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
    .limit(limit)
    .populate("postedBy", "_id name profile")
    .select("title slug excerpt postedBy createdAt updatedAt")
    .then(blogs => res.json(blogs))
    .catch(err => res.status(400).json({ error: "Blogs Not Found!" }));
};

exports.listSearch = (req, res) => {
  console.log(req.query);
  const { search } = req.query;
  if (search) {
    Blog.find(
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { body: { $regex: search, $options: "i" } }
        ]
      },
      (err, blogs) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err)
          });
        }
        res.json(blogs);
      }
    ).select("-photo -body");
  }
};

exports.listByUser = (req, res) => {
  User.findOne({ username: req.params.username })
    .then(user => {
      let userId = user._id;
      Blog.find({ postedBy: userId })
        .populate("categories", "_id name slug")
        .populate("tags", "_id name slug")
        .populate("postedBy", "_id name username")
        .select("_id title slug postedBy createdAt updatedAt")
        .then(data => res.json(data))
        .catch(err => {
          return res.status(400).json({ error: errorHandler(err) });
        });
    })
    .catch(err => {
      return res.status(400).json({ error: errorHandler(err) });
    });
};

exports.like = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug })
    .select("like")
    .then(likeData => res.json(likeData))
    .catch(err => res.status(400).json({ error: errorHandler(err) }));
};

exports.likeUpdate = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  // console.log(req.profile._id);
  // console.log("slug", slug);
  Blog.findOne({ slug })
    .select("like")
    .then(oldBlog => {
      // console.log("oldBlog.like", oldBlog.like);
      // console.log("req.profile._id", req.profile._id);
      const checker = oldBlog.like.includes(req.profile._id);

      if (checker) {
        // oldBlog.like = oldBlog.like.filter(e => e !== req.profile._id);
        let likeIndex = oldBlog.like.indexOf(req.profile._id);
        oldBlog.like.splice(likeIndex, 1);
        // console.log("1", oldBlog.like);
      } else {
        oldBlog.like.push(req.profile._id);
        // console.log("2", oldBlog.like);
      }

      oldBlog
        .save()
        .then(result => {
          // console.log("result", result);
          return res.json(result);
        })
        .catch(err => res.status(400).json({ error: errorHandler(err) }));
    })
    .catch(err => res.status(400).json({ error: errorHandler(err) }));
};
