<template>
	<v-container>
		<v-row v-show="show">
			<v-col cols="12" sm="8" md="8" lg="8">

				<v-card >

					<m-carousel v-if="motel.images"  :items.native="getImages"></m-carousel>

					<v-img v-else  src="@/assets/img/default.png"></v-img>
	
					<v-tabs
				      v-model="tab"
				      background-color="transparent"
				      color="basil"
				      grow
				    >
				      <v-tab
				        v-for="item in tabs"
				        :key="item"
				      >
				        {{ item }}
				      </v-tab>
				    </v-tabs>

				    <v-tabs-items v-model="tab">

				    	<!-- For info -->
				      <v-tab-item
				        :key="tabs[0]"
				      >
				        <v-card
				          color="basil"
				          flat
				        >
				        	<v-card-title>{{ motel.title }}</v-card-title>
				          <v-card-text>
				            <v-row
				              align="center"
				              class="mx-0"
				            >

				            </v-row>

				            <div class="my-4 subtitle-1 red--text font-weight-bold">
				              {{ motel.price }} triệu VNĐ
				            </div>

				            <div>
				              <code>{{motel.area}}m<sup>2</sup></code>
				            </div>	

				            <div class="mt-4">
				              <code  v-show="motel.is_verified">Đã xác thực</code>
				            </div>	

				            <div class="my-4 subtitle-1 text-decoration-underline" v-if="motel.has_furniture">
				              Có nội thất
				            </div>
				        </v-card-text>

					        <v-col cols="12" v-html="motel.description">

					        </v-col>
				        </v-card>
				      </v-tab-item>

				      <!-- For rating -->

				      <v-tab-item
				        :key="tabs[1]"
				      >
				        <v-card
				          color="basil"
				          flat
				        >
				        	<v-card-text class="d-flex">
				        	 <v-rating
				                :value="motel.rating"
				                color="amber"
				                dense
				                half-increments
				                readonly
				                size="20"
				              ></v-rating>
				              <v-spacer></v-spacer>

				              <v-btn 
				              v-show="$version > 1"
				              outlined 
				              small 
				              color="primary" 
				              @click="addRating()">Đánh giá</v-btn>
				            </v-card-text>

				            <v-card-text>
				              <h3>Lượt đánh giá: </h3>
				              <m-rating :ratings="motel.ratings"></m-rating>
							</v-card-text>
				      
				        </v-card>
				      </v-tab-item>
				    </v-tabs-items>
				</v-card>
			</v-col> 

			<v-col cols="12" sm="4" md="4" lg="4">
				<v-card v-if="motel.user">
					<v-card-title>{{ motel.user.name }}</v-card-title>
					<v-card-text><b>SĐT:</b> {{ motel.user.phone }}</v-card-text>
					<v-card-text><b>Địa chỉ:</b> {{ motel.user.address }}</v-card-text>
					
					<v-card-text>

						<v-btn v-show="userInfo && motel.user._id !== userInfo._id" class="ma-2" small outlined @click="openWindowChat(motel.user)">
								Chat với người bán
							<v-icon>mdi-message-processing-outline</v-icon>
						</v-btn>
						<v-btn 
						v-show="$version > 1"
						small 
						outlined 
						@click="viewProfileUser(motel.user)" 
						class="ma-2" 
						>
							Xem thông tin
							<v-icon>mdi-account</v-icon>
						</v-btn>
					</v-card-text>

					<v-divider></v-divider>

				</v-card>
			</v-col> 
		</v-row>

		<form-rating
		v-if="showFormRating"
		title="Đánh giá phòng trọ"
		:motel="motel"
		:showFormRating.sync="showFormRating"
		>
		</form-rating>
	</v-container>
</template>

<script type="text/javascript">

// components	
import Carousel from "./components/detail/Carousel";
import Rating from "./components/detail/Rating";
import AddRating from "./components/detail/AddRating";

// service
import CookieService from "@/services/cookie";


//mixin
import IsMobile from "@/mixins/is_mobile";
export default {

	mixins: [IsMobile],

    components: {
    	'm-carousel': Carousel,
    	'm-rating': Rating,
    	'form-rating': AddRating
	},

	data(){
		return {

			show: false,
	        tab: 0,
	        tabs: [
	          'Thông tin chi tiết', 'Lượt đánh giá', 
	        ],
	         text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
	        userInfo: CookieService.get('userInfo'),

	        showFormRating: false,
		}
	},

	async created(){
		this.retrieveData();
	},

	computed: {
		motel: {
			get(){
				return this.$store.getters["motels/motel"];
			},

			set(){

			}
		}, 

		getImages: {
			get(){
				return this.$helper.convertStringToArrayImage(this.motel.images)
			}
		},

	    windowMessengers: {
	      get(){
	        return this.$store.getters["chats/windowMessengers"];
	      }
	    },
	},

	watch: {
	    motel(data){
	    if(data)
	        this.$store.dispatch("components/actionProgressHeader", { option: "hide" })
	    	this.show = true;
	    }
	},

	methods: {

		viewProfileUser(user){
			this.$router.replace('/user/' + user._id);	
		},

		addRating()
		{
			if(!this.userInfo)
			{
				this.$router.replace("/auth/login");
				return false;
			}

			this.showFormRating = true;
		},

		conditionPushWindowMessenger(windowMessengers, windowMessengerSelected){
	      var checkExist = this.windowMessengers.some(item => { return item.id === windowMessengerSelected.id});

	      if(checkExist)
	      {
	          return false;
	      }


	      if(this.windowMessengers.length === 2){
	        return false;
	      }

	      return true
	    },

		retrieveData(){
	      var payload = { id: this.$route.params.id }
	      this.$store.dispatch("components/actionProgressHeader", { option: "show" })

	      setTimeout(async () => {
	        this.$store.dispatch("motels/fetch", payload);
	      }, 200);
	    },


	    openWindowChat(windowMessengerSelected){

	    	if(!this.userInfo)
	    	{
	    		this.$router.push('/auth/logout');
	    	}

	    	var payload = windowMessengerSelected;
	    	var enablePushWindowMessenger =  this.conditionPushWindowMessenger(this.windowMessengers, windowMessengerSelected)
    			

		    if(enablePushWindowMessenger)
		    {
	    		this.$store.dispatch("chats/openWindowMessenger", payload)
	    	}
	    }
	},

	beforeDestroy(){
		this.$store.commit("motels/DESTROY_MOTEL")
	}
}	

</script>