import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/modules/auth/views/Login.vue'
import Signup from '@/modules/auth/views/Signup.vue'
import ForgotPassword from '@/modules/auth/views/ForgotPassword.vue'
import ResetPassword from '@/modules/auth/views/ResetPassword.vue'

// Match
import MatchApplications from '@/modules/match/views/MatchApplications.vue'
import AddMatchApplication from '@/modules/match/views/AddMatchApplication.vue'
import Matches from '@/modules/match/views/Matches.vue'
import CompletedMatches from '@/modules/match/views/CompletedMatches.vue'
import AddMatchResult from '@/modules/match/views/AddMatchResult.vue'

// Community
import Posts from '@/modules/community/views/Posts.vue'
import PostDetail from '@/modules/community/views/PostDetail.vue'
import UpdatePost from '@/modules/community/views/UpdatePost.vue'
import CreatePost from '@/modules/community/views/CreatePost.vue'

import Home from '@/views/Home.vue'  
import NotificationPage from '@/modules/chat/views/NotificationPage.vue'
import MyChatPage from '@/modules/chat/views/MyChatPage.vue'
import FriendLayout from '@/modules/friends/layout/FriendLayout.vue'
import FriendsList from '@/modules/friends/views/FriendsList.vue'
import FriendRequestsList from '@/modules/friends/views/FriendRequestsList.vue'
import SendFriendRequest from '@/modules/friends/views/SendFriendRequest.vue'
import Mypage from '@/modules/mypage/views/Mypage.vue'

// Kakao OAuth
import KakaoCallback from '@/modules/auth/views/KakaoCallback.vue'

const routes = [
  // Auth
  { path: '/login', name: 'Login', component: Login, meta: { hideHeader: true } },
  { path: '/signup', name: 'Signup', component: Signup, meta: { hideHeader: true } },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword, meta: { hideHeader: true } },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword, meta: { hideHeader: true } },

  // Match
  { path: '/matchApplication/add', name: 'matchApplication/add', component: AddMatchApplication },
  { path: '/matchApplications', name: 'matchApplications', component: MatchApplications },
  { path: '/matches', name: 'matches', component: Matches },
  { path: '/completedMatches', name: 'completedMatches', component: CompletedMatches},
  { path: '/:matchId/match-results/add', name: 'addMatchResult', component: AddMatchResult },

  // Community
  {
    name:'posts',
    path:'/community/posts',
    component:Posts
  },
    // 상세
  {
    path: '/community/posts/:postId',
    name: 'post-detail',
    component: PostDetail,
    props: true
  },
    // 수정
  {
    path: '/community/posts/:postId/update',
    name: 'update-post',
    component: UpdatePost,
    props: true 
  },
    // 등록
  {
    path: '/community/posts/create',
    name: 'create-post',
    component: CreatePost,
    props: true 
  },

  // Home
  { path: '/', name: 'Home', component: Home },
  { path: '/notification', name: 'NotificationPage', component: NotificationPage},
  { path: '/chatrooms/list', name: 'MyChatPage', component: MyChatPage},

  // Friends
  { path: '/friends', component: FriendLayout, children: [
    { path: 'list', name: 'FriendsList', component: FriendsList },
    { path: 'requests', name: 'FriendRequestsList', component: FriendRequestsList },
    { path: 'requests/send', name: 'SendFriendRequest', component: SendFriendRequest }
  ]},
  // MyPage
  { path: '/mypage', name: 'Mypage', component: Mypage },


  // Kakao OAuth
  { 
    path: '/oauth/callback', 
    name: 'KakaoCallback', 
    component: KakaoCallback, 
    meta: { hideHeader: true } 
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
