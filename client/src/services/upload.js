import helperCommon from '@/helpers/common';


export default {

    async image(file)
    {
	     try {
	      return await axios.post(this.rootURL +  `${id}`, {
	        params: {
	          myFile: file
	        }
	      });
	    } catch (error) {

	      console.log(error);

	       return helperCommon.getError(error) || false; 
	    }
	},
}