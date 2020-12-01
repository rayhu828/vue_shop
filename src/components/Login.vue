<template>
    <div class="login_container">
        <div class="login_box"></div>
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
}
</style>