#!/bin/bash

echo "============ Adding product data to DynamoDB ============"
cd /home/zuleykam/bike_app/microservices/backend/utils/create_products/
python create_products.py
echo "Finished populating products data to DynamoDB."

echo "============ Adding orders data to DynamoDB ============"
cd /home/zuleykam/bike_app/microservices/backend/utils/create_orders/
python create_orders.py
echo "Finished populating orders data to DynamoDB."

echo "============ Adding images to Amazon S3 ============"
cd /home/zuleykam/bike_app/microservices/backend/utils/s3/
python create_images_bucket.py
echo "Finished populating images data to Amazon S3."

echo "============ Adding inventory data to DynamoDB ============"
cd /home/zuleykam/bike_app/microservices/backend/utils/create_inventory
python create_inventory.py
echo "Finished populating inventory data to DynamoDB."

echo "============ Adding report to Amazon S3 ============"
cd /home/zuleykam/bike_app/microservices/backend/utils/create_report
bucket=$(python create_report_bucket.py)
aws s3 cp report.html s3://$bucket/ --cache-control "max-age=0"
cd /home/zuleykam/bike_app/microservices/backend/sam-app/handlers/generate_html
sed -i "s/\s*'Bucket':\s*'report-.*',/\t\t'Bucket': '$bucket',/" generate_html.py
echo "generate_html.py Lambda function handler is now updated to use the Amazon S3 bucket named $bucket."
echo "Finished uploading report file to Amazon S3."
