if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js");
const asyncWrap = require("./utils/asyncWrap.js");
const { listingSchema,reviewSchema } = require("./schema.js")
const Review = require("./models/review.js")
const listings = require("./routes/Listing.js");
const reviews = require("./routes/Review.js")
const users = require("./routes/Auth.js")
const session = require("express-session")  
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");
const MongoStore = require("connect-mongo");
const dbUrl = process.env.ATLAS_DB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, "/public")))
app.use(methodOverride("_method"));


const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto :{
    secret : `${process.env.SECRET}`
  },
  touchAfter:24 * 3600,
  
})
app.get("/",(req,res)=>{
  res.redirect('/listings')
})

store.on("error",()=>{
  console.log("Error in Mongo Session Store !",err);
})

const sessionOptions = {
  store,
  secret : `${process.env.SECRET}`,
  resave:false,
  saveUninitialized:false,
  cookie: {
    expires : Date.now() + 7 * 1000 * 24 * 60 * 60,
    maxAge: 7 * 1000 * 24 * 60 * 60,
    httpOnly: true
  }
}

app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user;
  next();
})



app.use('/listings',listings)
app.use('/listings/:id/reviews',reviews)
app.use("/",users)

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
  console.log(err.name)
  next(err);
})

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Some error Occured" } = err;
  res.status(statusCode).render("error.ejs", { err, statusCode });
})

app.listen(8080, () => {
  console.log("http://localhost:8080");
});