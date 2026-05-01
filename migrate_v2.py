import sqlite3

def run_migration():
    conn = sqlite3.connect('sql_app.db')
    cursor = conn.cursor()
    
    # 1. Add category column to products if not exists
    try:
        cursor.execute('ALTER TABLE products ADD COLUMN category TEXT DEFAULT "Collection"')
        print("Column 'category' added to table 'products'")
    except sqlite3.OperationalError:
        print("Column 'category' already exists in products")
        
    # 2. Create product_images table if not exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS product_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            image_url TEXT,
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    ''')
    print("Table 'product_images' created or already exists")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    run_migration()
