const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const textract = new AWS.Textract();

exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);

  // Check if it's a request for a signed URL
  if (requestBody.action === "getSignedUrl") {
    const params = {
      Bucket: "bucketlabelscanner",
      Key: `${new Date().getTime()}.jpeg`, // or another naming scheme
      Expires: 60 * 5, // URL is valid for 5 minutes
      ContentType: "image/jpeg",
    };

    const signedUrl = s3.getSignedUrl("putObject", params);
    return {
      statusCode: 200,
      body: JSON.stringify({ signedUrl: signedUrl, key: params.Key }),
    };
  }

  // If it's a request to process an image with Textract
  if (requestBody.imageKey) {
    const textractParams = {
      Document: {
        S3Object: {
          Bucket: "bucketlabelscanner",
          Name: requestBody.imageKey,
        },
      },
    };

    try {
      const result = await textract
        .detectDocumentText(textractParams)
        .promise();
      const detectedText = result.Blocks.filter(
        (block) => block.BlockType === "LINE"
      )
        .map((line) => line.Text)
        .join("\n");
      return { statusCode: 200, body: JSON.stringify({ text: detectedText }) };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ error: "Invalid request" }),
  };
};
