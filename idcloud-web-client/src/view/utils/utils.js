export default {
	// 生成树形图结构数据
	// data: {
	// 	rawdata: [],
	// 	children: [],
	// 	parent: [],
	// 	expand: false
	// }
	toTreeDataFunc(data) {
		// 删除所有 children 防止多次调用
		data.rawdata.forEach(item => {
			delete item.children
		})
		// 将数据存储为 以 childId 为 key 的 map 索引数据列
		let map = {}
		data.rawdata.forEach((item, index) => {
			map[data.children[index]] = item
		})
		// 递归实现树形图结构数据
		let treeData = []
		data.rawdata.forEach((item, index) => {
			// 是否展开
			if (data.expand) {
				item.expand = true
			}
			let parent = map[data.parent[index]]
			if (parent) {
				(parent.children || (parent.children = [])).push(item)
			} else {
				treeData.push(item)
			}
		})
		return treeData
	},
	// 生成 children
	toTreeChildrenFunc(data, id) {
		let children = []
		data.forEach(item => {
			children.push(item[id])
		})
		return children
	},
	// 生成 parent
	toTreeParentFunc(data, id) {
		let parent = []
		data.forEach(item => {
			parent.push(item[id])
		})
		return parent
	},
}
