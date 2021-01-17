module.exports = {
    ObjectIsEmpty: (obj) => {
        return JSON.stringify(obj) == '{}'
    },

    calcPagination: (currentPage, itemPerPage) => {
		var skip = (currentPage - 1) * itemPerPage
		var limit = skip + itemPerPage;
		return {limit, skip}
	},

	calcPageCounts: (count, itemPerPage) => {
		var pageCounts = Math.ceil(count / itemPerPage);
		
		return pageCounts;
	},
	MinusTime: (d1,d2) => {
		if(d1 > d2){
			return {
				year: d1.getFullYear() - d2.getFullYear(),
				month: d1.getMonth() - d2.getMonth(),
				day: d1.getDate() - d2.getDate()
			}
		}

		if(d2 > d1){
			return {
				year: d2.getFullYear() - d1.getFullYear(),
				month: d2.getMonth() - d1.getMonth(),
				day: d2.getDate() - d1.getDate()
			}
		}

		return 0;
	}
}

