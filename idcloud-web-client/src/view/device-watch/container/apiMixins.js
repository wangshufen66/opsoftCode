import {
    getCloudboxList
} from '@/api/iot-hub/cloudboxList'
import {
    getCncList
} from '@/api/iot-hub/cncList'
import {
    getPlcList
} from '@/api/iot-hub/plcList'
import {
    getCheckedInfoPoint,
    getDataPointTab,
    getDataPointList,
    getfullCloudboxList,
    getfullCncList,
    getfullBox8303List,
    getfullPlcList,
    uploadPic
} from '@/api/basedata'
export default {
    methods: {
        // 去重方法
        unique(objArray) {
            var result = []; //去重后返回的结果数组
            var temp = {}; //临时对象
            //将对象数组中每一项的id值作为属性，若temp不拥有此属性时则为temp添加此属性且将其值赋为true，并将这一项push到结果数组中
            for (var i = 0; i < objArray.length; i++) {
                var myname = objArray[i].uid;
                if (temp[myname]) { //如果temp中已经存在此属性名，则说明遇到重复项
                    continue; //不继续执行接下来的代码，跳转至循环开头
                }
                temp[myname] = true; //为temp添加此属性（myname）且将其值赋为true
                result.push(objArray[i]); //将这一项复制到结果数组result中去
            }
            return result;
        },
        async getCloudboxList(param) {
            try {
                let res = await Promise.resolve(getfullCloudboxList(param))
                return res
            } catch (e) {
                console.log(e);
            }
        },
        async getPlcList(param) {
            try {
                let res = await Promise.resolve(getfullPlcList(param))
                return res
            } catch (e) {
                console.log(e);
            }
        },
        async getCncList(param) {
            try {
                let res = await Promise.resolve(getfullCncList(param))
                return res
            } catch (e) {
                console.log(e);
            }
        },
        async getBox8303List(param) {
            try {
                let res = await Promise.resolve(getfullBox8303List(param))
                return res
            } catch (e) {
                console.log(e);
            }
        },
        async getCheckedInfoPoint(param) {
            try {
                let res = await Promise.resolve(getCheckedInfoPoint(param))
                return res
            } catch (e) {
                console.log(e);
            }
        },
        async getTabs(param) {
            try {
                let res = await Promise.resolve(getDataPointTab(param))
                return res
            } catch (e) {
                console.log(e);
            }
        },
        async getType4List(param) {
            try {
                let res = await Promise.resolve(getDataPointList(param))
                return res
            } catch (e) {
                console.log(e);
            }
        },
        async uploadPic(param) {
            try {
                console.log('in');

                let res = await Promise.resolve(uploadPic(param))
                return res
            } catch (e) {
                console.log(e);
            }
        }
    }

}