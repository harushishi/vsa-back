import * as AWS from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import "dotenv/config";
import * as fs from "fs";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

export class BucketService {
  s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      region,
      accessKeyId,
      secretAccessKey,
    });
  }

  async uploadFile(filename: string) {
    try {
      const fileStream = fs.createReadStream(`uploads/${filename}`);

      if (bucketName !== null && bucketName !== undefined) {
        const uploadParams: PutObjectRequest = {
          Bucket: bucketName!,
          Key: filename,
          Body: fileStream,
        };

        return this.s3.upload(uploadParams);
      }
    } catch (error) {}
  }

  async getFileStream(fileKey: string) {
    try {
      if (bucketName !== undefined && bucketName !== null) {
        const downloadParams = {
          Key: fileKey,
          Bucket: bucketName,
        };

        return this.s3.getObject(downloadParams).createReadStream();
      }
    } catch (error) {
      return error;
    }
  }

  async removeFile(fileKey: string) {
    try {
      if (bucketName !== undefined && bucketName !== null) {
        const deleteParams = {
          Key: fileKey,
          Bucket: bucketName,
        };
        return this.s3.deleteObject(deleteParams).promise();
      }
    } catch (error) {
      return error;
    }
  }
}
