<template>
	<v-text-field
    placeholder="Tìm nhà trọ..."
    item-text="name"
    return-object
    v-model="getInputSearch"
    :label="label"
    append-icon="mdi-search-web"
    outlined
  dense
  @keydown="emitEvent"
  @paste="emitEvent"
  hide-details

	>            
	</v-text-field>
</template>

<script type="text/javascript">
import _ from 'lodash';

export default{

	props: {
		data: [Array, Object, String],
		label: String,
	},

	data(){
		return {
			getInputSearch: this.data,
			oldVal: "",
		}
	},

	methods: {
		emitEvent: _.debounce( function(val) {
				
				var query = Object.assign({}, this.$route.query);
				if(this.getInputSearch !== ""){
				
					query.searchKey = this.getInputSearch;
				}else{
					delete query.searchKey;
				}
				
	
				this.$router.push({
					query: query
				});

				var payLoad  = query;

			    this.$store.dispatch("components/actionProgressHeader", { option: "show" })
			      setTimeout(async () => {
			        this.$store.dispatch("motels/fetchPaging", payLoad);
			    }, 200);
		}, 500)
	},


}
</script>