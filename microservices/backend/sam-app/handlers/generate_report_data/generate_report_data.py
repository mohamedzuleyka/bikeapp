import os
import boto3
import json
from datetime import datetime
import html

# Set up DynamoDB client
dynamodb = boto3.resource('dynamodb')
products_table = dynamodb.Table('Products')
inventory_table = dynamodb.Table('Inventory')

def lambda_handler(event, context):
    # Retrieve product data from Products table
    product_data = get_product_data()

    # Retrieve inventory data from Inventory table
    inventory_data = get_inventory_data()

    # # Combine product and inventory data
    report_data = combine_product_inventory_data(product_data, inventory_data)

    return {'report_data': report_data}

def get_product_data():
    try:
        response = products_table.scan()
        return response['Items']
    except Exception as e:
        print(f"Error retrieving product data: {e}")
        raise e

def get_inventory_data():
    try:
        response = inventory_table.scan()
        return response['Items']
    except Exception as e:
        print(f"Error retrieving inventory data: {e}")
        raise e

def combine_product_inventory_data(product_data, inventory_data):
    report_data = []
    for product in product_data:
        product_info = {
            'name': product['product_name'],
            'price': product['price'],
            'quantity': 0,
        }
        for inventory in inventory_data:
            if inventory['product_id'] == product['id']:
                product_info['quantity'] = inventory['quantity']
        report_data.append(product_info)
    return report_data
