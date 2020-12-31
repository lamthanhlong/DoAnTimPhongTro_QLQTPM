const ibmCOS = require('ibm-cos-sdk');
const IBMConfig = require('../configs/IBM.json');
const fs = require('fs');

var cos = new ibmCOS.S3({
    endpoint: IBMConfig.endpoint,
    apiKeyId: IBMConfig.apiKeyId,
    ibmAuthEndpoint: 'https://iam.cloud.ibm.com/identity/token',
    serviceInstanceId: IBMConfig.serviceInstanceId,
});

module.exports = {
    deleteItems: async (filepaths) => {
        var Objects = [];
        for(path of filepaths){
            Objects.push({Key: path});
        }
        return cos.deleteObjects({
            Bucket: IBMConfig.BucketName,
            Delete: {Objects}
        }).promise()
        .then((data) => {
            console.log(`Deleted items for ${IBMConfig.BucketName}`);
            console.log(data.Deleted);
        })
        .catch((e) => {
            console.log(`ERROR: ${e.code} - ${e.message}\n`);
        });
    },
    uploadItem: async (file, uploadpath) => {
        return cos.upload({
            Bucket: IBMConfig.BucketName,
            Key: `${uploadpath}/${file.name}`,
            Body: fs.createReadStream(file.tempFilePath),
            //ContentType: fileDetails.type,
        }).promise()
        .then((data) => {
            console.log(`Upload items for ${IBMConfig.BucketName}`);
            console.log(data.Deleted);
        })
        .catch((e) => {
            console.log(`ERROR: ${e.code} - ${e.message}\n`);
        });
    }
}