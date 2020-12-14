<<<<<<< HEAD
module.exports = {
    ObjectIsEmpty: (obj) => {
        return JSON.stringify(obj) == '{}'
    }
}
=======
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
}

>>>>>>> eb7b5fa437b1bd702d180ddb21fe1488c4006dbd
