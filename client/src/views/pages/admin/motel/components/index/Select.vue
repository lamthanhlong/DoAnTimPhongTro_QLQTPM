<template>
	<v-select
	:items="items"
	placeholder=" "
	item-text="name"
	v-model="getData"
	return-object
	@change="emitChange()"
	@input="emitChange()"
	:label="label"
	outlined
	dense
	> 
</v-select>
</template>


<script type="text/javascript">
export default{
	props: {
		data: {
			type: [Array, String, Object, Number]
		},
    items: Array,
	    label: String,
		},

		data(){
			return {
	      getData: this.data,
	    }
	},

  	methods: {
	    emitChange(){
	      var query = Object.assign({}, this.$route.query);

	      query.verify = this.getData;
	      this.$router.push({
	          name: 'adminMotelIndex', 
	          query: query
	      });


	      var payLoad = Object.assign({}, query);
	      payLoad.verify = this.getData;

	      this.$store.dispatch("components/actionProgressHeader", { option: "show" })
	      setTimeout(async () => {
	       this.$store.dispatch("motels/fetchPaging", payLoad);
	      }, 200);

	      this.$emit("update:data", this.getData);
	    }
	 },


}
</script>