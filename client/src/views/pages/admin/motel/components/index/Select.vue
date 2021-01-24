<template>
	<v-select
		:items="items"
		placeholder=" "
		item-text="name"
		v-model="getData"
		return-object
		:label="label"
		outlined
		dense
		label="Xác thực"
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

				
	    }
	},

	computed: {
		getData: {
			get(){
				if(this.$route.query.hasOwnProperty("isVerified"))
				{
					if(this.$route.query.isVerified == "true")
					{
						this.data = {
							key: true,
							name: "Đã xác thực"
						};
					}else if(this.$route.query.isVerified == "false")
					{
						this.data = {
							key: false,
							name: "Chưa xác thực"
						};
					}else{

					}

				}

				return this.data
			},
			set(data)
			{
				var query = Object.assign({}, this.$route.query);


				 if(data.key !== null)
			      {
			      	query.isVerified = data.key;
			      }else{
		
			      	delete query.isVerified;
			      }


			      this.$router.push({
			          name: 'adminUserIndex', 
			          query: query
			      });

			       var payLoad = Object.assign({}, query);
			      payLoad.isVerified = data.key;

			      this.$store.dispatch("components/actionProgressHeader", { option: "show" })
			      setTimeout(async () => {
			       this.$store.dispatch("users/fetchPaging", payLoad);
			      }, 200);

			}	
		}
	},

  	methods: {

	 },


}
</script>