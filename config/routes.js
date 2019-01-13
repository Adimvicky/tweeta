/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /': 'PageController.index',
  'GET /users/:handle' : 'PageController.index',
  'GET /login' : { view : 'pages/login'},
  'GET /register' : { view : 'pages/register'},
  'GET /logout' : 'UserController.logout',
  'POST /signup' : 'UserController.signup',
  'POST /signin' : 'UserController.signin',

  'GET /users' : 'UserController.getUsers',
  'PUT /users/follow' : 'UserController.followUser',
  'PUT /users/unfollow' : 'UserController.unfollowUser',
  'GET /users/following' : 'UserController.getFollowing',
  'GET /users/followers' : 'UserController.getFollowers',

  'POST /tweets' : 'TweetController.postTweet',
  'PUT /tweets/like' : 'TweetController.likeOrUnlikeTweet',
  'PUT /tweets/retweet' : 'TweetController.retweet',

  'GET /chat' : 'ChatRoomController.joinChat',
  'PUT /chat' : 'ChatRoomController.sendChat'

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
