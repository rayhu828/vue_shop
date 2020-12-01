<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar-box">
        <img src="../assets/logo.png" />
      </div>
      <el-form label-width="0" class="login_form">
        <el-form-item>
          <el-input></el-input>
        </el-form-item>
        <el-form-item>
          <el-input></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.login_container {
  position: relative;
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  border-radius: 3px;
  .avatar-box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 130px;
    height: 130px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #dddddd;
    background-color: #ffffff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }
  }
}
.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns {
    display: flex;
    justify-content: flex-end;
}
</style>