const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const textract = new AWS.Textract();

exports.handler = async (event) => {
  // Parse the incoming event body as JSON
  const requestBody = JSON.parse(event.body);

  // Check if it's a request for a signed URL
  if (requestBody.action === "getSignedUrl") {
    // Configure parameters for generating a signed URL
    const params = {
      Bucket: "bucketlabelscanner",
      Key: `${new Date().getTime()}.jpeg`, // Use a timestamp-based naming scheme
      Expires: 60 * 5, // URL is valid for 5 minutes
      ContentType: "image/jpeg",
    };

    // Generate a signed URL for uploading an image to S3
    const signedUrl = s3.getSignedUrl("putObject", params);

    // Return the signed URL and the associated key
    return {
      statusCode: 200,
      body: JSON.stringify({ signedUrl: signedUrl, key: params.Key }),
    };
  }

  // If it's a request to process an image with Textract
  if (requestBody.imageKey) {
    // Configure parameters for Textract text detection
    const textractParams = {
      Document: {
        S3Object: {
          Bucket: "bucketlabelscanner",
          Name: requestBody.imageKey,
        },
      },
    };

    try {
      // Perform text detection using Textract
      const result = await textract
        .detectDocumentText(textractParams)
        .promise();

      // Extract and join detected text lines
      const detectedText = result.Blocks.filter(
        (block) => block.BlockType === "LINE"
      )
        .map((line) => line.Text)
        .join("\n");

      // Return the detected text
      return { statusCode: 200, body: JSON.stringify({ text: detectedText }) };
    } catch (error) {
      // Return an error response if Textract processing fails
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }

  // Return a response for an invalid request
  return {
    statusCode: 400,
    body: JSON.stringify({ error: "Invalid request" }),
  };
};
