import request from '@/utils/request.js'
//import { useTokenStore } from '@/stores/token.js'
//科研问题（方向）列表查询
export const articleCategoryListService = () => {
    //const tokenStore = useTokenStore();
    //在pinia中定义的响应式数据,都不需要.value
    //return request.get('/category',{headers:{'Authorization':tokenStore.token}})
    return request.get('/category')
}

// 科研问题（方向）
//科研问题（方向）添加
export const articleCategoryAddService = (categoryData) => {
    return request.post('/category', categoryData)
}

//科研问题（方向）修改
export const articleCategoryUpdateService = (categoryData) => {
    return request.put('/category', categoryData)
}

//科研问题（方向）删除
export const articleCategoryDeleteService = (id) => {
    return request.delete('/category?id=' + id)
}

// 算法库
//算法列表条件查询
export const articleListService = (params) => {
    return request.get('/article', { params: params })
}

//算法通用查询
export const articleListSearchService = (params) => {
    console.log(params);
    return request.get('/article/search', { params: params })
}

//算法添加
export const articleAddService = (articleData) => {
    return request.post('/article', articleData);
}

//算法修改
export const articleUpdateService = (articleData) => {
    return request.put('/article', articleData);
}

//算法删除
export const articleDeleteService = (id) => {
    return request.delete('/article?id=' + id)
}

// 数据集
//数据集列表条件查询
export const dataSetListService = (params) => {
    return request.get('/dataSet', { params: params })
}

//算法通用查询
export const dataSetListSearchService = (params) => {
    return request.get('/dataSet/search', { params: params })
}

//数据集添加
export const dataSetAddService = (dataSetData) => {
    return request.post('/dataSet', dataSetData);
}

//数据集修改
export const dataSetUpdateService = (dataSetData) => {
    return request.put('/dataSet', dataSetData);
}

//数据集删除
export const dataSetDeleteService = (id) => {
    return request.delete('/dataSet?id=' + id)
}