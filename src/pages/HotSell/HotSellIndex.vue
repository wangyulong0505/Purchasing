<template>
    <div class="login-container">
        <div class="header">
            <div class="logo">
                <div class="logo-img">
                    <img :src="require('@/common/image/shangh1.png')" />
                </div>
                <p class="logo-desc">同城热销</p>
            </div>
        </div>
        <div class="cont">
            <form class="card" autocomplete="off">
                <div class="input-row">
                    <label>
                        <img :src="require('@/common/image/login_user.png')" />
                    </label>
                    <input autocomplete="off" v-model="userId" type="text" id="userId" placeholder="请输入用户名" />
                </div>
                <div class="input-row">
                    <label>
                        <img :src="require('@/common/image/login_pwd.png')" />
                    </label>
                    <input autocomplete="off" v-model="userPwd" type="password" id="userPwd" placeholder="请输入密码" />
                </div>
                <div class="login-row">
                    <button type="button" class="btn-block" id="log-in" @click="_login">登录</button>
                </div>
            </form>
        </div>
        <div class="footer" :class="{isHeight: resizeWin}">
            <img :src="require('@/common/image/logo_02.png')" alt="logo" />
        </div>
    </div>
</template>

<script>
import { GetItemSaleFor } from "@/common/script/api"
export default {
  data() {
    return {
      docHeight: document.documentElement.clientHeight,
      resizeWin: false,
      userId: '',
      userPwd: '',
      userChecked: false
    }
  },
  methods: {
    _login() {
      this.$indicator.open('登录中')
      GetItemSaleFor({
        start_date: '202104',
        item_no: '',
        region: '深圳'
      }).then((res) => {
        if (res.success) {
          
        } else {
          this.$messagebox({
            title: '提示',
            message: res.message
          })
        }
      }).then(() => {
        setTimeout(() => {
          this.$indicator.close()
        }, 1000)
      })
    }
  },
  created() { },
  mounted() {
    window.onresize = () => {
      var docHeight = document.documentElement.clientHeight
      if (this.docHeight > docHeight) {
        this.resizeWin = true
      } else {
        this.resizeWin = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background-image: url("../../common/image/login-bg-02.png");
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
.header {
  padding: 60px 1.5rem;
  .logo {
    text-align: center;
    height: auto;
    position: relative;
    color: white;
    border-bottom: none;
    .logo-img {
      img {
        width: 65%;
      }
    }
    .logo-desc {
      font-size: 23px;
      margin-top: 15px;
      color: #fff;
    }
  }
}
.cont {
  padding: 10px 1.5rem;
  overflow: auto;
  .card {
    overflow: hidden;
    border-radius: 6px;
    background-color: transparent;
    border: none;
    .input-row {
      height: 50px;
      position: relative;
      overflow: hidden;
      color: white;
      border-bottom: none;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
      label {
        position: absolute;
        padding: 12px 25px;
        width: auto;
        float: inherit;
        white-space: nowrap;
        font-family: "Helvetica Neue", Helvetica, sans-serif;
        line-height: 1.1;
      }
      input {
        padding-left: 60px;
        padding-right: 20px;
        width: 100%;
        border-radius: 30px;
        border: 1px solid #fff;
        height: 48px;
        box-shadow: none;
        background-color: transparent;
        font-size: 14px;
        color: #fff;
        &::-webkit-input-placeholder {
          color: #fff;
        }
        &::-webkit-autofill {
          background-color: transparent !important;
          background-image: none !important;
          color: #fff !important;
          box-shadow: 0 0 0px 1000px transparent inset !important;
        }
        &:-internal-autofill-selected {
          background-color: #fff !important;
          background-image: none !important;
          color: #fff !important;
        }
        &:focus {
          border: 1px solid #ffffff;
        }
      }
      img {
        float: right;
        width: 20px;
        height: 24px;
      }
      #userId {
        font-size: 14px;
      }
    }
    .login-row {
      height: 50px;
      margin-bottom: 10px;
      margin-top: 40px;
      .btn-block {
        width: 100%;
        letter-spacing: 4px;
        font-size: 16px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        border-radius: 30px;
        border: none;
        background-color: #00e7ff;
        color: #fff;
        &:active {
          background: rgba(0, 231, 255, 0.4);
        }
      }
    }
  }
}

.footer {
  &.isHeight {
    position: static;
    margin-top: 20px;
  }
  text-align: center;
  position: absolute;
  bottom: 40px;
  width: 100%;
  height: auto;
  img {
    width: 65%;
  }
}
</style>
