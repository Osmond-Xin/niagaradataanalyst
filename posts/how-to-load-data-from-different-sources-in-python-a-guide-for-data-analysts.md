---  
author : "Osmond Xin"  
categories : ["Python", "Guide", "Code"]  
date : "2025-03-05 11:09:24"  
description : "How to Load Data from Different Sources in Python A Guide for Data Analysts" 
slug : "how-to-load-data-from-different-sources-in-python-a-guide-for-data-analysts"  
summary : "How to Load Data from Different Sources in Python A Guide for Beginner Data Analysts"  
tags : ["Python","Data Loading","Code","CSV","Excel","SQL","API"]  
title : "How to Load Data from Different Sources in Python A Guide for Data Analysts"  

---
The following are common Python methods for data analysts to load data from data source. I summarized and recorded for reference and copy&paste.

## 1. CSV

```python
# Import the pandas library - the most popular data analysis library in Python
# 导入pandas库 - Python中最流行的数据分析库
import pandas as pd

# Load CSV file into a DataFrame (table-like structure)
# 将CSV文件加载到DataFrame(表格结构)中
df = pd.read_csv('data.csv')

# Display the first 5 rows to verify data was loaded correctly
# 显示前5行数据以验证数据是否正确加载
print("First 5 rows of the dataset:")
print(df.head())

# Get basic information about the dataset (data types, non-null values)
# 获取数据集的基本信息(数据类型、非空值)
print("\nDataset information:")
print(df.info())

# Get statistical summary of numerical columns
# 获取数值列的统计摘要
print("\nStatistical summary:")
print(df.describe())
```

## 2. Excel

```python
# Import pandas for data manipulation
# 导入pandas进行数据处理
import pandas as pd

# Load Excel file - specify sheet_name to select specific worksheet
# 加载Excel文件 - 指定sheet_name来选择特定的工作表
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')

# Alternative: Load all sheets from Excel file into a dictionary of DataFrames
# 替代方法：将Excel文件中的所有工作表加载到DataFrame字典中
all_sheets = pd.read_excel('data.xlsx', sheet_name=None)

# Access individual sheet from the dictionary
# 从字典中访问单个工作表
sheet1_data = all_sheets['Sheet1']

print("Excel data successfully loaded!")
print(f"Number of rows: {len(df)}")
print(f"Number of columns: {len(df.columns)}")
print(f"Column names: {df.columns.tolist()}")
```

## 3. JSON file

```python
# Import pandas and json libraries
# 导入pandas和json库
import pandas as pd
import json

# Method 1: Using pandas to directly read JSON
# 方法1：使用pandas直接读取JSON
df = pd.read_json('data.json')
print("JSON data loaded using pandas:")
print(df.head())

# Method 2: Using json module for more complex JSON structures
# 方法2：使用json模块处理更复杂的JSON结构
with open('complex_data.json', 'r') as file:
    json_data = json.load(file)
    
# Convert nested JSON to DataFrame (if needed)
# 将嵌套的JSON转换为DataFrame(如果需要)
# Example for nested data - adjust based on your JSON structure
# 嵌套数据的示例 - 根据您的JSON结构进行调整
if isinstance(json_data, list):
    df_nested = pd.json_normalize(json_data)
    print("\nNested JSON data converted to DataFrame:")
    print(df_nested.head())
```

## 4. SQL

```python
# Import required libraries
# 导入所需的库
import pandas as pd
import mysql.connector
from sqlalchemy import create_engine
import pymysql


# Method 1: Using SQLAlchemy (Recommended Method)
# 方法1：使用SQLAlchemy（推荐方法）
def load_data_from_mysql_sqlalchemy():
    """
    Advanced method to load data from MySQL using SQLAlchemy
    使用SQLAlchemy从MySQL加载数据的高级方法
    """
    try:
        # Create SQLAlchemy engine
        # 创建SQLAlchemy引擎
        # Format: mysql+pymysql://username:password@host:port/database
        engine = create_engine(
            'mysql+pymysql://your_username:your_password@localhost:3306/your_database'
        )

        # Method 1.1: Load data using SQL query
        # 方法1.1：使用SQL查询加载数据
        query = """
        SELECT 
            o.order_id,
            o.order_date,
            c.customer_name,
            p.product_name,
            od.quantity,
            od.unit_price
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        JOIN order_details od ON o.order_id = od.order_id
        JOIN products p ON od.product_id = p.product_id
        WHERE o.order_date >= '2023-01-01'
        """
        
        df_query = pd.read_sql(query, engine)
        print("\nData loaded using SQL query:")
        print(df_query.head())

        # Method 1.2: Load entire table
        # 方法1.2：加载整个表
        df_table = pd.read_sql_table('customers', engine)
        print("\nEntire customers table loaded:")
        print(df_table.head())

        # Method 1.3: Load data in chunks (for large datasets)
        # 方法1.3：分块加载数据（适用于大型数据集）
        chunk_size = 1000
        chunks = pd.read_sql(query, engine, chunksize=chunk_size)
        
        # Process chunks
        # 处理数据块
        for chunk_number, chunk in enumerate(chunks):
            print(f"\nProcessing chunk {chunk_number + 1}:")
            print(f"Number of rows: {len(chunk)}")
            # Add your data processing logic here
            # 在这里添加数据处理逻辑

        return df_query

    except Exception as e:
        print(f"Error: {e}")
        return None
        
# Method 2: Using mysql-connector-python (Basic Method)
# 方法2：使用mysql-connector-python（基础方法）
def load_data_from_mysql_basic():
    """
    Basic method to load data from MySQL using mysql-connector-python
    使用mysql-connector-python从MySQL加载数据的基础方法
    """
    try:
        # Establish connection to MySQL database
        # 建立与MySQL数据库的连接
        connection = mysql.connector.connect(
            host='localhost',          # Database host
            user='your_username',      # Your MySQL username
            password='your_password',  # Your MySQL password
            database='your_database'   # Your database name
        )

        # Create cursor object
        # 创建游标对象
        cursor = connection.cursor()

        # Execute SQL query
        # 执行SQL查询
        query = """
        SELECT 
            customer_id,
            customer_name,
            email,
            created_at
        FROM customers
        WHERE created_at >= '2023-01-01'
        LIMIT 1000
        """
        cursor.execute(query)

        # Fetch all results
        # 获取所有结果
        results = cursor.fetchall()

        # Convert to DataFrame
        # 转换为DataFrame
        df = pd.DataFrame(results, columns=[
            'customer_id',
            'customer_name',
            'email',
            'created_at'
        ])

        print("Data loaded successfully using mysql-connector-python:")
        print(df.head())

        return df

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

    finally:
        # Close cursor and connection
        # 关闭游标和连接
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()


# Method 3: Using PyMySQL (Alternative Method)
# 方法3：使用PyMySQL（替代方法）
def load_data_from_mysql_pymysql():
    """
    Alternative method to load data from MySQL using PyMySQL
    使用PyMySQL从MySQL加载数据的替代方法
    """
    try:
        # Establish connection
        # 建立连接
        connection = pymysql.connect(
            host='localhost',
            user='your_username',
            password='your_password',
            database='your_database',
            charset='utf8mb4'
        )

        # Load data using pandas
        # 使用pandas加载数据
        query = """
        SELECT 
            product_id,
            product_name,
            category,
            price,
            stock_quantity
        FROM products
        WHERE category = 'Electronics'
        """
        
        df = pd.read_sql(query, connection)
        print("\nData loaded using PyMySQL:")
        print(df.head())

        return df

    except Exception as e:
        print(f"Error: {e}")
        return None

    finally:
        if 'connection' in locals():
            connection.close()

# Example usage with error handling and connection pooling
# 使用错误处理和连接池的示例
def load_data_with_connection_pool():
    """
    Advanced example with connection pooling and comprehensive error handling
    带有连接池和全面错误处理的高级示例
    """
    from sqlalchemy.pool import QueuePool

    try:
        # Create engine with connection pooling
        # 创建带有连接池的引擎
        engine = create_engine(
            'mysql+pymysql://your_username:your_password@localhost:3306/your_database',
            poolclass=QueuePool,
            pool_size=5,  # Number of connections to keep open
            max_overflow=10,  # Maximum number of connections to create
            pool_timeout=30,  # Seconds to wait before giving up on getting a connection
            pool_recycle=1800  # Recycle connections after 30 minutes
        )

        # Test connection
        # 测试连接
        with engine.connect() as connection:
            result = connection.execute("SELECT 1")
            print("Database connection successful!")

        # Load data with retry logic
        # 使用重试逻辑加载数据
        max_retries = 3
        retry_count = 0

        while retry_count < max_retries:
            try:
                query = """
                SELECT 
                    t.transaction_id,
                    t.transaction_date,
                    c.customer_name,
                    SUM(od.quantity * od.unit_price) as total_amount
                FROM transactions t
                JOIN customers c ON t.customer_id = c.customer_id
                JOIN order_details od ON t.order_id = od.order_id
                GROUP BY t.transaction_id, t.transaction_date, c.customer_name
                ORDER BY t.transaction_date DESC
                LIMIT 1000
                """
                
                df = pd.read_sql(query, engine)
                print("\nTransaction data loaded successfully:")
                print(df.head())
                return df

            except Exception as e:
                retry_count += 1
                if retry_count == max_retries:
                    print(f"Failed to load data after {max_retries} attempts: {e}")
                    return None
                print(f"Attempt {retry_count} failed, retrying...")
                time.sleep(1)  # Wait before retrying

    except Exception as e:
        print(f"Error setting up connection pool: {e}")
        return None

# Usage example
# 使用示例
if __name__ == "__main__":
    # Load data using different methods
    # 使用不同方法加载数据
    
    print("\nLoading data using SQLAlchemy...")
    df_sqlalchemy = load_data_from_mysql_sqlalchemy()
    
    print("Loading data using basic method...")
    df_basic = load_data_from_mysql_basic()
    
    print("\nLoading data using PyMySQL...")
    df_pymysql = load_data_from_mysql_pymysql()
    
    print("\nLoading data with connection pooling...")
    df_pool = load_data_with_connection_pool()
```

## 5. Web Scraping

```python
# Import required libraries
# 导入所需的库
import pandas as pd
import requests
from bs4 import BeautifulSoup

# Method 1: Using pandas to read HTML tables directly
# 方法1：使用pandas直接读取HTML表格
url = 'https://en.wikipedia.org/wiki/List_of_countries_by_population'
tables = pd.read_html(url)

# Select the table of interest (usually there are multiple tables)
# 选择感兴趣的表格(通常有多个表格)
population_table = tables[0]  # First table on the page
print("Table loaded from Wikipedia:")
print(population_table.head())

# Method 2: Using BeautifulSoup for more complex web scraping
# 方法2：使用BeautifulSoup进行更复杂的网页抓取
response = requests.get('https://example.com/data')
soup = BeautifulSoup(response.text, 'html.parser')

# Example: Extract all links from a page
# 示例：从页面提取所有链接
links = []
for anchor in soup.find_all('a'):
    links.append({
        'text': anchor.text,
        'href': anchor.get('href')
    })

links_df = pd.DataFrame(links)
print("\nLinks extracted from webpage:")
print(links_df.head())
```

## 6. API

```python
# Import required libraries
# 导入所需的库
import pandas as pd
import requests
import json

# Make API request to fetch data
# 发送API请求获取数据
api_url = 'https://api.example.com/data'
response = requests.get(api_url)

# Check if request was successful
# 检查请求是否成功
if response.status_code == 200:
    # Parse JSON response
    # 解析JSON响应
    data = response.json()
    
    # Convert to DataFrame
    # 转换为DataFrame
    df = pd.DataFrame(data)
    
    print("Data loaded from API:")
    print(df.head())
else:
    print(f"Error fetching data: {response.status_code}")
    
# Example with authentication and parameters
# 带有认证和参数的示例
def get_api_data_with_auth(api_url, api_key, parameters):
    """
    Fetch data from an API requiring authentication
    从需要认证的API获取数据
    
    Parameters:
    - api_url: The URL of the API endpoint
    - api_key: Your API key for authentication
    - parameters: Dictionary of query parameters
    
    Returns:
    - DataFrame containing the API response data
    """
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(api_url, headers=headers, params=parameters)
    
    if response.status_code == 200:
        return pd.DataFrame(response.json())
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None

# Example usage:
# 示例用法：
# df = get_api_data_with_auth(
#     'https://api.example.com/data',
#     'your_api_key_here',
#     {'limit': 100, 'category': 'sales'}
# )
```

## 7. Large CSV (processing in chunks)

```python
# Import required libraries
# 导入所需的库
import pandas as pd

# For large files, use chunksize parameter to process in chunks
# 对于大文件，使用chunksize参数分块处理
chunk_size = 10000  # Adjust based on your system's memory
chunks = pd.read_csv('large_data.csv', chunksize=chunk_size)

# Process each chunk separately
# 分别处理每个数据块
results = []

for chunk_number, chunk in enumerate(chunks):
    # Example: Calculate average of a column in each chunk
    # 示例：计算每个数据块中某列的平均值
    avg = chunk['value_column'].mean()
    results.append({
        'chunk_number': chunk_number,
        'avg_value': avg,
        'chunk_size': len(chunk)
    })
    
    # Optionally, print progress
    # 可选：打印进度
    print(f"Processed chunk {chunk_number}, average value: {avg}")

# Combine results
# 合并结果
results_df = pd.DataFrame(results)
print("\nSummary of chunk processing:")
print(results_df)
```

## 8. zip

```python
# Import pandas
# 导入pandas
import pandas as pd

# Read from compressed files directly (no need to decompress)
# 直接从压缩文件读取(无需解压)

# From ZIP file
# 从ZIP文件
df_zip = pd.read_csv('data.zip')

# From GZ file
# 从GZ文件
df_gz = pd.read_csv('data.csv.gz')

# From BZ2 file
# 从BZ2文件
df_bz2 = pd.read_csv('data.csv.bz2')

print("Data loaded from compressed file successfully!")
print(f"Number of rows: {len(df_zip)}")
```

## 9. CSV in different formats

```python
# Import pandas
# 导入pandas
import pandas as pd

# Handle different CSV formats and issues
# 处理不同的CSV格式和问题

# Custom delimiter (e.g., semicolon or tab)
# 自定义分隔符(例如，分号或制表符)
df_semicolon = pd.read_csv('european_data.csv', sep=';')
df_tab = pd.read_csv('tab_data.tsv', sep='\t')

# Specify encoding for special characters
# 为特殊字符指定编码
df_encoded = pd.read_csv('international_data.csv', encoding='utf-8')
# For older Windows files
# 对于较旧的Windows文件
df_latin = pd.read_csv('old_windows_file.csv', encoding='latin-1')

# Handle files with no header
# 处理没有标题的文件
df_no_header = pd.read_csv('no_header.csv', header=None, 
                          names=['column1', 'column2', 'column3'])

# Skip rows (e.g., comments or metadata at top of file)
# 跳过行(例如，文件顶部的注释或元数据)
df_skip = pd.read_csv('data_with_notes.csv', skiprows=3)

# Handle missing values
# 处理缺失值
df_missing = pd.read_csv('data_with_blanks.csv', na_values=['N/A', 'missing'])

print("All CSV variations loaded successfully!")
```

