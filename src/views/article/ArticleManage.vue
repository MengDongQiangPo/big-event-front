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
const state = ref('')

//算法列表数据模型
const articles = ref([])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    articleList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    articleList()
}


//回显科研问题（方向）
import {
    articleCategoryListService,
    articleListService,
    articleAddService,
    articleUpdateService,
    articleDeleteService,
    articleListSearchService
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

//获取算法列表数据
const articleList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    }
    let result = await articleListService(params);

    //渲染视图
    total.value = result.data.total;
    articles.value = result.data.items;

    //处理数据,给数据模型扩展一个属性categoryName,分类名称
    for (let i = 0; i < articles.value.length; i++) {
        let article = articles.value[i];
        for (let j = 0; j < categorys.value.length; j++) {
            if (article.categoryId == categorys.value[j].id) {
                article.categoryName = categorys.value[j].categoryName;
            }
        }
    }
}

articleList();

//获取算法列表查询数据
const articleListSearch = async () => {
    let params = {
        keyword: searchContent.value,
        pageNum: pageNum.value,
        pageSize: pageSize.value
    }
    let result = await articleListSearchService(params);

    //渲染视图
    total.value = result.data.total;
    articles.value = result.data.items;

    //处理数据,给数据模型扩展一个属性categoryName,分类名称
    for (let i = 0; i < articles.value.length; i++) {
        let article = articles.value[i];
        for (let j = 0; j < categorys.value.length; j++) {
            if (article.categoryId == categorys.value[j].id) {
                article.categoryName = categorys.value[j].categoryName;
            }
        }
    }
}

articleListSearch();

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { Plus } from '@element-plus/icons-vue'
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const articleModel = ref({
    id: 0,
    title: '',
    fromWhere: '',
    keyWords: '',
    categoryId: '',
    content: '',
    instruction: '',
    exampleDataSet: '',
    exampleQuery: '',
    state: ''
})

// Add a key to force re-render the component
const editorKey = ref(0);
const clearArticleModel = () => {
    articleModel.value = {
        title: '',
        fromWhere: '',
        keyWords: '',
        categoryId: '',
        content: '',
        instruction: '',
        exampleDataSet: '',
        exampleQuery: '',
        state: ''
    };
    editorKey.value++;  // Increment the key to force re-render
};

//导入token
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();

//数据集附件上传成功的回调函数
const uploadSuccess1 = (result) => {
    articleModel.value.exampleDataSet = result.data;
    console.log(result.data);
}

//样例查询附件上传成功的回调函数
const uploadSuccess2 = (result) => {
    articleModel.value.exampleQuery = result.data;
    console.log(result.data);
}

//添加算法
import { ElMessage, ElMessageBox } from 'element-plus';
const drawerTitle = ref("添加新算法"); // 定义抽屉标题

const addArticle = async (clickState) => {
    // //把发布状态赋值给数据模型
    // articleModel.value.state = clickState;

    // //调用接口
    // let result = await articleAddService(articleModel.value);

    // ElMessage.success(result.msg ? result.msg : '添加成功');

    let result;
    if (drawerTitle.value === "添加新算法") {
        articleModel.value.state = clickState;
        result = await articleAddService(articleModel.value);
        ElMessage.success(result.msg || '添加新算法成功');
    } else {
        result = await articleUpdateService(articleModel.value);
        ElMessage.success(result.msg || '编辑算法成功');
    }

    //让抽屉消失
    visibleDrawer.value = false;

    //刷新当前列表
    await articleList()
}

// 编辑算法
const showEditArticleDialogue = async (row) => {
    drawerTitle.value = "编辑算法";
    for (let i = 0; i < articles.value.length; i++) {
        if (row.id === articles.value[i].id) {
            articleModel.value.id = row.id;
            articleModel.value.title = articles.value[i].title;
            articleModel.value.fromWhere = articles.value[i].fromWhere;
            articleModel.value.keyWords = articles.value[i].keyWords;
            articleModel.value.categoryId = articles.value[i].categoryId;
            articleModel.value.content = articles.value[i].content;
            articleModel.value.instruction = articles.value[i].instruction;
            articleModel.value.exampleDataSet = articles.value[i].exampleDataSet;
            articleModel.value.exampleQuery = articles.value[i].exampleQuery;
            articleModel.value.state = articles.value[i].state;
            break;
        }
    }
    visibleDrawer.value = true;
}

const rules = {
    title: [
        {
            required: true,
            message: '请输入算法名称',
            trigger: 'blur'
        },
        {
            pattern: /^.{3,100}$/,
            message: '算法名称为3~100个字符',
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
            message: '请输入附件代码',
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
    exampleDataSet: [
        {
            required: true,
            message: '请选择样例数据集文件',
            trigger: 'blur'
        }
    ],
    exampleQuery: [
        {
            required: true,
            message: '请选择样例查询附件',
            trigger: 'blur'
        }
    ]

};

// 删除算法
const deleteArticle = (row) => {
    // notify user to confirm
    // a notification pop-up is shown
    ElMessageBox.confirm(
        '您确定删除这个算法？',
        '请思考',
        {
            confirmationButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
        }
    ).then(async () => {
        // invoke API
        let result = await articleDeleteService(row.id);
        ElMessage.success('删除成功');

        // 更新算法列表
        await articleList();
    }).catch(() => {
        ElMessage.info('删除已取消');
    });
}

</script>
<template>
    <el-card class="page-container">

        <template #header>
            <div class="header">
                <span>算法库管理</span>
                <div class="extra">
                    <el-button type="primary" @click="drawerTitle = '添加新算法';
                    clearArticleModel();
                    visibleDrawer = true;">
                        添加算法
                    </el-button>
                </div>
            </div>
        </template>

        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="请输入搜索内容">
                <el-input v-model="searchContent" placeholder="请输入搜索内容"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="articleListSearch">搜索</el-button>
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

            <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="articleList">搜索</el-button>
                <el-button @click="categoryId = ''; state = ''">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 算法列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="算法名称" width="300" prop="title"></el-table-column>
            <el-table-column label="出处" prop="fromWhere"></el-table-column>
            <el-table-column label="关键字" prop="keyWords"></el-table-column>
            <el-table-column label="所属科研方向" prop="categoryName"></el-table-column>
            <el-table-column label="附件代码" prop="content"></el-table-column>
            <el-table-column label="使用说明" prop="instruction"></el-table-column>
            <el-table-column label="样例数据集" prop="exampleDataSet"></el-table-column>
            <el-table-column label="样例查询" prop="exampleQuery"></el-table-column>
            <el-table-column label="发表时间" prop="createTime"> </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button v-if="userInfoStore.info.userForce == 1" :icon="Edit" circle plain type="primary"
                        @click="showEditArticleDialogue(row)"></el-button>
                    <el-button v-else-if="userInfoStore.info.id == row.createUser" :icon="Edit" circle plain type="primary"
                        @click="showEditArticleDialogue(row)"></el-button>
                    <el-button v-if="userInfoStore.info.userForce == 1" :icon="Delete" circle plain type="danger"
                        @click="deleteArticle(row)"></el-button>
                    <el-button v-else-if="userInfoStore.info.id == row.createUser" :icon="Delete" circle plain type="danger"
                        @click="deleteArticle(row)"></el-button>
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
            <!-- 添加/编辑算法表单 -->
            <el-form :model="articleModel" :rules="rules" label-width="100px">
                <el-form-item label="算法名称">
                    <el-input v-model="articleModel.title" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="出处">
                    <el-input v-model="articleModel.fromWhere" placeholder="请输入出处"></el-input>
                </el-form-item>
                <el-form-item label="关键字">
                    <el-input v-model="articleModel.keyWords" placeholder="请输入关键字"></el-input>
                </el-form-item>
                <el-form-item label="所属科研方向">
                    <el-select placeholder="请选择" v-model="articleModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="附件代码">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html">
                        </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item label="使用说明">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="articleModel.instruction" contentType="html">
                        </quill-editor>
                    </div>
                </el-form-item>

                <el-form-item label="样例数据集">

                    <!-- 
                        auto-upload:设置是否自动上传
                        action:设置服务器接口路径
                        name:设置上传的文件字段名
                        headers:设置上传的请求头
                        on-success:设置上传成功的回调函数
                     -->

                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/upload"
                        name="file" :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess1">
                        <a v-if="articleModel.exampleDataSet" :src="articleModel.exampleDataSet" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>

                <el-form-item label="样例查询">

                    <!-- 
                        auto-upload:设置是否自动上传
                        action:设置服务器接口路径
                        name:设置上传的文件字段名
                        headers:设置上传的请求头
                        on-success:设置上传成功的回调函数
                     -->

                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/upload"
                        name="file" :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess2">
                        <a v-if="articleModel.exampleQuery" :src="articleModel.exampleQuery" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="addArticle('已发布')">发布</el-button>
                    <el-button type="info" @click="addArticle('草稿')">草稿</el-button>
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