const express = require('express')
const router = express.Router();
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'ap-south-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'coins';


router.get('/', async (req, res) => {
    const params = {
      TableName: dynamodbTableName,
      Key: {
        'phone': req.query.phone
      }
    }
    await dynamodb.get(params).promise().then(response => {
        res.json(response);
    }, error => {
      console.error('Do your custom error handling here. I am just ganna log it out: ', error);
      res.status(500).send(error);
    })
})
  
router.get('/all', async (req, res) => {
    const params = {
        TableName: dynamodbTableName
    }
    try {
        const allLogins = await scanDynamoRecords(params, []);
        const body = {
            coins: allLogins
        }
        res.json(body);
    } catch(error) {
        console.error('Do your custom error handling here. I am just ganna log it out: ', error);
        res.status(500).send(error);
    }
})

router.get('/count', async (req, res) => {
    const params = {
        TableName: dynamodbTableName
    }
    try {
        const allLogins = await scanDynamoRecords_scanCount(params, []);
        const body = {
            coins: allLogins
        }
        res.json(body);
    } catch(error) {
        console.error('Do your custom error handling here. I am just ganna log it out: ', error);
        res.status(500).send(error);
    }
})

router.post('/', async (req, res) => {
    const params = {
      TableName: dynamodbTableName,
      Item: req.body
    }
    await dynamodb.put(params).promise().then(() => {
      const body = {
        Operation: 'SAVE',
        Message: 'SUCCESS',
        Item: req.body
      }
      res.json(body);
    }, error => {
      console.error('Do your custom error handling here. I am just ganna log it out: ', error);
      res.status(500).send(error);
    })
})

router.patch('/', async (req, res) => {
    const params = {
        TableName: dynamodbTableName,
        Key: {
        'phone': req.body.phone
        },
        UpdateExpression: `set ${req.body.updateKey} = :value`,
        ExpressionAttributeValues: {
        ':value': req.body.updateValue
        },
        ReturnValues: 'UPDATED_NEW'
    }
    await dynamodb.update(params).promise().then(response => {
        const body = {
        Operation: 'UPDATE',
        Message: 'SUCCESS',
        UpdatedAttributes: response
        }
        res.json(body);
    }, error => {
        console.error('Do your custom error handling here. I am just ganna log it out: ', error);
        res.status(500).send(error);
    })
})

router.delete('/', async (req, res) => {
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'phone': req.query.phone
        },
        ReturnValues: 'ALL_OLD'
    }
    await dynamodb.delete(params).promise().then(response => {
        const body = {
            Operation: 'DELETE',
            Message: 'SUCCESS',
            Item: response
        }
        res.json(body);
    }, error => {
        console.error('Do your custom error handling here. I am just ganna log it out: ', error);
        res.status(500).send(error);
    })
})

async function scanDynamoRecords(scanParams, itemArray) {
    try {
        const dynamoData = await dynamodb.scan(scanParams).promise();
        itemArray = itemArray.concat(dynamoData.Items);
        if (dynamoData.LastEvaluatedKey) {
        scanParams.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
        return await scanDynamoRecords(scanParams, itemArray);
        }
        return itemArray;
    } catch(error) {
        throw new Error(error);
    }
}

async function scanDynamoRecords_scanCount(scanParams, itemArray) {
    try {
        const dynamoData = await dynamodb.scan(scanParams).promise();
        itemArray = itemArray.concat(dynamoData.ScannedCount);
        if (dynamoData.LastEvaluatedKey) {
        scanParams.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
        return await scanDynamoRecords(scanParams, itemArray);
        }
        return itemArray;
    } catch(error) {
        throw new Error(error);
    }
}

module.exports = router;