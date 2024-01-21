<script setup>
import { ref } from 'vue'
import useUserInfoStore from '@/stores/userInfo.js';
import { useTokenStore } from '@/stores/token.js';
const userInfoStore = useUserInfoStore();
const tokenStore = useTokenStore();

// giving user-info in Pinia to this responsive variable
const userPwds = ref({
    oldPassword: '',
    newPassword: '',
    rePassword: ''
});
const validateRePassword = (rule, value, callback) => {
    // 'this.newPassword' holds the value of the newPassword field
    // 'value' is the value of the rePassword field
    if (value !== userPwds.value.newPassword) {
        callback(new Error('Please match the new password.'));
    } else {
        callback();
    }
}
const rules = {
    oldPassword: [
        {
            required: true,
            message: '请输入旧密码',
            trigger: 'blur'
        },
        {
            pattern: /^\S{5,16}$/,
            message: '长度为5~16位非空字符',
            trigger: 'blur'
        }
    ],
    newPassword: [
        {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
        },
        {
            pattern: /^\S{5,16}$/,
            message: '长度为5~16位非空字符',
            trigger: 'blur'
        }
    ],
    rePassword: [
        {
            required: true,
            message: '请再次输入新密码',
            trigger: 'blur'
        },
        {
            validator: validateRePassword,
            trigger: 'blur'
        },
        {
            pattern: /^\S{5,16}$/,
            message: '长度为5~16位非空字符',
            trigger: 'blur'
        }
    ]
};
// change user-info
import { userPwdUpdateService } from '@/api/user.js';
import { ElMessage, ElMessageBox } from "element-plus";
import router from "@/router/index.js";

const updateUserPwd = async () => {
    ElMessageBox.confirm(
        '确定更改密码?',
        '请思考',
        {
            confirmationButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
        }
    ).then(async () => {
        // invoke API
        console.log(userPwds.value)
        let result = await userPwdUpdateService(userPwds.value);

        // 1. delete JWT-token and user-info in Pinia
        tokenStore.removeToken();
        userInfoStore.removeInfo();

        // 2.Jump back to login page
        await router.push('/login');
        ElMessage.success(result.msg || '更改密码成功');
    }).catch(err => {
        if (err === null || err.message === null || err.message === '')
            ElMessage.info('已取消');
    });
};
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span><strong>重置密码</strong></span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userPwds" :rules="rules" label-width="160px" size="large">
                    <el-form-item label="旧密码:" prop="oldPassword">
                        <el-input v-model="userPwds.oldPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码:" prop="newPassword">
                        <el-input v-model="userPwds.newPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="再次确认新密码:" prop="rePassword">
                        <el-input v-model="userPwds.rePassword"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserPwd">
                            更改密码
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>