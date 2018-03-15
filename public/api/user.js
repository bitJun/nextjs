//import q from 'jan-request';
var q = require('jan-request')
var router = new q.Router();

router.use({
    'getWarehouseList': 'warehouse/listPage',
    'getWarehouseDetailData':'warehouse/getData',
    'getWarehouseProjectList':'project/getWarehouseRelatedProjects',

    // 获取项目列表
    getProjectList: 'project/h5/queryProjectInfoList',
    // 获取仓库详情
    getStoreDetail: 'warehouse/getData',
    // 获取仓库关联项目列表
    getStoreRelation: 'project/getWarehouseRelatedProjects',
    // 获取项目详情
    getProDetail: 'project/queryProjectInfoById',
    //获取运营日报
    getDaily: '{id}/h5/per/operatingDaily/list',
    // 获取关联仓库
    getRelatedProjects: 'project/queryRelatedProjects/h5'
});

module.exports = router;
