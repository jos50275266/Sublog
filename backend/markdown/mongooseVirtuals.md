# Mongoose Virtuals

`Mongoose`에는, `MongoDB`에 저장되지않는 `A virtual`(가상의 프로퍼티)가 존재한다. `Virtuals`은 일반적으로 `documents`의 계산된 프로퍼티에 사용된다.

## First Virtual

`User` 모델이 존재한다고 생각해보자. 모든 유저는 하나의 `email`을 가지고있다.

- email: 'test@gmail.com'

위 이메일 형태에서 도메인 값만을 가져오고 싶은 경우를 생각해보자.

```javascript
const userSchema = mongoose.Schema({
  email: String
});

// 'email'값으로 부터 "domain"값을 추출하는 계산하는 "domain" virtual property를 생성
userSchema.virtual("domain").get(function() {
  return this.email.slice(this.email.indexOf("@") + 1);
});

const User = mongoose.model("User", userSchema);

let doc = await User.create({ email: "test@gmail.com" });
// 'domain' is now a property on User documents
doc.domain; // 'gmail.com'
```

`The Schema#virtual()`함수는 `VirtualType` Object를 리턴한다. 일반 document 프로퍼티와 달리, `virtuals`는 기반값을 가지고 있지않고 그리고 `Mongoose`는 `Virtuals`에 대해 어떤 유형의 강제(Coercion)도 수행하지 않는다.

그러나, `virtuals`는 `getters and setters`를 가지고 있고, 이 메소드들이 `computed properties`를 만드는데 아주 이상적으로 사용될 수 있다.

## Virtual Setters

`multiple properties`를 한 번에 설정하는데 `virtuals`를 사용할 수 있다 `custom setters on normal properties`의 대안으로써. 예를 들면, `firstName` and `lastName`이라는 두 개의 문자열 프로퍼티가 있다고 생각해보자. 이때 `fullName`이라는 `virtual`을 생성해 `firstName`과 `lastName` 두 프로퍼티를 한 번에 설정할 수 있게된다. `virtual getters and setters`에서 가장 중요한 점은 `this refers to the document the virtual is attached to.`

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String
});

// Virtual Property "FullName"을 getter and setter와 함께 생성
userSchema
  .virtual("fullName")
  .get(function() {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function(v) {
    // 'v' is the value being set, so use the value to set
    // 'firstName' and 'lastName'
    const firstName = v.substring(0, v.indexOf(" "));
    const lastName = v.substring(v.indexOf(" ") + 1);
    this.set({ firstName, lastName });
  });

const User = mongoose.model("User", userSchema);

const doc = new User();
// Vanilla JavaScript assignment triggers the setter

doc.fullName = "Hello World";

doc.fullName; // "Hello World"
doc.firstName; // "Hello"
doc.lastName; // "World"
```

## Virtuals in JSON

By default, `Mongoose`는 `a document` to `JSON`으로의 변환이 발생할 때 `Virtuals`을 포함시키지않는다. 예를 들면, `Express`의 `res.json()`을 이용해 `document`를 전달한다면, `Virtuals`은 by default로 포함되지 않을 것이다.

`Virtuals`을 `res.json()`에 포함시키기 위해서는, `toJSON schema option` to `{virtuals: true}` 을 포함시켜야한다.

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };
const userSchema = new Schema(
  {
    _id: Number,
    email: String
  },
  opts
);

// Create a virtual property "domain", that's computed from "email"
userSchema.virtual("domain").get(function() {
  return this.email.slice(this.email.indexOf("@") + 1);
});

const User = mongoose.model("User", userSchema);

const doc = new User({ _id: 1, email: "test@gmail.com" });

doc.toJSON().domain;
// 'gmail.com'
JSON.stringify(doc);
// {"_id": 1, "email": "test@gmail.com", "domain":"gmail.com", "id":"1"}

// To skip applying virtuals, pass 'virtuals: false' to 'toJSON()'
doc.toJSON({ virtuals: false }).domain; // undefined
```

## Limitations

`Mongoose Virtuals`은 `MongoDB`에 저장되지않기 때문에, `Mongoose Virtuals`를 기반으로 `Queries`를 작성할 수 없다.

```javascript
// Will **not** find any results, because `domain` is not stored in
// MongoDB.
const doc = await User.findOne({ domain: "gmail.com" });
doc; // undefined
```

If you want to query by a computed property, you should set the property using a [custom setter](https://mongoosejs.com/docs/tutorials/getters-setters.html) or [pre save middleware](https://mongoosejs.com/docs/middleware.html).

## Populate

`Mongoose`는 `populating virtuals`를 지원한다. `A populated virtual`은 다른 `Collection`의 `document`가 포함되어있다. `Populated Virtual`을 정의할 때, 반드시 아래 요소들을 명시해야한다.

- The `ref` option, which tells Mongoose which model to populate documents from.

- The `localField` and `foreignField` options. Mongoose will populate documents from the model in `ref` whose `foreignField` matches this document's `localField`.

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({ _id: Number, email: String });
const blogPostSchema = Schema({
  title: String,
  authorId: Number
});

// When you `populate()` the `author` virtual, Mongoose will find the
// first document in the User model whose `_id` matches this document's
// `authorId` property.

blogPostSchema.virtual("author", {
  ref: "User",
  localField: "authorId",
  foreignField: "_id",
  justOne: true
});

const User = mongoose.model("User", userSchema);
const BlogPost = mongoose.model("BlogPost", blogPostSchema);

await BlogPost.create({ title: "Introduction to Mongoose", authorId: 1 });
await User.create({ _id: 1, email: "test@gmail.com" });

const doc = await BlogPost.findOne().populate("author");
doc.author.email; // 'test@gmail.com'
```

// https://thecodebarbarian.com/introducing-mongoose-5.html
