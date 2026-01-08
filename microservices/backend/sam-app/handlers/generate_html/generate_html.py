import os
import boto3
import json
from datetime import datetime
import html

def lambda_handler(event, context):
    # # Generate HTML report
    html_report = create_html(event['report_data'])
    write_report(html_report)

    return {
        'message': 'Report published to S3'
    }

def write_report(html_str):
    s3 = boto3.client('s3')

    params = {
		'Bucket': '',
        'Key': 'report.html',
        'Body': html_str.encode(),
        'CacheControl': 'max-age=0',
        'ContentType': 'text/html'
    }

    s3.put_object(**params)

def create_html(report_data):
    html_str = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Inventory Report</title>
        <style>
            table {
                border-collapse: collapse;
                width: 100%;
            }
            th, td {
                text-align: left;
                padding: 8px;
                border-bottom: 1px solid #ddd;
            }
            th {
                background-color: #f2f2f2;
            }
        </style>
    </head>
    <body>
        <h1>Inventory Report</h1>
        <table>
            <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
            </tr>
    """

    for product in report_data:
        name = product['name']
        quantity = product['quantity']
        price = product['price']
        html_str += f"""
        <tr>
            <td>{name}</td>
            <td>{price}</td>
            <td>{quantity}</td>
        </tr>
        """
    html_str += """
        </table>
    </body>
    </html>
    """

    html_str = html_str.replace("\n", "")
    return html_str
