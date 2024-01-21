<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref } from 'vue'

import { userInfoService } from '@/api/user.js'
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
//调用函数,获取用户详细信息
const getUserInfo = async () => {
    //调用接口
    let result = await userInfoService();
    //数据存储到pinia中
    userInfoStore.setInfo(result.data);
}

getUserInfo();

//科研问题（方向）数据模型
const categorys = ref([])

const categoriesMap = ref({}); // for fast-searching

//用户输入搜索时输入的内容
const searchContent = ref('')

//用户搜索时选中的科研问题（方向）id
const categoryId = ref('')

//用户搜索时选中的发布状态
// const state = ref('')

//数据集列表数据模型
const dataSets = ref([])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    dataSetList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    dataSetList()
}


//回显科研问题（方向）
import {
    articleCategoryListService,
    dataSetListService,
    dataSetAddService,
    dataSetUpdateService,
    dataSetDeleteService,
    dataSetListSearchService
} from '@/api/article.js'


const articleCategoryList = async () => {
    let result = await articleCategoryListService();
    categorys.value = result.data;
    categoriesMap.value = {};
    for (let i = 0; i < categories.value.length; i++) {
        let category = categories.value[i];
        categoriesMap.value[category.id] = category.categoryName;
    }
}
articleCategoryList();

//获取数据集列表数据
const dataSetList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        //state: state.value ? state.value : null
    }
    let result = await dataSetListService(params);

    //渲染视图
    total.value = result.data.total;
    dataSets.value = result.data.items;

    //处理数据,给数据模型扩展一个属性categoryName,分类名称
    for (let i = 0; i < dataSet.value.length; i++) {
        let dataSet = dataSets.value[i];
        for (let j = 0; j < categorys.value.length; j++) {
            if (dataSet.categoryId == categorys.value[j].id) {
                dataSet.categoryName = categorys.value[j].categoryName;
            }
        }
    }
}

dataSetList();

//获取数据集列表查询数据
const dataSetListSearch = async () => {
    let params = {
        keyword: searchContent.value,
        pageNum: pageNum.value,
        pageSize: pageSize.value
    }
    
    let result = await dataSetListSearchService(params);

    //渲染视图
    total.value = result.data.total;
    dataSets.value = result.data.items;

    //处理数据,给数据模型扩展一个属性categoryName,分类名称
    for (let i = 0; i < dataSets.value.length; i++) {
        let dataSet = dataSets.value[i];
        for (let j = 0; j < categorys.value.length; j++) {
            if (dataSet.categoryId == categorys.value[j].id) {
                dataSet.categoryName = categorys.value[j].categoryName;
            }
        }
    }
}

dataSetListSearch();

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { Plus } from '@element-plus/icons-vue'
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const dataSetModel = ref({
    id: 0,
    title: '',
    fromWhere: '',
    keyWords: '',
    categoryId: '',
    content: '',
    instruction: '',
    attachment: ''
})

// Add a key to force re-render the component
const editorKey = ref(0);
const clearDataSetModel = () => {
    dataSetModel.value = {
        title: '',
        fromWhere: '',
        keyWords: '',
        categoryId: '',
        content: '',
        instruction: '',
        attachment: ''
    };
    editorKey.value++;  // Increment the key to force re-render
};

//导入token
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();

//数据集附件上传成功的回调函数
const uploadSuccess = (result) => {
    dataSetModel.value.attachment = result.data;
    console.log(result.data);
}

//添加算法
import { ElMessage, ElMessageBox } from 'element-plus';
const drawerTitle = ref("添加新算法"); // 定义抽屉标题

const addDataSet = async () => {
    let result;
    if (drawerTitle.value === "添加新数据集") {
        result = await dataSetAddService(dataSetModel.value);
        ElMessage.success(result.msg || '添加新数据集成功');
    } else {
        result = await dataSetUpdateService(dataSetModel.value);
        ElMessage.success(result.msg || '编辑数据集成功');
    }

    //让抽屉消失
    visibleDrawer.value = false;

    //刷新当前列表
    await dataSetList()
}

// 编辑数据集
const showEditDataSetDialogue = async (row) => {
    drawerTitle.value = "编辑算法";
    for (let i = 0; i < dataSets.value.length; i++) {
        if (row.id === dataSets.value[i].id) {
            dataSetModel.value.id = row.id;
            dataSetModel.value.title = dataSets.value[i].title;
            dataSetModel.value.fromWhere = dataSets.value[i].fromWhere;
            dataSetModel.value.keyWords = dataSets.value[i].keyWords;
            dataSetModel.value.categoryId = dataSets.value[i].categoryId;
            dataSetModel.value.content = dataSets.value[i].content;
            dataSetModel.value.instruction = dataSets.value[i].instruction;
            dataSetModel.value.attachment = dataSets.value[i].attachment;
            break;
        }
    }
    visibleDrawer.value = true;
}

const rules = {
    title: [
        {
            required: true,
            message: '请输入数据集名称',
            trigger: 'blur'
        },
        {
            pattern: /^.{1,100}$/,
            message: '数据集名称为1~100个字符',
            trigger: 'blur'
        }
    ],
    fromWhere: [
        {
            required: true,
            message: '请输入出处',
            trigger: 'blur'
        }
    ],
    keyWords: [
        {
            required: true,
            message: '请输入关键字',
            trigger: 'blur'
        }
    ],
    categoryId: [
        {
            required: true,
            message: '请选择研究问题（方向）',
            trigger: 'blur'
        }
    ],
    content: [
        {
            required: true,
            message: '请输入数据集描述',
            trigger: 'blur'
        },
        {
            pattern: /^.{0,10000}$/,
            message: '最多一万字符',
            trigger: 'blur'
        }
    ],
    instruction: [
        {
            required: true,
            message: '请输入使用说明',
            trigger: 'blur'
        }
    ],
    attachment: [
        {
            required: true,
            message: '请选择数据集附件',
            trigger: 'blur'
        }
    ],
};

// 删除算法
const deleteDataSet = (row) => {
    // notify user to confirm
    // a notification pop-up is shown
    ElMessageBox.confirm(
        '您确定删除这个数据集？',
        '请思考',
        {
            confirmationButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
        }
    ).then(async () => {
        // invoke API
        let result = await dataSetDeleteService(row.id);
        ElMessage.success('删除成功');

        // 更新算法列表
        await dataSetList();
    }).catch(() => {
        ElMessage.info('删除已取消');
    });
}

</script>

<template>
    <el-card class="page-container">

        <template #header>
            <div class="header">
                <span>数据集管理</span>
                <div class="extra">
                    <el-button type="primary" @click="drawerTitle = '添加新数据集';
                    clearDataSetModel();
                    visibleDrawer = true;">添加数据集</el-button>
                </div>
            </div>
        </template>

        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="请输入搜索内容">
                <el-input v-model="searchContent" placeholder="请输入搜索内容"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="dataSetListSearch">搜索</el-button>
                <el-button @click="searchContent = ''">重置</el-button>
            </el-form-item>
        </el-form>

        <el-form inline>
            <el-form-item label="科研问题（方向）：">
                <el-select placeholder="请选择" v-model="categoryId">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="dataSetList">搜索</el-button>
                <el-button @click="categoryId = ''">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 算法列表 -->
        <el-table :data="dataSets" style="width: 100%">
            <el-table-column label="数据集名称" width="300" prop="title"></el-table-column>
            <el-table-column label="出处" prop="fromWhere"></el-table-column>
            <el-table-column label="关键字" prop="keyWords"></el-table-column>
            <el-table-column label="所属科研方向" prop="categoryName"></el-table-column>
            <el-table-column label="数据集描述" prop="content"></el-table-column>
            <el-table-column label="使用说明" prop="instruction"></el-table-column>
            <el-table-column label="数据集附件" prop="attachment"></el-table-column>
            <el-table-column label="发表时间" prop="createTime"> </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button v-if="userInfoStore.info.userForce == 1" :icon="Edit" circle plain type="primary"
                        @click="showEditDataSetDialogue(row)"></el-button>
                    <el-button v-else-if="userInfoStore.info.id == row.createUser" :icon="Edit" circle plain type="primary"
                        @click="showEditDataSetDialogue(row)"></el-button>
                    <el-button v-if="userInfoStore.info.userForce == 1" :icon="Delete" circle plain type="danger"
                        @click="deleteDataSet(row)"></el-button>
                    <el-button v-else-if="userInfoStore.info.id == row.createUser" :icon="Delete" circle plain type="danger"
                        @click="deleteDataSet(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />

        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" title="drawerTitle" direction="rtl" size="50%">
            <!-- 添加/编辑数据集表单 -->
            <el-form :model="dataSetModel" :rules="rules" label-width="100px">
                <el-form-item label="数据集名称">
                    <el-input v-model="dataSetModel.title" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="出处">
                    <el-input v-model="dataSetModel.fromWhere" placeholder="请输入出处"></el-input>
                </el-form-item>
                <el-form-item label="关键字">
                    <el-input v-model="dataSetModel.keyWords" placeholder="请输入关键字"></el-input>
                </el-form-item>
                <el-form-item label="所属科研方向">
                    <el-select placeholder="请选择" v-model="dataSetModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据集描述">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="dataSetModel.content" contentType="html">
                        </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item label="使用说明">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="dataSetModel.instruction" contentType="html">
                        </quill-editor>
                    </div>
                </el-form-item>

                <el-form-item label="数据集附件">

                    <!-- 
                        auto-upload:设置是否自动上传
                        action:设置服务器接口路径
                        name:设置上传的文件字段名
                        headers:设置上传的请求头
                        on-success:设置上传成功的回调函数
                     -->

                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/upload"
                        name="file" :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                        <a v-if="dataSetModel.attachment" :src="dataSetModel.attachment" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="addDataSet()">发布</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
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

/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>