from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)
DB_PATH = "Database/materials.db"

def query_db(query, args=(), one=False):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(query, args)
    result = cursor.fetchall()
    conn.commit()
    conn.close()
    return (result[0] if result else None) if one else result

@app.route('/')
def index():
    return render_template('index.html')

# Get all regions
@app.route('/api/regions')
def get_regions():
    rows = query_db("SELECT id, region_name FROM regions")
    regions = [{"id": r[0], "name": r[1]} for r in rows]
    return jsonify(regions)


if __name__ == "__main__":
    app.run(debug=True)








# Get all materials and prices for a region

# @app.route('/api/prices/<int:region_id>')
# def get_prices(region_id):
#     rows = query_db(
#         "SELECT m.id, m.material_name, mp.price "
#         "FROM material_prices mp "
#         "JOIN materials m ON m.id = mp.material_id "
#         "WHERE mp.region_id = ?",
#         (region_id,)
#     )
#     prices = [{"id": r[0], "material": r[1], "price": r[2]} for r in rows]
#     return jsonify(prices)

# # Update price
# @app.route('/api/prices/update', methods=['POST'])
# def update_price():
#     data = request.json
#     region_id = data['region_id']
#     material_id = data['material_id']
#     new_price = data['price']

#     query_db(
#         "UPDATE material_prices SET price = ? WHERE region_id = ? AND material_id = ?",
#         (new_price, region_id, material_id)
#     )
#     return jsonify({"status": "success"})

# if __name__ == '__main__':
#     app.run(debug=True)