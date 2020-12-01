<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar-box">
                <img src="../assets/logo.png"/>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="less" scoped>
.login_container {
    position: relative;
    background-color: #2B4B6B;
    height: 100%;
}
.login_box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background-color: #FFFFFF;
    border-radius: 3px;
    .avatar-box {
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 130px;
        height: 130px;
        border: 1px solid #EEEEEE;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #DDDDDD;
        background-color: #FFFFFF;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #EEEEEE;
        }
    }
}
</style>