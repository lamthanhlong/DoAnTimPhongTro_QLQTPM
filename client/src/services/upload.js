import helperCommon from '@/helpers/common';


export default {

	rootURL: '/photo',

    async image(data)
    {
	     try {
	      return await axios.post(this.rootURL, data);
	    } catch (error) {

	      console.log(error);

	       return helperCommon.getError(error) || false; 
	    }
	},
}