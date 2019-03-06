<template>
  <div>
    <div class="header-wrapper">
      <header class="header">
        <div class="container">
          <h1><a href="#"><img src="../assets/Logo.svg" /></a></h1>
          <ul class="nav">
            <li class="nav-item">
              <el-dropdown trigger="click" class="nav-dropdown">
                <span class="el-dropdown-link">
                  {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :href="resetPassword">修改密码</el-dropdown-item>
                  <el-dropdown-item :href="logout">退出系统</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
          </ul>
        </div>
      </header>
    </div>
    <el-container>
      <el-aside width="300">
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>

//import { mapGetters } from 'vuex'
//import api from '@/api'
//import MainMenu from '@/components/MainMenu'

export default {
  name: 'DefaultLayout',
  components: {
    // 'app-menu': MainMenu
  },
  data () {
    return {
      open: false,
      username: 'violet'
    }
  },
  computed: {
    //...api.urls,
    //...mapGetters({
    //  username: 'username'
    //})
  }
}
</script>

<style>
body {
  background: #f0f3f8;
}
.container {
  width: 1140px;
  margin: 0 auto;
  height: 100%;
  box-sizing: border-box;
}
.header-wrapper {
  position: fixed;
  height: 80px;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 1500;
}
.header {
  height: 80px;
  background-color: #fff;
  color: #fff;
  top: 0;
  left: 0;
  width: 100%;
  line-height: 80px;
  z-index: 100;
  position: relative;
}
.header h1 {
  margin: 0;
  float: left;
  font-size: 32px;
  font-weight: 400;
}
.header h1 a {
  color: #333;
  text-decoration: none;
  display: block;
}
.header img {
  vertical-align: sub;
}
.nav {
  float: right;
  margin: 0;
  padding: 0;
}
.nav .nav-item {
  margin: 0;
  float: left;
  list-style: none;
  position: relative;
  cursor: pointer;
}
.nav-dropdown span {
  display: block;
  width: 100%;
  font-size: 16px;
  color: #888;
  line-height: 40px;
  transition: .2s;
  padding-bottom: 6px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
