/**
 * javascript와 마찬가지로 함수를 정의하고 구현한다. 
 * 라우팅에서 경로 설정 
 */

'use strict';

import * as express from 'express';
import post_interface from '../interface/post';
import router from '../routes';
import bookConfig from '../config/aws/book'
import AWS from "aws-sdk";
import { Response, Request } from "express"

export const addBook = async(req : Request, res : Response) => {
    try{
        const newbook : post_interface = req.body
        AWS.config.update(bookConfig.aws_iam_info);
        const docClient = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName : bookConfig.aws_table_name,
            Item : {
                title : newbook.title,
                author : newbook.author,
                content : newbook.content
            }
        }
        const result = await docClient.put(params).promise()
        res.status(200).send(result)
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}

export const getbook = async(req:Request, res: Response) => {
    try{
        const book_title : String = req.body.title
        AWS.config.update(bookConfig.aws_iam_info);
        const docClient = new AWS.DynamoDB.DocumentClient();
    
        
        const params = {
            TableName : bookConfig.aws_table_name,
            KeyConditionExpression: "title = :title",
            ExpressionAttributeValues: {
                ":title": book_title
            }
        };
        const result = await docClient.query(params).promise()
        res.status(200).send(result)
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}
