/**
 * Created by user on 23-07-2016.
 */


module.exports = function (app, passport) {

/*app.get(['/' ,'login'],function (req,res) {
  res.render('index',{
    title : 'socketChatApp',

  } )

});*/

  app.get('/signup', function (req, res) {
    res.render('signup', {
      title: 'ZeynDoc',
      message: req.flash('signupMessage'),
      errors : req.validationErrors(),
    });

  });

  app.post('/signup',

      function (req,res) {


        req.checkBody('name', 'Name is required').notEmpty();

        req.checkBody('mobile', 'Mobile Number not Valid').isMobilePhone('en-IN');
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        var errors = req.validationErrors();

        if (errors) {
          res.render('signup', {
            errors: errors,
            title: 'ZeynDoc',
            message: req.flash('signupMessage'),
          });
        }else {


          passport.authenticate('local-signup', {
            successRedirect: '/socket',
            failureRedirect: '/signup',
            failureFlash: true
          })(req, res);
        }
      }



  );

  app.get(['/login' ,'/'], function (req, res) {
    if (req.isAuthenticated()) {

      req.flash('alreadyLoggedIn' ,'You are already Logged In :) , Log Out to login from other account ');
      res.redirect('/socket');

    }else{

      res.render('login', {
        title: 'Login Page',
        message: req.flash('loginMessage'),
          errors : req.validationErrors()
      });

    }
  });


  app.post('/login', function (req,res) {
      req.checkBody('mobile', 'Mobile Number not Valid').isMobilePhone('en-IN');
      req.checkBody('password', 'Password is required').notEmpty();
      var errors = req.validationErrors();
      if (errors) {
          res.render('login', {
              errors: errors,
              title: 'ZeynDoc',
              message: req.flash('loginMessage'),
          });
      }else {


          passport.authenticate('local-login', {
              successRedirect: '/socket',
              failureRedirect: '/login',
              failureFlash: true
          })(req, res);
      }
/*      passport.authenticate('local-login', {

    successRedirect: '/socket',
    failureRedirect: '/login',
    failureFlash: true*/
  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });



}
