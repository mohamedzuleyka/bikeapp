import boto3
import json

# Create a DynamoDB resource
dynamodb = boto3.resource('dynamodb')

# Connect to the DynamoDB table named 'Inventory'
table = dynamodb.Table('Inventory')

## Add all of the items from a json file named 'inventory.json' to the 'Inventory' table
with open("inventory.json") as json_file:
    orders = json.load(json_file)
    for order in orders:
        table.put_item(
            Item=order
        )

print("Finished populating DynamoDB table named Inventory.")