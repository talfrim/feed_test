import welcomePage from './pages/Initial setup/WelcomePage'
import feedPage from './pages/tweets_display/FeedPage'
import insertExpCode from './pages/Initial setup/InsertExpCodePage'

const routes = [
    {
      /* The initial page will always be insert code page. The user will go to the app if he is logged in.
      This can be done like here: https://stackoverflow.com/questions/53578974/conditional-route-in-vue-js */
      path: "/",
      name: "default",
      // component: () => import("./pages/tweets_display/FeedPage"), 
      get component(){
        if (localStorage.getItem("registeredToExperiment") != null) {
          // The participant is registered to an experiment
          return feedPage
        }
        else if (localStorage.getItem("providedCredentials") != null) {
          // The participant already provided credentials
          return insertExpCode
        }
        else return welcomePage
      }
    },
    {
      path: "/insertExpCode",
      name: "insertExpCode",
      component: () => import("./pages/Initial setup/InsertExpCodePage"),
    },
    {
        path: "/welcomePage",
        name: "welcomePage",
        component: () => import("./pages/Initial setup/WelcomePage"),
    },
    {
        path: "/feed",
        name: "feed",
        component: () => import("./pages/tweets_display/FeedPage"), 
    },
    {
      path: "/searchBox",
      name: "searchBox",
      component: () => import("./pages/search/SearchBoxPage"), 
    },
    {
      path: "/search", // /:query
      name: "search",
      component: () => import("./pages/search/SearchPage"), 
    },
    {
      path: "/notifications",
      name: "notifications",
      component: () => import("./pages/notifications tab/NotificationsPage"), 
    },
    {
      path: "/messaging",
      name: "messaging",
      component: () => import("./pages/messaging/MessagingPage"), 
    },
    {
      path: "/userPagePublic/:userName/:userId",
      name: "userPage",
      component: () => import("./pages/user/UserPagePublic"), 
    },
    {
      path: "/followersPage/:userName",
      name: "followersPage",
      component: () => import("./pages/user/UserFollowersPage"), 
    },
    {
      path: "/friendsPage/:userName",
      name: "friendsPage",
      component: () => import("./pages/user/UserFriendsPage"), 
    },
    {
      path: "/tweetPage/:tweetId",
      name: "tweetPage",
      component: () => import("./pages/tweets_display/TweetPage"), 
    },
]

export default routes