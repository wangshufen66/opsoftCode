import user from "./user";
import menu from "./menu";
import oauth from "./oauth";
/**
 * 模拟数据mock
 *
 * mock是否开启模拟数据拦截
 */

const options = { mock: true };

user(options);

menu(options);

oauth(options);

import Mock from "mockjs";
//使用mockjs模拟数据
Mock.mock("/api/msdk/proxy/query_common_credit/", "get", {
    ret: 0,
    data: {
        mtime: "@datetime", //随机生成日期时间
        "score|1-800": 800, //随机生成1-800的数字
        "rank|1-100": 100, //随机生成1-100的数字
        "stars|1-5": 5, //随机生成1-5的数字
        nickname: "@cname" //随机生成中文名字
    }
});

Mock.mock("/api/mock/table/mockData", "get", {
    code: 0,
    data: {
        columns: [{
                id: "area",
                name: "区域2"
            },
            {
                id: "lastMonth",
                name: "上月业绩2"
            },
            {
                id: "thisMonth",
                name: "本月业绩2"
            },
            {
                id: "diff",
                name: "增长业绩2"
            }
        ],
        rows: [{
                area: "吉林1",
                lastMonth: 4922913,
                thisMonth: 9997721,
                diff: 5074808
            },
            {
                area: "内蒙古1",
                lastMonth: 1222913,
                thisMonth: 9567721,
                diff: 3474808
            },
            {
                area: "云南1",
                lastMonth: 3222913,
                thisMonth: 6597721,
                diff: 5674808
            },
            {
                area: "广西1",
                lastMonth: 3452913,
                thisMonth: 6787721,
                diff: 3904808
            },
            {
                area: "广东1",
                lastMonth: 3452913,
                thisMonth: 6787721,
                diff: 3904808
            },
            {
                area: "湖南1",
                lastMonth: 3222913,
                thisMonth: 6597721,
                diff: 5674808
            },
            {
                area: "乌鲁木齐1",
                lastMonth: 3222913,
                thisMonth: 6597721,
                diff: 5674808
            }
        ]
    }
});

Mock.mock("/api/opcloud/getmockData", "get", {
    "code": 200,
    "msg": null,
    "data": [{
            "ORG_NUMBER": "10021",
            "IS_DELETED": 0,
            "IS_USING": 1,
            "PASSWORD": "$2a$10$V3/EOWQUWJwUMKwBDVvO1.CxM1tGbKZfq3zOO887WxUX/jTsvBt6G",
            "CREATOR": null,
            "PHONE": "18852936379",
            "USERNAME": "rensi",
            "ID": 84,
            "CREATE_TIME": "2021-04-07T14:24:46.000+0000",
            "NICK_NAME": null
        },
        {
            "ORG_NUMBER": "10022",
            "IS_DELETED": 0,
            "IS_USING": 1,
            "PASSWORD": "$2a$10$D.pqLY.2y6Ax.XrN5qoTIOayZNM3bHQGVNUe6F3dvxIvPojOovQLm",
            "CREATOR": null,
            "PHONE": "13838383838",
            "USERNAME": "admin",
            "ID": 69,
            "CREATE_TIME": "2021-03-25T07:30:21.000+0000",
            "NICK_NAME": null
        },
        {
            "ORG_NUMBER": "10023",
            "IS_DELETED": 0,
            "IS_USING": 1,
            "PASSWORD": "$2a$10$kcNMzoDeHnsnSBVfnMA5LO4iFOuLWfQ0/EuvYmhBwM73qcZJjFCLS",
            "CREATOR": null,
            "PHONE": "13838383838",
            "USERNAME": "admin2",
            "ID": 70,
            "CREATE_TIME": "2021-03-25T07:46:10.000+0000",
            "NICK_NAME": null
        },
        {
            "ORG_NUMBER": "10024",
            "IS_DELETED": 0,
            "IS_USING": 1,
            "PASSWORD": "$2a$10$nD31D39hVcwBPWQVMhy3JeK3GBXhUB6IVjZGd8lgYVTJDyo5EURr2",
            "CREATOR": null,
            "PHONE": "15736959835",
            "USERNAME": "gaopeng",
            "ID": 83,
            "CREATE_TIME": "2021-04-07T11:58:08.000+0000",
            "NICK_NAME": null
        },
        {
            "ORG_NUMBER": "10025",
            "IS_DELETED": 0,
            "IS_USING": 1,
            "PASSWORD": "$2a$10$PnoGh1c4w0CHaDUXrrXlZ.TRTlO8.ITOpPg/Zpal3SZTiczMm9tl6",
            "CREATOR": null,
            "PHONE": "15195647860",
            "USERNAME": "root",
            "ID": 4,
            "CREATE_TIME": "2021-04-25T01:48:01.000+0000",
            "NICK_NAME": null
        }
    ]
});