<script setup>
import {
    Edit
} from '@element-plus/icons-vue'
import { ref } from 'vue'

const userlists = ref([])
//声明一个异步的函数
import { userListService, userForceUpdateService } from '@/api/user.js'
const userList = async () => {
    let result = await userListService();
    userlists.value = result.data;
}
userList();

import { ElMessageBox } from 'element-plus'
//调用接口,添加表单
import { ElMessage } from 'element-plus'
const updateForce = (row) => {
    //提示用户  确认框

    ElMessageBox.confirm(
        '你确认要将此用户晋升为管理员吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //调用接口
            let result = await userForceUpdateService(row.id);
            ElMessage({
                type: 'success',
                message: '修改成功',
            })
            //刷新列表
            userList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '用户取消了操作',
            })
        })
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>用户管理</span>
            </div>
        </template>
        <el-table :data="userlists" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="昵称" prop="nickname"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            <el-table-column label="更新时间" prop="updatetime"></el-table-column>
            <el-table-column label="昵称" prop="nickname"></el-table-column>
            <el-table-column label="用户权限" prop="userForce"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button v-show="row.userForce == 0" :icon="Edit" circle plain type="danger"
                        @click="updateForce(row)">
                    </el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>